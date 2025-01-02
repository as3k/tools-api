import sharp from 'sharp';
import axios from 'axios';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Validate HTTP method
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed. Use GET.' });
    }

    // Parse query parameters
    const { url, width, quality } = req.query;

    if (!url) {
      return res.status(400).json({ error: "Missing required parameter 'url'." });
    }

    // Default settings
    const maxWidth = parseInt(width, 10) || 1920;
    const outputQuality = parseInt(quality, 10) || 85;

    // Fetch the image from the provided URL
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(response.data);

    // Extract the file name from the URL
    const originalFileName = path.basename(new URL(url).pathname);
    const outputFileName = originalFileName.replace(/\.[^/.]+$/, '.webp'); // Replace extension with `.webp`

    // Resize and optimize the image to WebP
    const optimizedImage = await sharp(imageBuffer)
      .resize({ width: maxWidth })
      .webp({ quality: outputQuality })
      .toBuffer();

    // Set headers for the browser
    res.setHeader('Content-Type', 'image/webp');
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${outputFileName}"`
    );

    // Send the optimized image
    res.status(200).send(optimizedImage);
  } catch (error) {
    console.error('Error processing image:', error);
    res.status(500).json({ error: 'Image processing failed.' });
  }
}