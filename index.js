const express = require("express");
const axios = require("axios"); // Importa o axios
const app = express();

app.use(express.json());

// Variáveis
const token_whatsapp = "EAAS1VZCpxlZBsBO5OAGkVUTONNtKDcptoXOmySEzQ5y7HiZA2gilZClZArTHP8Kwp3aBeN5JqZCP8FcW0Yr9JJvwSsfgBKA4RYyhS9uZCKQXNQBpsS6oMuQbAkOMPMgF7ELFJKURGa4v8SI0r9mA3wsdu8yIpJFRBCdrpTDr88CeZBrf9qJZAiU9MH00pjSEzxt0uibo0M8Qh7BTI1Okh0PSqqGNYuzW9";
const phone_number_id = "580996415104401";

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
app.post("/", async (req, res) => {
  console.log("📩 Evento recebido:", JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const messageObject = value?.messages?.[0];

  if (messageObject) {
    const from = messageObject.from; // Número do remetente
    const msg_body = messageObject.text?.body; // Texto enviado

    console.log(`👤 Mensagem recebida de ${from}: "${msg_body}"`);

    // Enviar resposta automática
    try {
      await axios({
        method: "POST",
        url: `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
        headers: {
          Authorization: `Bearer ${token_whatsapp}`,
          "Content-Type": "application/json",
        },
        data: {
          messaging_product: "whatsapp",
          to: from,
          text: { body: `Olá! 👋 Recebemos sua mensagem: "${msg_body}"` },
        },
      });
      console.log("✅ Mensagem de resposta enviada com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao enviar a resposta:", error.response?.data || error.message);
    }
  }

  res.sendStatus(200);
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});


