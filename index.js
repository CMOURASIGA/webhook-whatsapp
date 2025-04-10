const express = require("express");
const app = express();

app.use(express.json());

// Verificação de Webhook (GET)
app.get("/", (req, res) => {
  const verify_token = "bot_assistant_ti";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("✅ WEBHOOK VERIFICADO");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Receber mensagens (POST)
app.post("/", (req, res) => {
  console.log("📩 Evento recebido:", JSON.stringify(req.body, null, 2));
  res.sendStatus(200);
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
