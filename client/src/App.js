import React, { useEffect, useState } from 'react';
import { fetchHostGroups, fetchHosts } from './api';
import './App.css';

function App() {
  const [hostGroups, setHostGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [filter, setFilter] = useState('');
  const [hosts, setHosts] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [sshCommand, setSshCommand] = useState('');
  const [selectedIp, setSelectedIp] = useState('');

  useEffect(() => {
    const getHostGroups = async () => {
      const groups = await fetchHostGroups();
      setHostGroups(groups);
    };
    getHostGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      const getHosts = async () => {
        const hostList = await fetchHosts(selectedGroup, filter);
        setHosts(hostList);
      };
      getHosts();
    }
  }, [selectedGroup, filter]);

  const handleIpClick = (ip) => {
    setSelectedIp(ip);
    setModalOpen(true);
  };

  const handleCommandSubmit = (event) => {
    event.preventDefault();
    // Replace the line below with your actual logic to handle SSH command execution
    console.log(`Executing SSH command: ${sshCommand} on IP: ${selectedIp}`);
  };

  return (
    <div className="App">
      <select onChange={e => setSelectedGroup(e.target.value)}>
        <option value="">Select a host group</option>
        {hostGroups.map(group => (
          <option key={group.groupid} value={group.groupid}>{group.name}</option>
        ))}
      </select>
      <button type="se">Reset</button>
      <input
        type="text"
        placeholder="Filter hosts..."
        value={filter}
        onChange={e => setFilter(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Host Group</th>
            <th>Host Name</th>
            <th>Host Interface</th>
          </tr>
        </thead>
        <tbody>
          {hosts.map(host => (
            <tr key={host.hostid}>
              <td>{host.group}</td>
              <td>{host.name}</td>
              <td>
                {host.interfaces && host.interfaces.map(intf => (
                  <div key={intf.interfaceid}>
                    <a href="#" onClick={() => handleIpClick(intf.ip)}>{intf.ip}</a>
                  </div>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isModalOpen && (
        <div className="modal">
          <button onClick={() => setModalOpen(false)}>Close</button>
          <h2>SSH Command for IP: {selectedIp}</h2>
          <form onSubmit={handleCommandSubmit}>
            <input
              type="text"
              placeholder="Enter SSH command..."
              value={sshCommand}
              onChange={(e) => setSshCommand(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default App;
