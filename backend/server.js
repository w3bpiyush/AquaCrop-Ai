require('dotenv').config(); 
const express = require('express');
const waterRoutes = require('./routes/waterRoutes');
const cors = require('cors');
const app = express();
app.use(express.json());

const port = 3001;

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use('/api/water', waterRoutes);

app.get('/', (req, res) => {
  res.send({ status: 'Server is running', success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
