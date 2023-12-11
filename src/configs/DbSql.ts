import  mysql from 'mysql';
import dotenv from 'dotenv'
dotenv.config()

interface DbConfig {
    host: string;
    user: string;
    password: string;
    database: string;
}

const connection = mysql.createConnection({
    host: process.env.SQLHOST,
    user: process.env.SQLUSER,
    password: process.env.SQLPASS,
    database: process.env.SQLDB,
});

connection.connect((error: mysql.MysqlError | null) => {
    if (error) throw error;
    console.log(`Conectado ao SQL banco de dados: ${process.env.SQLDB}`);
});

export default connection;
