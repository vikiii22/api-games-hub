const express = require('express');
require('dotenv').config();
const Router = require('./src/routes/app.routes');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const { createSshTunnel, connectToMongoDB } = require('./src/database/connection-mongo');
require('./src/services/cron.get-games');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(Router);

const sshConfig = {
  host: '212.227.110.211',
  port: 22,
  username: "root",
  password: "*j7%YA76r0"
};

const mongoConfig = {
  host: '127.0.0.1',
  port: 27017
};

async function main() {
  try {
    const tunnelConfig = await createSshTunnel(sshConfig, mongoConfig);
    console.log(tunnelConfig.tunnelConfig.remoteHost);
    await connectToMongoDB(tunnelConfig);
  } catch (error) {
    console.error('Error:', error);
  }
}

main();

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
