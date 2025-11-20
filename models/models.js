import db from '../config/db.js';

const SneakerModel = {
    // CRUD: CREATE
    criar: async (sneaker) => {
        const { nome, marca, modelo, tamanho, preco, raridade, imagem_url } = sneaker;
        const sql = 'INSERT INTO sneakers (nome, marca, modelo, tamanho, preco, raridade, imagem_url) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const values = [nome, marca, modelo, tamanho, preco, raridade, imagem_url];
        
        const [result] = await db.query(sql, values);
        return SneakerModel.buscarPorId(result.insertId);
    },

    // CRUD: READ ALL
  listarTodos: async () => {
  try {
    const sql = 'SELECT * FROM sneakers ORDER BY id DESC';
    const [rows] = await db.query(sql);
    console.log('Dados retornados pelo banco:', rows.length);
    return rows;
  } catch (error) {
    console.error('Erro na query listarTodos:', error);
    throw error;
  }
},

    // CRUD: READ ONE
    buscarPorId: async (id) => {
        const sql = 'SELECT * FROM sneakers WHERE id = ?';
        const [rows] = await db.query(sql, [id]);
        return rows[0];
    },

    // CRUD: UPDATE
    atualizar: async (id, sneaker) => {
        const { nome, marca, modelo, tamanho, preco, raridade, imagem_url } = sneaker;
        const sql = 'UPDATE sneakers SET nome = ?, marca = ?, modelo = ?, tamanho = ?, preco = ?, raridade = ?, imagem_url = ? WHERE id = ?';
        const values = [nome, marca, modelo, tamanho, preco, raridade, imagem_url, id];
        
        const [result] = await db.query(sql, values);
        
        if (result.affectedRows > 0) {
            return SneakerModel.buscarPorId(id);
        }
        return null; 
    },

    // CRUD: DELETE
    deletar: async (id) => {
        const sql = 'DELETE FROM sneakers WHERE id = ?';
        const [result] = await db.query(sql, [id]);
        return result.affectedRows;
    }
};

export default SneakerModel;