
const express = require("express");
const axios = require("axios");
const app = express();
const fs = require("fs");

const baseConhecimento = require("./baseConhecimento.json");

app.use(express.json());

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

app.post("/", async (req, res) => {
  console.log("📩 Evento recebido:", JSON.stringify(req.body, null, 2));

  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const messageObject = value?.messages?.[0];

  if (messageObject) {
    const from = messageObject.from;
    const msg_body = messageObject.text?.body?.toLowerCase();

    console.log(`👤 Mensagem recebida de ${from}: "${msg_body}"`);

    if (msg_body.includes("menu") || msg_body.includes("voltar")) {
      respostaFinal = "🔹 Menu Principal 🔹\n1️⃣ Acesso ao Sistema\n2️⃣ Cadastro de Processo\n3️⃣ Assinatura e Trâmite\nDigite sua dúvida!";
    } else {
      const respostaEncontrada = baseConhecimento.find(item =>
        msg_body.includes(item.palavra_chave.toLowerCase())
      );

      respostaFinal = respostaEncontrada
        ? respostaEncontrada.resposta
        : "❓ Não consegui entender sua dúvida. Digite novamente ou escreva 'menu' para ver as opções!";
    }

    try {
      await axios.post(
        `https://graph.facebook.com/v19.0/${value.metadata.phone_number_id}/messages`,
        {
          messaging_product: "whatsapp",
          to: from,
          text: { body: respostaFinal }
        },
        {
          headers: {
            Authorization: `Bearer SEU_TOKEN_AQUI`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("✅ Mensagem enviada!");
    } catch (error) {
      console.error("❌ Erro ao enviar resposta:", error.response?.data || error.message);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});



