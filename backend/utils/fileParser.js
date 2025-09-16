// utils/fileParser.js

const pdf = require('pdf-parse');
const mammoth = require('mammoth');

/**
 * Extracts text content from an array of uploaded files (PDFs and DOCXs).
 * @param {Array<Object>} files - Array of file objects from Multer.
 * @returns {Promise<string>} A single string containing all extracted text.
 */
const extractTextFromFiles = async (files = []) => {
  let combinedText = '';

  for (const file of files) {
    try {
      if (file.mimetype === 'application/pdf') {
        const data = await pdf(file.buffer);
        combinedText += data.text + '\n\n';
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const { value } = await mammoth.extractRawText({ buffer: file.buffer });
        combinedText += value + '\n\n';
      }
    } catch (error) {
      console.error(`Error processing file ${file.originalname}:`, error);
      // Optionally, you could decide to skip the file or throw the error
    }
  }

  return combinedText.trim();
};

module.exports = { extractTextFromFiles };