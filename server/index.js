
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


