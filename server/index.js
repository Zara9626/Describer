
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const multer = require("multer");
const app = express();
const port = process.env.PORT || 3500;


app.use(cors());



const upload = multer({ dest: 'uploads/' }) // handles temporary image storage


app.post('/image-describe', upload.single('image'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBase64 = convertImage64(imagePath);
    const describe = await describeImage(imageBase64);
    res.json({ describe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Try again' });
  }
});

//converting image to base64 

const convertImage64 = (imagePath) => {
  const fs = require('fs');
  const image = fs.readFileSync(imagePath);
  return Buffer.from(image).toString('base64');
}


const openai = new OpenAI({
  apiKey: "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"
});

async function describeImage(imageBase64) {
  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Describe this image in detail." },
          { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } },
        ],
      },
    ],
    max_tokens: 300,
  });
  return response.choices[0].message.content;
}


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


