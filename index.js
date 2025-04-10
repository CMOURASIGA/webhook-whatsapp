const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// Verificação do Webhook (GET)
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

// Recebimento de mensagens (POST)
app.post("/", async (req, res) => {
  console.log("📩 Evento recebido:", JSON.stringify(req.body, null, 2));

  try {
    const entry = req.body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (message) {
      const from = message.from; // ID do WhatsApp de quem enviou a mensagem
      const text = message.text?.body; // Texto da mensagem recebida
      const phone_number_id = value.metadata.phone_number_id; // ID do número de telefone

      console.log(`📨 Nova mensagem de ${from}: ${text}`);

      // Enviar resposta automática
      await axios.post(
        `https://graph.facebook.com/v19.0/${phone_number_id}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: "Olá! 👋 Recebemos sua mensagem. Em breve entraremos em contato!" }
        },
        {
          headers: {
            Authorization: `Bearer EAAS1VZCpxlZBsBO3W8vI7K6dvZCZAQ5yxgDjN4rpt2gvPgg3kB0x07uoyHXxNmCuzKMkhHR1o1dGAlYpaMnbzk2a68zlGTndUsrbtLi9ZAAtl9guRZCe32qfZClg3zAym2ZBvLEg5m4mh7iUT7dIF9LMT4WArgIxAdLkeE7ZAm3ZAdqYE8rZAtfOk0qCFQtAXZAFxkDQYwTNDxurEoBMy534ijLZAYedP5m0ZD`,
            "Content-Type": "application/json"
          }
        }
      );

      console.log("✅ Mensagem automática enviada!");
    }
  } catch (error) {
    console.error("❌ Erro no processamento:", error.response?.data || error.message);
  }

  res.sendStatus(200);
});

// Rodar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

