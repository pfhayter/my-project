require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const { Client } = require('ssh2');

const app = express();

app.use(bodyParser.json());

// Define a new route to handle fetching data from Zabbix and executing SSH commands
app.get('/fetch-data', async (req, res) => {
  try {
    // Fetch data from Zabbix
    const zabbixResponse = await axios.post(process.env.zaSERVER, {
      jsonrpc: '2.0',
      method: 'apiinfo.version',
      id: 1,
      auth: process.env.zaKEY,
      params: {},
    });
    
    // Execute SSH command
    const conn = new Client();
    let sshOutput = '';
    conn.on('ready', () => {
      conn.exec('port show status', (err, stream) => {
        if (err) throw err;
        stream.on('data', (data) => {
          sshOutput += data;
        }).on('close', () => {
          conn.end();
          // Send Zabbix data and SSH output to frontend
          res.json({ zabbixData: zabbixResponse.data, sshData: sshOutput });
        });
      });
    }).connect({
      host: '172.27.11.190',
      port: 22,
      username: process.env.shUSER,
      password: process.env.shPASSWORD
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.get('/fetch-host-groups', async (req, res) => {
    try {
      const zabbixResponse = await axios.post(process.env.zaSERVER, {
        jsonrpc: '2.0',
        method: 'hostgroup.get',
        id: 1,
        auth: process.env.zaKEY,  // Replace with your auth token if necessary
        params: {
          output: ['groupid', 'name'],
        },
      });
      console.log(zabbixResponse.data.result);  // Log the response data to the console
      res.json(zabbixResponse.data.result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  
  app.get('/fetch-hosts', async (req, res) => {
    const { groupId, filter } = req.query;
    try {
      const zabbixResponse = await axios.post(process.env.zaSERVER, {
        jsonrpc: '2.0',
        method: 'host.get',
        id: 1,
        auth: process.env.zaKEY,  // assuming you have set up dotenv as previously instructed
        params: {
          groupids: groupId,
          search: {
            name: filter,
          },
          output: ['hostid', 'name'],
          selectInterfaces: ['ip'],  // Adjust this line
        },
      });
      res.json(zabbixResponse.data.result);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });
  


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  // console.log(process.env.zaSERVER,process.env.zaKEY,process.env.shUSER,process.env.shPASSWORD);
});
