import { useMultiFileAuthState, makeWASocket } from "@whiskeysockets/baileys";
import qrcode from "qrcode-terminal";
import * as fs from "fs/promises";

export let socket;

export const createWhatsappConnection = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(
    "./auth_info_baileys",
  );

  socket = makeWASocket({
    auth: state,
  });

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on(
    "connection.update",
    async ({ qr, connection, lastDisconnect }) => {
      if (qr) qrcode.generate(qr, { small: true });

      if (connection == "close") {
        const error = lastDisconnect.error;

        if (error.output.statusCode === 515) {
          console.log("Erro de reconexão, tentando reconectar...");
          createWhatsappConnection();
        } else {
          await fs.rmdir("./auth_info_baileys", {
            force: true,
            recursive: true,
          });

          console.log(
            "Conexão teve falha, limpando dados de sessão e reiniciando a conexão...",
          );
          return createWhatsappConnection();
        }
      }

      if (connection == "open") {
        console.log("CONEXÃO ESTABELECIDA");
      }
    },
  );
};
