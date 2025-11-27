import Sneaker from '../models/models.js';

const sneakerController = {
    async create(req, res) {
        try {
            const novaSneaker = await Sneaker.criar(req.body);
            return res.status(201).json(novaSneaker);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao criar sneaker.', detalhes: error.message });
        }
    },
 async listAll(req, res) {
  try {
    const sneakers = await Sneaker.listarTodos();
    return res.status(200).json(sneakers);
  } catch (error) {
    console.error('Erro ao listar sneakers:', error);
    return res.status(500).json({ erro: 'Erro ao listar sneakers.', detalhes: error.message });
  }
    },
    async listOne(req, res) {
        try {
            const { id } = req.params;
            const sneaker = await Sneaker.buscarPorId(id);
            if (!sneaker) return res.status(404).json({ mensagem: 'Sneaker não encontrado.' });
            return res.status(200).json(sneaker);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao buscar sneaker.', detalhes: error.message });
        }
    },
    async update(req, res) {
        try {
            const { id } = req.params;
            const sneakerAtualizada = await Sneaker.atualizar(id, req.body);
            if (!sneakerAtualizada) return res.status(404).json({ mensagem: 'Sneaker não encontrado para atualização.' });
            return res.status(200).json(sneakerAtualizada);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao atualizar sneaker.', detalhes: error.message });
        }
    },
    async delete(req, res) {
        try {
            const { id } = req.params;
            const linhasDeletadas = await Sneaker.deletar(id);
            if (linhasDeletadas === 0) return res.status(404).json({ mensagem: 'Sneaker não encontrado para exclusão.' });
            return res.status(200).json({mensagem:"excluido com sucesso"});
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao deletar sneaker.', detalhes: error.message });
        }
    }
};

export default sneakerController;