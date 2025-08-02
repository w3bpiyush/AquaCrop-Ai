require('dotenv').config(); 
const express = require('express');
const waterRoutes = require('./routes/waterRoutes');

const app = express();
app.use(express.json());

const port = 3001;

app.use('/api/water', waterRoutes);

app.get('/', (req, res) => {
  res.send({ status: 'Server is running', success: true });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
