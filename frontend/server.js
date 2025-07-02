const express = require('express');
const fetch = require('node-fetch');
const fs = require('fs');
const https = require('https');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/api/google-ads/accounts', async (req, res) => {
  const { accessToken } = req.body;
  const developerToken = process.env.REACT_APP_GOOGLE_ADS_DEVELOPER_TOKEN;
  if (!accessToken || !developerToken) {
    return res.status(400).json({ error: 'Missing accessToken or developerToken' });
  }
  try {
    const response = await fetch('https://googleads.googleapis.com/v14/customers:listAccessibleCustomers', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'developer-token': developerToken
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to fetch from Google Ads API' });
  }
});

const httpsOptions = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

https.createServer(httpsOptions, app).listen(3001, () => {
  console.log('API server (HTTPS) running on port 3001');
}); 