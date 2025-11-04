// API route that optimizes images via sharp, accepting either a remote URL (GET) or
// uploaded file/blob (POST) and returning a WebP response.

// Example (GET): /api/optimize?url=https://example.com/photo.jpg&width=800&quality=75
// Example (POST): multipart/form-data with `image` file plus optional width/quality fields.
import sharp from 'sharp';
import axios from 'axios';
import path from 'path';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // We'll parse manually via formidable or custom logic
  },
};

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // (1) Existing GET logic for ?url=...
      const { url, width, quality } = req.query;

      if (!url) {
        return res.status(400).json({ error: "Missing required parameter 'url'." });
      }

      let parsedUrl;
      try {
        parsedUrl = new URL(url);
      } catch {
        return res.status(400).json({ error: 'Invalid URL format.' });
      }

      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        return res
          .status(400)
          .json({ error: 'URL must use HTTP or HTTPS.' });
      }

      const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
      const fileExtension = path.extname(parsedUrl.pathname).toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        return res.status(400).json({
          error: `URL must point to an image file with one of: ${allowedExtensions.join(', ')}`,
        });
      }

      const parsedWidth = parseInt(width, 10) || 1920;
      const parsedQuality = parseInt(quality, 10) || 85;

      const response = await axios.get(url, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data);

      const optimizedImage = await sharp(imageBuffer)
        .resize({ width: parsedWidth })
        .webp({ quality: parsedQuality })
        .toBuffer();

      res.setHeader('Content-Type', 'image/webp');
      res.setHeader('Content-Disposition', `inline; filename="compressed.webp"`);
      return res.status(200).send(optimizedImage);

    } else if (req.method === 'POST') {
      // (2) Handle POST: file upload or blob data
      const form = formidable({
        multiples: false,
        keepExtensions: true,
        allowEmptyFiles: false,
      });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error('Error parsing form data:', err);
          return res.status(400).json({ error: 'Failed to process form data.' });
        }

        const { width, quality, blob } = fields; // 'blob' could be base64 or raw
        const parsedWidth = parseInt(width, 10) || 1920;
        const parsedQuality = parseInt(quality, 10) || 85;

        try {
          let imageBuffer;

          // (A) If a file was uploaded under "files.image", use that.
          if (files.image) {
            const uploadedFile = files.image;

            // Validate mime
            const allowedMimeTypes = [
              'image/jpeg',
              'image/png',
              'image/gif',
              'image/bmp',
              'image/webp',
            ];
            if (!allowedMimeTypes.includes(uploadedFile.mimetype)) {
              return res.status(400).json({ error: 'Unsupported image type.' });
            }

            // Ensure file exists
            if (!fs.existsSync(uploadedFile.filepath)) {
              return res.status(400).json({ error: 'Uploaded file not found.' });
            }

            // Read it
            imageBuffer = fs.readFileSync(uploadedFile.filepath);

            // Clean up temp file
            fs.unlinkSync(uploadedFile.filepath);

            // (B) Otherwise, if there's a "blob" field (e.g., base64 data), use that.
          } else if (blob) {
            // For example, if `blob` is base64-encoded data like
            // data:image/png;base64,iVBORw0KGgoAA...
            // Strip off "data:...;base64," if present
            let base64String = blob;
            const base64Prefix = /^data:image\/\w+;base64,/;
            if (base64Prefix.test(base64String)) {
              base64String = base64String.replace(base64Prefix, '');
            }
            imageBuffer = Buffer.from(base64String, 'base64');

          } else {
            return res.status(400).json({
              error: 'No file upload or blob field found in the request.'
            });
          }

          // (C) Now "imageBuffer" holds our raw image data; process via sharp
          const optimizedImage = await sharp(imageBuffer)
            .resize({ width: parsedWidth })
            .webp({ quality: parsedQuality })
            .toBuffer();

          res.setHeader('Content-Type', 'image/webp');
          res.setHeader(
            'Content-Disposition',
            `inline; filename="compressed.webp"`
          );
          return res.status(200).send(optimizedImage);

        } catch (error) {
          console.error('Error processing image:', error);
          return res.status(500).json({ error: 'Failed to process image.' });
        }
      });

    } else {
      // (3) Unsupported method
      return res.status(405).json({ error: 'Method not allowed. Use GET or POST.' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Image processing failed. Please try again.' });
  }
}
