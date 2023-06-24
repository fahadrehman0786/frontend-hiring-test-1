import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import axios from 'axios';

const MainCallsPage = () => {
  const [data, setData] = useState(null);
  const [token, setToken] = useState();
  const [archivedCalls, setArchivedCalls] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const loginResponse = await axios.post(
          'https://frontend-test-api.aircall.io/auth/login',
          { username: 'fahad', password: 'test123' }
        );

        setToken(loginResponse.data.access_token);

        const meResponse = await axios.get('https://frontend-test-api.aircall.io/calls', {
          headers: {
            Authorization: `Bearer ${loginResponse.data.access_token}`,
          },
        });

        const responseData = meResponse.data;
        setData(responseData.nodes);
        console.log(responseData.nodes);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleCallItemClick = async (call) => {
    console.log('This is tok ' + token);

    console.log('Clicked call:', call);
    const meResponse = await axios.get(`https://frontend-test-api.aircall.io/calls/${call.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(meResponse);
  };

  const handleArchiveCall = (call) => {
    setArchivedCalls((prevArchivedCalls) => [...prevArchivedCalls, call]);
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  if (!Array.isArray(data)) {
    console.log('Unexpected data structure:', data);
    return <div>Error: Invalid data structure</div>;
  }

  return (
    <div>
      {data.map((call) => (
        <div key={call.id}>
          <Link to={`/calldetailpage/${call.id}/${token}`}>
            <div>
              {call.from} - {call.to} - this is id {call.id}
            </div>
          </Link>
          <button onClick={() => handleArchiveCall(call)}>Archive</button>
        </div>
      ))}
      <h2>Archived Calls:</h2>
      {archivedCalls.map((call) => (
        <div key={call.id}>
          {call.from} - {call.to} - this is id {call.id}
        </div>
      ))}
    </div>
  );
};

export default MainCallsPage;
