import React, { useEffect, useState } from 'react';

function MyTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Assuming your JSON key in local storage is "recruiter1-2023-09-17"
    const jsonData = localStorage.getItem('recruiter1-2023-09-17');
    
    if (jsonData) {
      setData(JSON.parse(jsonData));
      console.log(jsonData);
    }
    console.log("data:",data.names);
  }, []);

  return (
    <div>
      <h1>Recruiter Data</h1>
      {data.names ?
      (<table className='table'>
        <thead>
          <tr>
            <th>S.No.</th>
            <th>Name</th>
            <th>Message</th>
            <th>Subject</th>
            <th>Recruiter</th>
            <th>Time Slots</th>
          </tr>
        </thead>
        <tbody>
            {
             data.names.map((name, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{name}</td>
              <td>{data.messages[index]}</td>
              <td>{data.subjects[index]}</td>
              <td>{data.recruiter}</td>
              <td>{data.timeSlots[index]}</td>
            </tr>
          ))}
        </tbody>
      </table>)
      :
      <p>No schedule today !</p>
      }
    </div>
  );
}

export default MyTable;
