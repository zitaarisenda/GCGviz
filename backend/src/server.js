const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const direksiRoutes = require('./routes/direksiRoutes');
const divisiRoutes = require('./routes/divisiRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Struktur Perusahaan API is running!');
});

app.use('/api/direksi', direksiRoutes);
app.use('/api/divisi', divisiRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 