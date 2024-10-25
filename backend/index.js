const express = require('express');
const cors = require('cors');
const connectDB = require('./db'); 
const weatherRoutes = require('./routes');  

const app = express();
app.use(cors());  
app.use(express.json());  

// Connect to MongoDB
connectDB();


app.use('/api', weatherRoutes);  
app.get("/",(req,res)=>{
  res.json("hello")
})

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
