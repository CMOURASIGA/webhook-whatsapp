const express = require("express");
const axios = require("axios");
const app = express();
const baseConhecimento = require("./baseConhecimento.json");

app.use(express.json());

const token = "EAAS1VZCpxlZBsBO95H1rNWwuzqKYIoJ0sn2ijF90OZCdgtSMHSYlBl6lAEcXgHCXzjU4DIoY3pQdSXVwhDXajcBLcKaCaITIivBSi0UVPZBSrUy7IMzzM6rZBTSnPYSKx0nIzvGMcUZCqlfplPyKa70YfzqcxcSZAKK1btsR8V84s9Ucp43KdZAwsrxL1AZDZD";
const phoneNumberId = "580996415104401";

app.post("/", async (req, res) => {
  const body = req.body;

  if (body.object) {
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const message = changes?.value?.messages?.[0];

    if (message && message.text && message.text.body) {
      const textoRecebido = message.text.body.trim().toLowerCase();
      const de = message.from;

      let resposta = "";

      // Exibir o menu principal
      if (textoRecebido === "menu" || textoRecebido === "voltar") {
        resposta = "👉 *Menu Principal* 👈\n\n";
        for (const [numero, titulo] of Object.entries(baseConhecimento.menu)) {
          resposta += `${numero}. ${titulo}\n`;
        }
        resposta += `\nDigite o número correspondente 🔽`;
      }
      // Exibir submenu
      else if (baseConhecimento.submenus[textoRecebido]) {
        resposta = `👉 *${baseConhecimento.menu[textoRecebido]}* 👈\n\n`;
        for (const [numero, subtitulo] of Object.entries(baseConhecimento.submenus[textoRecebido])) {
          resposta += `${numero}. ${subtitulo}\n`;
        }
        resposta += `\nDigite o número correspondente 🔽 ou 'voltar' 🔙`;
      }
      // Responder conteúdo final
      else if (baseConhecimento.respostas[textoRecebido]) {
        resposta = baseConhecimento.respostas[textoRecebido];
      }
      // Mensagem padrão de erro
      else {
        resposta = "❓ Não consegui entender sua dúvida.\nDigite 'menu' para começar novamente.";
      }

      try {
        await axios({
          method: "POST",
          url: `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          data: {
            messaging_product: "whatsapp",
            to: de,
            text: {
              body: resposta
            }
          }
        });
      } catch (error) {
        console.error("Erro ao enviar resposta:", error.response?.data || error.message);
      }
    }
  }

  res.sendStatus(200);
});

// Porta
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});




