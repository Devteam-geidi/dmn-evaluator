require("dotenv").config();
const express = require("express");
const { Camunda8 } = require("@camunda8/sdk");

const app = express();
app.use(express.json());

const camunda = new Camunda8({
  clientId: process.env.ZEEBE_CLIENT_ID,
  clientSecret: process.env.ZEEBE_CLIENT_SECRET,
  clusterId: process.env.ZEEBE_CLUSTER_ID,
  region: process.env.ZEEBE_REGION,
  oauthURL: process.env.CAMUNDA_OAUTH_URL,
});

app.post("/evaluate", async (req, res) => {
  try {
    const result = await camunda.evaluateDecision({
      decisionId: process.env.DMN_DECISION_ID,
      variables: req.body
    });

    res.json(result);
  } catch (error) {
    console.error("DMN Evaluation failed:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ DMN evaluator running at http://localhost:${PORT}`);
});
