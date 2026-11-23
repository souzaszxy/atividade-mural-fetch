
const URL = "https://jsonplaceholder.typicode.com/posts?_limit=6";

const botao = document.querySelector("#btn-carregar");
const filtro = document.querySelector("#filtro");
const mensagem = document.querySelector("#mensagem");
const painel = document.querySelector("#lista-posts");
const contador = document.querySelector("#contador");

let publicacoes = [];

function mostrarMensagem(texto, tipo = "") {
    mensagem.textContent = texto;
    mensagem.className = "mensagem";

    if (tipo) {
        mensagem.classList.add(tipo);
    }
}

function atualizarContador(quantidade) {
    if (quantidade === 0) {
        contador.textContent = "Nenhuma publicação para exibir.";
    } else if (quantidade === 1) {
        contador.textContent = "1 publicação exibida.";
    } else {
        contador.textContent = `${quantidade} publicações exibidas.`;
    }
}

function renderizarPublicacoes(lista) {
    painel.replaceChildren();

    if (lista.length === 0) {
        const aviso = document.createElement("p");
        aviso.classList.add("vazio");

        aviso.textContent = publicacoes.length === 0
            ? "Clique em Carregar publicações para buscar os dados."
            : "Nenhuma publicação encontrada. Tente outro título.";

        painel.append(aviso);
        atualizarContador(0);
        return;
    }

    lista.forEach((publicacao) => {
        const cartao = document.createElement("article");
        cartao.classList.add("cartao");

        const identificador = document.createElement("span");
        identificador.classList.add("numero-post");
        identificador.textContent = `PUBLICAÇÃO #${publicacao.id}`;

        const titulo = document.createElement("h2");
        titulo.textContent = publicacao.title;

        const texto = document.createElement("p");
        texto.textContent = publicacao.body;

        cartao.append(identificador, titulo, texto);
        painel.append(cartao);
    });

    atualizarContador(lista.length);
}

function carregarPublicacoes() {
    mostrarMensagem("Carregando publicações...");
    botao.disabled = true;

    fetch(URL)
        .then((resposta) => {
            if (!resposta.ok) {
                throw new Error(`Erro HTTP: ${resposta.status}`);
            }

            return resposta.json();
        })
        .then((dados) => {
            publicacoes = dados;

            renderizarPublicacoes(publicacoes);

            mostrarMensagem(
                "Publicações carregadas com sucesso.",
                "sucesso"
            );

            aplicarFiltro();
        })
        .catch((erro) => {
            console.error(erro);

            publicacoes = [];
            painel.replaceChildren();
            atualizarContador(0);

            mostrarMensagem(
                "Não foi possível carregar as publicações. Verifique sua conexão e tente novamente.",
                "erro"
            );

            const aviso = document.createElement("p");
            aviso.classList.add("vazio");
            aviso.textContent = "O mural está indisponível no momento.";

            painel.append(aviso);
        })
        .finally(() => {
            botao.disabled = false;
        });
}

function aplicarFiltro() {
    const termo = filtro.value.trim().toLowerCase();

    const encontradas = publicacoes.filter((item) => {
        return item.title.toLowerCase().includes(termo);
    });

    renderizarPublicacoes(encontradas);

    if (publicacoes.length > 0 && encontradas.length === 0) {
        mostrarMensagem("Nenhuma publicação corresponde à sua busca.");
    } else if (termo !== "" && encontradas.length > 0) {
        mostrarMensagem("");
    } else if (publicacoes.length > 0) {
        mostrarMensagem("Publicações carregadas com sucesso.", "sucesso");
    }
}

botao.addEventListener("click", carregarPublicacoes);

filtro.addEventListener("input", aplicarFiltro);

renderizarPublicacoes([]);
