require("dotenv").config();
const express = require("express");
const { Camunda8 } = require("@camunda8/sdk");

const app = express();
app.use(express.json());

const c8 = new Camunda8();

const zeebe = c8.getZeebeGrpcApiClient(); // 🎯 Correct client

app.post("/evaluate", async (req, res) => {
  try {
    const result = await zeebe.evaluateDecision({
      decisionId: process.env.DMN_DECISION_ID,
      variables: req.body,
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
