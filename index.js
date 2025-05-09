// index.js atualizado com integração ao Make para o item 6 - Eventos do EAC

const express = require("express");
const axios = require("axios");
const app = express();
const baseConhecimento = require("./baseConhecimento.json");

app.use(express.json());

const token = "EAAS1VZCpxlZBsBO95H1rNWwuzqKYIoJ0sn2ijF90OZCdgtSMHSYlBl6lAEcXgHCXzjU4DIoY3pQdSXVwhDXajcBLcKaCaITIivBSi0UVPZBSrUy7IMzzM6rZBTSnPYSKx0nIzvGMcUZCqlfplPyKa70YfzqcxcSZAKK1btsR8V84s9Ucp43KdZAwsrxL1AZDZD"; // substitua pelo seu token
const phone_number_id = "572870979253681"; // ID do número de telefone
const makeWebhookURL = "https://hook.us2.make.com/la3lng90eob57s6gg6yg12s8rlmqy3eh"; // substitua pelo webhook do Make

function montarMenuPrincipal() {
  let texto = "✨ *Menu Principal* ✨\n\n";
  for (const [key, value] of Object.entries(baseConhecimento.menu)) {
    texto += `${key}. ${value}\n`;
  }
  texto += "\nDigite o número correspondente 👇";
  return texto;
}

function montarSubmenu(menuId) {
  const submenu = baseConhecimento.submenus[menuId];
  if (!submenu) return null;

  let texto = `✨ *${baseConhecimento.menu[menuId]}* ✨\n\n`;
  for (const [key, value] of Object.entries(submenu)) {
    texto += `${key}. ${value}\n`;
  }
  texto += "\nDigite o número correspondente 👇 ou digite 'menu' para voltar";
  return texto;
}

async function enviarMensagem(numero, mensagem) {
  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${phone_number_id}/messages`,
      {
        messaging_product: "whatsapp",
        to: numero,
        text: { body: mensagem },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Erro ao enviar resposta:", error?.response?.data || error);
  }
}

app.post("/", async (req, res) => {
  const body = req.body;

  if (body.object) {
    const mensagem = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    const textoRecebido = mensagem?.text?.body?.toLowerCase() || "";
    const numero = mensagem?.from;
    const nome = body.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.profile?.name || "Amigo(a)";

    console.log(`📩 Mensagem recebida de ${numero}: "${textoRecebido}"`);

    if (textoRecebido === "menu" || textoRecebido === "voltar") {
      await enviarMensagem(numero, montarMenuPrincipal());
    } else if (textoRecebido === "6") {
      try {
        const resposta = await axios.post(makeWebhookURL, {
          comando: "eventos",
          nome
        });

        const texto = resposta.data.mensagem || resposta.data;
        await enviarMensagem(numero, `📅 *Próximos eventos do EAC:*\n\n${texto}\n\nSe quiser participar, envie um e-mail para eacporciunculadesantana@gmail.com 📬`);
      } catch (erro) {
        console.error("Erro ao consultar Make:", erro?.response?.data || erro);
        await enviarMensagem(numero, "Desculpe, não consegui consultar os eventos agora. Tente novamente em breve. 🙏");
      }
    } else if (baseConhecimento.respostas[textoRecebido]) {
      await enviarMensagem(numero, baseConhecimento.respostas[textoRecebido]);
    } else if (textoRecebido.includes(".")) {
      const resposta = baseConhecimento.respostas[textoRecebido];
      if (resposta) {
        await enviarMensagem(numero, resposta);
      } else {
        await enviarMensagem(numero, "❓ Não consegui entender sua dúvida. Digite 'menu' para começar novamente.");
      }
    } else if (baseConhecimento.menu[textoRecebido]) {
      const submenu = montarSubmenu(textoRecebido);
      if (submenu) {
        await enviarMensagem(numero, submenu);
      } else {
        await enviarMensagem(numero, "❓ Não consegui entender sua dúvida. Digite 'menu' para começar novamente.");
      }
    } else {
      await enviarMensagem(numero, montarMenuPrincipal());
    }

    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});




