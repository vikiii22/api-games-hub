const { MongoClient } = require('mongodb');
const { Client } = require('ssh2');

async function createSshTunnel(sshConfig, mongoConfig) {
  return new Promise((resolve, reject) => {
    const ssh = new Client();

    ssh.on('ready', () => {
      console.log('SSH Tunnel establecido con éxito');
      
      const tunnelConfig = {
        localHost: '127.0.0.1',
        localPort: mongoConfig.port,
        remoteHost: mongoConfig.host,
        remotePort: mongoConfig.port,
      };

      ssh.forwardOut(
        tunnelConfig.localHost,
        tunnelConfig.localPort,
        tunnelConfig.remoteHost,
        tunnelConfig.remotePort,
        (err, stream) => {
          if (err) {
            ssh.end();
            reject(err);
          }

          console.log('Túnel SSH creado correctamente');
          resolve({
            stream,
            tunnelConfig,
            ssh,
          });
        }
      );
    });

    ssh.on('error', (err) => {
      console.error('Error en la conexión SSH:', err);
      reject(err);
    });

    ssh.connect({
      host: sshConfig.host,
      port: sshConfig.port,
      username: sshConfig.username,
      password: sshConfig.password,
    });
  });
}

async function connectToMongoDB(tunnelConfig) {
  console.log('Intentando conectar a MongoDB a través del túnel SSH');
  console.log('Host remoto:', tunnelConfig.tunnelConfig.remoteHost);
  console.log('Puerto remoto:', tunnelConfig.tunnelConfig.remotePort);
  
  try {
    const mongoClient = new MongoClient(`mongodb://${tunnelConfig.tunnelConfig.remoteHost}:${tunnelConfig.tunnelConfig.remotePort}`, {
      serverSelectionTimeoutMS: 5000,
    });
    
    await mongoClient.connect();
    console.log('Conectado a MongoDB a través del túnel SSH');

    // Puedes realizar operaciones en la base de datos MongoDB aquí

    await mongoClient.close();
    tunnelConfig.ssh.end();
    console.log('Conexiones cerradas');
  } catch (error) {
    console.error('Error en la conexión a MongoDB:', error);
  }
}

module.exports = { createSshTunnel, connectToMongoDB };
