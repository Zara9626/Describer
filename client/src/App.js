import React, { useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import './App.css';
import TextField from '@mui/material/TextField';
import StraightIcon from '@mui/icons-material/Straight';
import Button from "@mui/material/Button";




function App() {

  const [image, setImage] = useState(null);
  const [describe, setDescribe] = useState("");

  // eslint-disable-next-line


  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    // Convert image to base64
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1]; // Remove the data URL prefix
      setImage(reader.result); // Set image for preview

      try {
        // Send image to backend
        const response = await axios.post('http://localhost:3500/image-describe', {
          image: base64Image,
        });
        setDescribe(response.data.describe); // Set description
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to generate description. Please try again.');
      }

    };

    reader.readAsDataURL(file); // Read the file as a data URL
  };


  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 90, width: '100ch' } }}
      noValidate
      autoComplete="off"
    >
      <div>
        <h1> Image description app!</h1>
        <TextField id="outlined-basic" label="Hello from front end!" variant="outlined" />

        <input type="file" onChange={handleImageUpload} />
        {image && <img src={image} alt="Uploaded" style={{ maxWidth: '100%', height: 'auto' }} />}
        {describe && <p>{describe}</p>}

        <Button onClick={() => setImage(null)}></Button>
        <Button variant="outlined" size="large" startIcon={<StraightIcon />}></Button>

      </div>
    </Box>
  );
}


export default App;
