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
import React, { useState } from "react";
import axios from "axios";
import Login from "./Login";

function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    weight: "",
    height: "",
    parentName: "",
    malnutritionSigns: "",
    recentIllness: "",
    consent: false,
  });

  const [image, setImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchNotFound, setSearchNotFound] = useState(false);

  const apiBase = process.env.REACT_APP_API_BASE || "http://localhost:3001";

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) return alert("Consent is required");

    let imageUrl = "";
    try {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const res = await axios.post(`${apiBase}/api/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.imageUrl;
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed");
    }

    const healthId = "HID-" + Math.random().toString(36).slice(2, 10).toUpperCase();
    const fullData = {
      ...form,
      photoUrl: imageUrl,
      healthId,
      timestamp: new Date().toISOString(),
      status: "pending",
    };

    const existing = JSON.parse(localStorage.getItem("childRecords") || "[]");
    existing.push(fullData);
    localStorage.setItem("childRecords", JSON.stringify(existing));
    alert(`Saved. Health ID: ${healthId}`);

    setForm({
      name: "",
      age: "",
      weight: "",
      height: "",
      parentName: "",
      malnutritionSigns: "",
      recentIllness: "",
      consent: false,
    });
    setImage(null);
  };

  const handleSync = async () => {
    const saved = JSON.parse(localStorage.getItem("childRecords") || "[]");
    const pending = saved.filter((r) => r.status === "pending");
    const updated = [...saved];

    for (let record of pending) {
      try {
        await axios.post(`${apiBase}/api/upload/sync`, record);
        const index = updated.findIndex((r) => r.healthId === record.healthId);
        if (index !== -1) updated[index].status = "uploaded";
      } catch (err) {
        alert("Sync failed");
        return;
      }
    }

    localStorage.setItem("childRecords", JSON.stringify(updated));
    alert("Synced successfully");
    window.location.reload();
  };

  const handleSearch = async () => {
    setSearchResult(null);
    setSearchNotFound(false);
    try {
      const res = await axios.get(`${apiBase}/api/upload/record/${searchId}`);
      setSearchResult(res.data);
    } catch {
      setSearchNotFound(true);
    }
  };

  const savedRecords = JSON.parse(localStorage.getItem("childRecords") || "[]");

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto" }}>
      <h2>Child Health Form</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Child's Name" onChange={handleChange} value={form.name} required />
        <input name="age" type="number" placeholder="Age" onChange={handleChange} value={form.age} required />
        <input name="weight" type="number" placeholder="Weight" onChange={handleChange} value={form.weight} required />
        <input name="height" type="number" placeholder="Height" onChange={handleChange} value={form.height} required />
        <input name="parentName" placeholder="Parent Name" onChange={handleChange} value={form.parentName} required />
        <input name="malnutritionSigns" placeholder="Malnutrition Signs" onChange={handleChange} value={form.malnutritionSigns} />
        <input name="recentIllness" placeholder="Recent Illness" onChange={handleChange} value={form.recentIllness} />
        <input type="file" onChange={handleImageChange} accept="image/*" />
        <label>
          <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} /> I have parental consent
        </label>
        <button type="submit" disabled={!form.consent}>Save Offline</button>
      </form>

      <hr />
      <h3>Saved Records</h3>
      {savedRecords.length === 0 && <p>No records</p>}
      {savedRecords.map((r, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <p><b>{r.name}</b> (ID: {r.healthId})</p>
          <p>Status: {r.status}</p>
          {r.photoUrl && <img src={r.photoUrl} alt="child" width="100" />}
        </div>
      ))}
      <button onClick={handleSync}>Sync Now</button>

      <hr />
      <h3>Search by Health ID</h3>
      <input value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="Enter Health ID" />
      <button onClick={handleSearch}>Search</button>
      {searchResult && (
        <div style={{ border: "1px solid green", padding: 10, marginTop: 10 }}>
          <p>Name: {searchResult.name}</p>
          <p>Age: {searchResult.age}</p>
          <p>Status: {searchResult.status}</p>
          {searchResult.photoUrl && <img src={searchResult.photoUrl} alt="found" width="100" />}
        </div>
      )}
      {searchNotFound && <p style={{ color: "red" }}>Health ID not found</p>}
    </div>
  );
}

export default App;

