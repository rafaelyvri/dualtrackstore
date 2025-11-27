import 'dotenv/config';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,  // Certifique-se que .env tem o nome correto
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

const criarTabelaSneakers = async () => {
    try {
        // Seleciona o banco explicitamente
        await pool.query(`USE \`${process.env.DB_NAME}\``);

        const query = `
            CREATE TABLE IF NOT EXISTS sneakers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                nome VARCHAR(100) NOT NULL,
                marca VARCHAR(50) NOT NULL,
                modelo VARCHAR(100),               
                tamanho DECIMAL(4, 1) NOT NULL,
                preco DECIMAL(10, 2) NOT NULL,
                raridade VARCHAR(50),             
                imagem_url TEXT
            );
        `;
        await pool.execute(query);
        console.log('Tabela sneakers verificada/criada no MySQL.');
    } catch (error) {
        console.error('Erro ao criar tabela:', error);
    }
};

pool.getConnection()
    .then(connection => {
        console.log('✅ Conectado ao MySQL! (Pool criado)');
        connection.release();
        criarTabelaSneakers();
    })
    .catch(err => {
        console.error('❌ ERRO CRÍTICO: Falha na conexão com o MySQL. Verifique .env e o status do MySQL.', err.message);
    });

export default {
    query: (sql, params) => pool.execute(sql, params),
};
