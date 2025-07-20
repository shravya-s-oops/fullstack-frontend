const express = require("express");
const cors = require("cors");
const app = express();

const allowedOrigins = [
  "https://regal-boba-96e0c7.netlify.app"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json());

// your routes here
app.use("/api/child-health", require("./routes/childHealth"));

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
