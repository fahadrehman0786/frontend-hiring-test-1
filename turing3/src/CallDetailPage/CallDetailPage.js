import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const CallDetailPage = () => {

  const { id, token } = useParams();
  const [callData, setCallData] = useState();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {



        const meResponse = await axios.get(`https://frontend-test-api.aircall.io/calls/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setCallData(meResponse.data)
          setIsLoading(false);

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  
  return (
    <div>
      <h2>Call Detail</h2>
      <p>Call ID: {id}</p>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>from: {callData.from}</p>
          <p>to: {callData.to}</p>
          {/* Additional code for displaying call details */}
        </>
      )}
    </div>
  );
  
};

export default CallDetailPage;
