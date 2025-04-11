// Novo index.js adaptado para trabalhar com o baseConhecimento.json expandido

const express = require("express");
const axios = require("axios");
const app = express();
const baseConhecimento = require("./baseConhecimento.json");

app.use(express.json());

// TOKEN fixo do WhatsApp
const tokenWhatsapp = "EAAS1VZCpxlZBsBO95H1rNWwuzqKYIoJ0sn2ijF90OZCdgtSMHSYlBl6lAEcXgHCXzjU4DIoY3pQdSXVwhDXajcBLcKaCaITIivBSi0UVPZBSrUy7IMzzM6rZBTSnPYSKx0nIzvGMcUZCqlfplPyKa70YfzqcxcSZAKK1btsR8V84s9Ucp43KdZAwsrxL1AZDZD";
const urlWhatsapp = "https://graph.facebook.com/v19.0/580996415104401/messages";

// Função para montar o menu principal
definirMenuPrincipal = () => {
  let menu = "\ud83d\udc49 *Menu Principal* \ud83d\udc49\n\n";
  Object.entries(baseConhecimento.menu).forEach(([numero, item]) => {
    menu += `${numero}. ${item.nome}\n`;
  });
  menu += "\nDigite o número correspondente \ud83d\udc47";
  return menu;
};

// Função para montar um submenu
const definirSubMenu = (numeroMenu) => {
  const item = baseConhecimento.menu[numeroMenu];
  if (!item) return null;

  let submenu = `\ud83d\udc49 *${item.nome}* \ud83d\udc49\n\n`;
  Object.entries(item.subtopicos).forEach(([subnumero, subitem]) => {
    submenu += `${subnumero} - ${subitem.titulo}\n`;
  });
  submenu += "\nDigite o código correspondente ou digite 'menu' para voltar.";
  return submenu;
};

// Função para buscar uma resposta
const buscarResposta = (codigo) => {
  for (const [num, menu] of Object.entries(baseConhecimento.menu)) {
    if (menu.subtopicos[codigo]) {
      return menu.subtopicos[codigo];
    }
  }
  return null;
};

app.post("/", async (req, res) => {
  const body = req.body;
  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const messages = changes?.value?.messages?.[0];

  if (messages && messages.type === "text") {
    const textoRecebido = messages.text.body.toLowerCase();
    const telefoneUsuario = messages.from;

    let resposta = "";

    if (textoRecebido === "menu" || textoRecebido === "voltar") {
      resposta = definirMenuPrincipal();
    } else if (baseConhecimento.menu[textoRecebido]) {
      resposta = definirSubMenu(textoRecebido);
    } else {
      const item = buscarResposta(textoRecebido);
      if (item) {
        resposta = `${item.texto}`;
        if (item.imagem) {
          resposta += `\n\nImagem: ${item.imagem}`;
        }
      } else {
        resposta = "\u2753 Não consegui entender sua dúvida. Digite 'menu' para ver as opções!";
      }
    }

    try {
      await axios({
        method: "POST",
        url: urlWhatsapp,
        headers: {
          Authorization: `Bearer ${tokenWhatsapp}`,
          "Content-Type": "application/json"
        },
        data: {
          messaging_product: "whatsapp",
          to: telefoneUsuario,
          text: { body: resposta }
        }
      });
    } catch (erro) {
      console.error("Erro ao enviar a resposta:", erro.response?.data || erro.message);
    }
  }

  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\ud83d\ude80 Servidor rodando na porta ${PORT}`);
});



