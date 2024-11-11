const express = require('express');
var cors = require('cors')
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const noteRoutes = require('./src/routes/noteRoutes');

app.use(cors());
app.use(express.json());

app.use('/notes', noteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
