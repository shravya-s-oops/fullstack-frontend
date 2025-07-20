import React, { useEffect, useState } from "react";

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const API_URL = process.env.REACT_APP_BACKEND_URL;

    fetch(`${API_URL}/api/child-health`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data from backend:", data);
        setData(data);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, []);

  return (
    <div>
      <h1>Child Health Records</h1>
      <ul>
        {data.map((record, index) => (
          <li key={index}>
            {record.name} - {record.age}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

