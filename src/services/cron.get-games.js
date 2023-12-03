const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const axios = require('axios');

const filePath = path.join(__dirname, '..', 'database', 'games.json');
const url = 'http://fervent-kapitsa.212-227-110-211.plesk.page/scrapper/get-games';

cron.schedule('*/1 * * * *', async () => {
  console.log('Actualizando el archivo JSON...');

  try {
    const response = await axios.get(url);

    const newData = response.data;

    fs.readFile(filePath, 'utf8', (err, currentData) => {
      if (err) {
        console.error('Error al leer el archivo JSON:', err);
        return;
      }

      if (newData !== currentData) {
        fs.writeFile(filePath, newData, 'utf8', (err) => {
          if (err) {
            console.error('Error al escribir en el archivo JSON:', err);
            return;
          }

          console.log('Archivo JSON actualizado correctamente.');
        });
      } else {
        console.log('Los datos no han cambiado. No es necesario actualizar el archivo JSON.');
      }
    });
  } catch (error) {
    console.error('Error al obtener datos:', error.message);
  }
});
