// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const PptxGenJS = require('pptxgenjs');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { extractTextFromFiles } = require('./utils/fileParser');

// =================================================================
// ⚙️ 1. PROJECT SETUP AND MIDDLEWARE
// =================================================================

const app = express();
const port = process.env.PORT || 5001;

// Basic Middleware
app.use(cors());
app.use(express.json());

// Multer Configuration for handling file uploads
// We use memoryStorage to process files in memory without saving them to disk.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Initialize Google Generative AI Client
// const genAI = new GoogleGenerativeAI("");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Helper function to convert buffer to Base64 for Gemini API
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}

// =================================================================
// 🧠 2. INITIAL OUTLINE GENERATION API
// =================================================================

app.post('/api/generate', upload.any(), async (req, res) => {
  console.log('Received request for outline generation...');

  try {
    const { topic, slideCount } = req.body;
    const files = req.files || [];
    
    // Separate documents and images
    const documentFiles = files.filter(f => f.mimetype === 'application/pdf' || f.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    const imageFiles = files.filter(f => f.mimetype.startsWith('image/'));

    // Extract text from uploaded documents
    const contextText = await extractTextFromFiles(documentFiles);

    // Construct the prompt for the AI
    const prompt = `
      You are an expert presentation creator. Your task is to generate a JSON structure for a presentation.
      
      **Topic:** "${topic}"
      
      **Desired number of slides:** ${slideCount}
      
      **Context from uploaded documents:**
      ---
      ${contextText || 'No additional context was provided from documents.'}
      ---
      
      Based on the topic, context, and any provided images, generate a detailed presentation outline.
      
      **Instructions:**
      1.  Create a JSON object.
      2.  The root object must have a single key: "slides".
      3.  The "slides" key must be an array of slide objects.
      4.  Each slide object in the array must have two keys: "title" (a string) and "points" (an array of strings).
      5.  The "title" should be a concise heading for the slide.
      6.  The "points" array should contain the key bullet points for that slide.
      7.  Ensure the total number of slides is exactly ${slideCount}.
      8.  The first slide should be a title slide and the last should be a "Thank You" or "Q&A" slide.
      9.  Do NOT include any markdown formatting (like \`\`\`json) or any other text outside of the main JSON object in your response.
    `;

    // Prepare content parts for the multimodal model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const imageParts = imageFiles.map(file => fileToGenerativePart(file.buffer, file.mimetype));
    
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    let text = response.text();

    // Clean up potential markdown formatting from the AI response
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();

    // Parse the JSON and send it to the frontend
    const generatedOutline = JSON.parse(text);
    console.log('Successfully generated outline.');
    res.status(200).json(generatedOutline);

  } catch (error) {
    console.error('Error during outline generation:', error);
    res.status(500).json({ error: 'Failed to generate presentation outline.', details: error.message });
  }
});

// =================================================================
// 🚀 3. FINAL PRESENTATION EXPORT API
// =================================================================

/**
 * 🚀 FINAL PRESENTATION EXPORT API
 * This endpoint receives a finalized JSON outline and a template ID,
 * generates a .pptx file, and streams it back to the user for download.
 * It uses a 'base64' output to ensure compatibility with all hosting platforms.
 */
app.post('/api/export/final', async (req, res) => {
  console.log('Received request for presentation export...');

  try {
    // 1. Receive finalized data from the frontend
    const { slides, templateId } = req.body;

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return res.status(400).json({ error: 'Invalid slides data provided.' });
    }

    // 2. Programmatically build the presentation
    let pres = new PptxGenJS();
    pres.layout = 'LAYOUT_WIDE';

    // Apply basic styling based on the templateId
    switch (templateId) {
      case 'dark':
        pres.defineSlideMaster({
          title: 'DARK_MASTER',
          background: { color: '363636' },
          objects: [
            { line: { x: 0, y: 0.65, w: '100%', h: 0, line: { color: '00A6E2', width: 2 } } },
            { text: { text: 'Company Inc.', options: { x: 0.5, y: '95%', color: 'FFFFFF', fontSize: 10 } } }
          ]
        });
        break;
      case 'light':
      default:
        pres.defineSlideMaster({
          title: 'LIGHT_MASTER',
          background: { color: 'FFFFFF' },
          objects: [
            { line: { x: 0, y: 0.65, w: '100%', h: 0, line: { color: '00A6E2', width: 2 } } },
            { text: { text: 'Company Inc.', options: { x: 0.5, y: '95%', color: '808080', fontSize: 10 } } }
          ]
        });
        break;
    }
    
    // Loop through the slides array from the request
    for (const slideData of slides) {
      const slide = pres.addSlide({ masterName: templateId === 'dark' ? 'DARK_MASTER' : 'LIGHT_MASTER' });

      // Add the slide title
      slide.addText(slideData.title, {
        x: 0.5, y: 0.25, w: '90%', h: 1, 
        fontSize: 32, 
        bold: true,
        color: templateId === 'dark' ? 'FFFFFF' : '363636'
      });

      // Add the bullet points
      slide.addText(slideData.points.join('\n'), {
        x: 0.5, y: 1.5, w: '90%', h: 4, 
        fontSize: 18, 
        color: templateId === 'dark' ? 'F1F1F1' : '494949',
        bullet: true,
      });
    }

    // 3. Generate the file and stream it for download
    // Generate the file as a base64 string for maximum platform compatibility
    const base64String = await pres.write({ outputType: 'base64' });

    // Set the correct HTTP headers to trigger a file download in the browser
    res.setHeader('Content-Disposition', 'attachment; filename=YourPresentation.pptx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');

    // Convert the base64 string into a buffer that can be sent in the response
    const fileContents = Buffer.from(base64String, 'base64');
    
    console.log('Successfully created presentation. Sending file to client...');
    res.send(fileContents);

  } catch (error) {
    console.error('Error during presentation export:', error);
    res.status(500).json({ error: 'Failed to generate .pptx file.', details: error.message });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});