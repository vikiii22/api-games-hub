const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {});

async function conectar() {
  try {
    await client.connect();
    return client.db(process.env.BD_MONGO);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error);
    throw error;
  }
}

module.exports = {
  conectar: conectar
};