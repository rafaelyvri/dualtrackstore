document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-sneaker');
  const tabelaBody = document.querySelector('#tabela-sneakers tbody');
  const mensagemStatus = document.getElementById('mensagem-status');
  const btnCancelar = document.getElementById('btn-cancelar');
  const API_URL = 'http://localhost:3003/api/sneakers';

  let editandoId = null;

  // Função para mostrar mensagem de status
  function mostrarMensagem(msg, erro = false) {
    mensagemStatus.textContent = msg;
    mensagemStatus.style.color = erro ? 'red' : 'green';
  }

  // Função para listar sneakers na tabela
  async function listarSneakers() {
    try {
      const res = await fetch(API_URL);
      const json = await res.json();
      console.log(json)
      if (!Array.isArray(json)) throw new Error('Resposta inválida da API');
      tabelaBody.innerHTML = ''; // Limpa a tabela antes de atualizar

      json.forEach(sneaker => {
        const preco = Number(sneaker.preco);
        const precoFormatado = isNaN(preco) ? '0.00' : preco.toFixed(2);

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><img src="${sneaker.imagem_url}" alt="${sneaker.nome}" width="60"></td>
          <td>${sneaker.nome} / ${sneaker.modelo}</td>
          <td>${sneaker.marca}</td>
          <td>${sneaker.raridade}</td>
          <td>R$ ${precoFormatado} / ${sneaker.tamanho}</td>
          <td>
            <button class="btn-editar" data-id="${sneaker.id}">Editar</button>
            <button class="btn-excluir" data-id="${sneaker.id}">Excluir</button>
          </td>
        `;
        tabelaBody.appendChild(tr);
      });
    } catch (error) {
      mostrarMensagem(`Erro: ${error.message}`, true);
    }
  }

  // Reseta o formulário e estado de edição
  function resetarFormulario() {
    form.reset();
    editandoId = null;
    btnCancelar.style.display = 'none';
  }

  // Evento submit para criar ou editar sneaker
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const dados = {
      nome: form.nome.value.trim(),
      marca: form.marca.value.trim(),
      modelo: form.modelo.value.trim(),
      tamanho: parseFloat(form.tamanho.value),
      preco: parseFloat(form.preco.value),
      raridade: form.raridade.value,
      imagem_url: form.imagem_url.value.trim()
    };

    try {
      let res;
      if (editandoId) {
        res = await fetch(`${API_URL}/${editandoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
      } else {
        res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });
      }

      const json = await res.json();
      if (res.ok) {
        mostrarMensagem('Salvo com sucesso!');
        resetarFormulario();
        listarSneakers();
      } else {
        throw new Error(json.mensagem || 'Erro ao salvar sneaker');
      }
    } catch (error) {
      mostrarMensagem(`Erro: ${error.message}`, true);
    }
  });

  // Cancelar edição
  btnCancelar.addEventListener('click', () => {
    resetarFormulario();
    mostrarMensagem('');
  });

  // Eventos para editar ou excluir sneaker na tabela
  tabelaBody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-editar')) {
      const id = e.target.dataset.id;
      try {
        const res = await fetch(`${API_URL}/${id}`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.mensagem || 'Erro ao buscar sneaker');

        const sneaker = json.dados || json;
        form.nome.value = sneaker.nome;
        form.marca.value = sneaker.marca;
        form.modelo.value = sneaker.modelo;
        form.tamanho.value = sneaker.tamanho;
        form.preco.value = sneaker.preco;
        form.raridade.value = sneaker.raridade;
        form.imagem_url.value = sneaker.imagem_url || '';

        editandoId = sneaker.id;
        btnCancelar.style.display = 'inline-block';
        mostrarMensagem('Modo edição ativado');
      } catch (error) {
        mostrarMensagem(`Erro: ${error.message}`, true);
      }
    }

    if (e.target.classList.contains('btn-excluir')) {
      if (confirm('Deseja realmente excluir este sneaker?')) {
        const id = e.target.dataset.id;
        try {
          const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
          console.log(res)
          const json = await res.json();
          if (!res.ok) throw new Error(json.mensagem || 'Erro ao excluir sneaker');
          mostrarMensagem('Excluído com sucesso!');
          listarSneakers(); // Atualiza a tabela automaticamente após exclusão
        } catch (error) {
          mostrarMensagem(`Erro: ${error.message}`, true);
        }
      }
    }
  });

  // Inicializa a lista ao carregar a página
  listarSneakers();
});
