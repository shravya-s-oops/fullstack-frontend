import React, { useState } from "react";
import axios from "axios";
import Login from "./Login";

function App() {
  const [form, setForm] = useState({
    name: "",
    age: "",
    healthId: "",
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

  if (!isLoggedIn) return <Login onLogin={() => setIsLoggedIn(true)} />;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.consent) {
      alert("Consent is required.");
      return;
    }

    let imageUrl = "";
    try {
      if (image) {
        const formData = new FormData();
        formData.append("image", image);
        const res = await axios.post("http://localhost:3001/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        imageUrl = res.data.imageUrl;
      }
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed");
      return;
    }

    const healthId = "HID-" + Math.random().toString(36).substring(2, 10).toUpperCase();
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

    alert(`Saved successfully. Health ID: ${healthId}`);
    setForm({
      name: "",
      age: "",
      healthId: "",
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
        await axios.post("http://localhost:3001/api/upload/sync", record);
        const index = updated.findIndex((r) => r.healthId === record.healthId);
        if (index !== -1) updated[index].status = "uploaded";
      } catch (err) {
        alert("Sync failed.");
        return;
      }
    }

    localStorage.setItem("childRecords", JSON.stringify(updated));
    alert("Synced successfully.");
    window.location.reload();
  };

  const handleSearch = async () => {
    setSearchResult(null);
    setSearchNotFound(false);
    try {
      const res = await axios.get(`http://localhost:3001/api/upload/record/${searchId}`);
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
        <input name="name" placeholder="Child's Name" value={form.name} onChange={handleChange} required />
        <input name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} required />
        <input name="weight" type="number" placeholder="Weight" value={form.weight} onChange={handleChange} required />
        <input name="height" type="number" placeholder="Height" value={form.height} onChange={handleChange} required />
        <input name="parentName" placeholder="Parent Name" value={form.parentName} onChange={handleChange} required />
        <input name="malnutritionSigns" placeholder="Malnutrition Signs" value={form.malnutritionSigns} onChange={handleChange} />
        <input name="recentIllness" placeholder="Recent Illness" value={form.recentIllness} onChange={handleChange} />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <label>
          <input type="checkbox" name="consent" checked={form.consent} onChange={handleChange} />
          Parental Consent
        </label>
        <button type="submit" disabled={!form.consent}>Save Offline</button>
      </form>

      <hr />
      <h3>Saved Records</h3>
      {savedRecords.length === 0 && <p>No records yet.</p>}
      {savedRecords.map((r, i) => (
        <div key={i} style={{ border: "1px solid #ccc", padding: 10, margin: "10px 0" }}>
          <p><b>{r.name}</b> (ID: {r.healthId})</p>
          <p>Status: {r.status}</p>
          {r.photoUrl && <img src={r.photoUrl} alt="child" width="100" />}
        </div>
      ))}
      <button onClick={handleSync}>Sync Now</button>

      <hr />
      <h3>Search Record</h3>
      <input placeholder="Enter Health ID" value={searchId} onChange={(e) => setSearchId(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      {searchResult && (
        <div style={{ border: "1px solid green", padding: 10, marginTop: 10 }}>
          <p>Name: {searchResult.name}</p>
          <p>Age: {searchResult.age}</p>
          <p>Status: {searchResult.status}</p>
          {searchResult.photoUrl && <img src={searchResult.photoUrl} alt="child" width="100" />}
        </div>
      )}
      {searchNotFound && <p style={{ color: "red" }}>Health ID not found.</p>}
    </div>
  );
}

export default App;
