import  mysql from 'mysql';
import dotenv from 'dotenv'
dotenv.config()

const connection = mysql.createConnection({
    host: process.env.SQLHOST,
    user: process.env.SQLUSER,
    password: process.env.SQLPASS,
    database: process.env.SQLDB,
});

function pingDatabase() {
  connection.query('SELECT 1', (error: mysql.MysqlError | null) => {
      if (error) {
          console.error('Erro ao realizar o ping no banco de dados:', error.message);
      } else {
          console.log('Ping SQL');
      }
  });
}

// Realiza o primeiro ping ao iniciar o aplicativo
pingDatabase();

// Configura o intervalo para realizar o ping a cada 5 minutos (300000 milissegundos)
const pingInterval = setInterval(pingDatabase, 300000);

// Manipula eventos de erro e desconexão
connection.on('error', (err) => {
  console.error('Erro na conexão com o banco de dados:', err);
  clearInterval(pingInterval);
});

connection.on('end', () => {
  console.log('Conexão com o banco de dados encerrada.');
  clearInterval(pingInterval);
});

export default connection;
