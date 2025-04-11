const express = require("express");
const axios = require("axios");
const app = express();
const baseConhecimento = require("./baseConhecimento.json");

app.use(express.json());

const token = "EAAS1VZCpxlZBsBO95H1rNWwuzqKYIoJ0sn2ijF90OZCdgtSMHSYlBl6lAEcXgHCXzjU4DIoY3pQdSXVwhDXajcBLcKaCaITIivBSi0UVPZBSrUy7IMzzM6rZBTSnPYSKx0nIzvGMcUZCqlfplPyKa70YfzqcxcSZAKK1btsR8V84s9Ucp43KdZAwsrxL1AZDZD";
const phone_number_id = "580996415104401";

let usuarios = {}; // Para guardar o estado de cada usuário

// Função para enviar mensagens
async function enviarMensagem(numero, mensagem) {
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
}

// Função para montar o menu principal
function montarMenuPrincipal() {
  let menu = "\uD83D\uDC49 *Menu Principal* \uD83D\uDC49\n\n";
  baseConhecimento.menu.forEach((item) => {
    menu += `${item.codigo}. ${item.nome}\n`;
  });
  menu += "\nDigite o número correspondente \u2B07\uFE0F";
  return menu;
}

// Função para montar submenu
function montarSubmenu(codigoMenu) {
  const menu = baseConhecimento.menu.find((item) => item.codigo == codigoMenu);
  if (!menu || !menu.subtopicos) return null;

  let submenu = `\uD83D\uDD39 *${menu.nome}* \uD83D\uDD39\n\n`;
  menu.subtopicos.forEach((subitem) => {
    submenu += `${subitem.codigo}. ${subitem.nome}\n`;
  });
  submenu += "\nDigite o número correspondente \u2B07\uFE0F ou digite 'menu' para voltar";
  return submenu;
}

// Função para buscar resposta
function buscarResposta(codigoSubmenu) {
  for (const item of baseConhecimento.menu) {
    const subitem = item.subtopicos.find((sub) => sub.codigo == codigoSubmenu);
    if (subitem) return subitem.resposta;
  }
  return null;
}

// Webhook de verificação
app.get("/", (req, res) => {
  const verify_token = "bot_assistant_ti";

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("\u2705 WEBHOOK VERIFICADO");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// Receber mensagens
app.post("/", async (req, res) => {
  const entry = req.body.entry?.[0];
  const changes = entry?.changes?.[0];
  const value = changes?.value;
  const mensagens = value?.messages;

  if (mensagens) {
    const mensagem = mensagens[0];
    const de = mensagem.from;
    const texto = mensagem.text?.body?.toLowerCase();

    console.log(`\uD83D\uDCAC Mensagem recebida de ${de}: "${texto}"`);

    if (!usuarios[de]) {
      usuarios[de] = { contexto: "inicio" };
    }

    if (texto.includes("menu") || usuarios[de].contexto === "inicio") {
      usuarios[de].contexto = "menu";
      await enviarMensagem(de, montarMenuPrincipal());
    } else if (usuarios[de].contexto === "menu") {
      const submenu = montarSubmenu(texto);
      if (submenu) {
        usuarios[de].contexto = texto;
        await enviarMensagem(de, submenu);
      } else {
        await enviarMensagem(de, "\u2753 Não consegui entender sua dúvida. Digite 'menu' para ver as opções!");
      }
    } else {
      const resposta = buscarResposta(texto);
      if (resposta) {
        await enviarMensagem(de, resposta);
      } else {
        await enviarMensagem(de, "\u2753 Não consegui entender sua dúvida. Digite 'menu' para ver as opções!");
      }
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\uD83D\uDE80 Servidor rodando na porta ${PORT}`);
});




