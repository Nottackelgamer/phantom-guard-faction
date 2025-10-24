const axios = require('axios');

module.exports = async (req, res) => {
  // Allow CORS for your GitHub Pages site
  res.setHeader('Access-Control-Allow-Origin', 'https://nottackelgamer.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const username = req.query.discordUsername;
  if (!username) return res.status(400).send('Missing username');

  // Replace with your actual Google Sheets details
  const SHEET_ID = ''; // e.g., '1ABC123...your-spreadsheet-id'
  const RANGE = ''; // e.g., 'Sheet1!A1:Z100' or 'Officers!A1:Z100' for subsheets
  const API_KEY = 'AIzaSyDIg-I7jcAucRcI_BRC6okfLqjVzgf1wuk'; // Your API key

  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
    const response = await axios.get(url);
    const rows = response.data.values || [];
    const headers = rows[0]; // First row as headers
    const match = rows.slice(1).find(row => row.includes(username)); // Search from row 2 onwards

    if (match) {
      // Map row data to key-value pairs using headers
      const result = match.map((val, i) => ({
        [headers[i] || `Column ${i + 1}`]: val
      }));
      res.status(200).json({ found: true, data: result });
    } else {
      res.status(200).json({ found: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching data');
  }
};