import axios from 'axios';

export const fetchData = async () => {
  try {
    const response = await axios.get('/fetch-data');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const fetchHostGroups = async () => {
    try {
      const response = await axios.get('/fetch-host-groups');
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  

  export const fetchHosts = async (groupId, filter) => {
    try {
      const response = await axios.get('/fetch-hosts', {
        params: { groupId, filter },
      });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };
  