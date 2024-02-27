
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
var user=require("./routes/route")

const app = express();

app.use(cors());
const PORT = process.env.PORT || 3001;

mongoose.connect('mongodb+srv://sebinthomas2025:sebinsebin@cluster0.twto8fl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.use(user)
