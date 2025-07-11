// Filename: index.js

const express = require('express');
const { ZBClient } = require('zeebe-node');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const zbClient = new ZBClient(
  process.env.ZEEBE_GRPC_ADDRESS,
  {
    oAuth: {
      url: process.env.ZEEBE_AUTHORIZATION_SERVER_URL,
      audience: process.env.ZEEBE_TOKEN_AUDIENCE,
      clientId: process.env.ZEEBE_CLIENT_ID,
      clientSecret: process.env.ZEEBE_CLIENT_SECRET,
    }
  }
);

// DMN Evaluation Endpoint
app.post('/evaluate', async (req, res) => {
  const inputValue = req.body.input;

  if (!inputValue) {
    return res.status(400).json({ error: 'Missing "input" in request body' });
  }

  try {
    const result = await zbClient.evaluateDecision({
      decisionId: 'RoutingDecision',
      variables: {
        input: inputValue
      }
    });

    const output = result.decisions?.[0]?.outputs?.[0]?.output;

    return res.json({ result: output });
  } catch (err) {
    console.error('DMN Evaluation failed:', err);
    return res.status(500).json({ error: 'Failed to evaluate decision' });
  }
});

app.listen(PORT, () => {
  console.log(`DMN evaluator service running on port ${PORT}`);
});
