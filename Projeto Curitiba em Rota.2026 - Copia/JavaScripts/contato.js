
(function () {
    "use strict";

    const formulario = document.getElementById(
        "ct10-formulario"
    );

    const nome = document.getElementById(
        "ct10-nome"
    );

    const assunto = document.getElementById(
        "ct10-assunto"
    );

    const comentario = document.getElementById(
        "ct10-comentario"
    );

    const caracteres = document.getElementById(
        "ct10-caracteres"
    );

    const mensagem = document.getElementById(
        "ct10-mensagem"
    );

    const lista = document.getElementById(
        "ct10-lista-avaliacoes"
    );

    const media = document.getElementById(
        "ct10-media"
    );

    const mediaEstrelas = document.getElementById(
        "ct10-media-estrelas"
    );

    const totalAvaliacoes = document.getElementById(
        "ct10-total"
    );

    const textoNota = document.getElementById(
        "ct10-nota-texto"
    );

    const botoesEstrelas = document.querySelectorAll(
        ".ct10-estrela"
    );

    const chave = "curitibaEmRotaAvaliacoesV1";

    let notaSelecionada = 0;
    let avaliacoes = [];

    try {
        const dados = JSON.parse(
            localStorage.getItem(chave)
        );

        if (Array.isArray(dados)) {
            avaliacoes = dados.filter(function (item) {
                return item &&
                    typeof item.id === "string" &&
                    typeof item.nome === "string" &&
                    typeof item.assunto === "string" &&
                    typeof item.comentario === "string" &&
                    Number.isInteger(item.nota) &&
                    item.nota >= 1 &&
                    item.nota <= 5;
            });
        }

    } catch (erro) {
        console.warn(
            "Não foi possível carregar avaliações:",
            erro
        );
    }

    function salvarAvaliacoes() {

        try {
            localStorage.setItem(
                chave,
                JSON.stringify(avaliacoes)
            );

            return true;

        } catch (erro) {
            console.error(
                "Erro ao salvar avaliação:",
                erro
            );

            mensagem.textContent =
                "Não foi possível salvar neste navegador.";

            return false;
        }
    }

    function atualizarEstrelas() {

        botoesEstrelas.forEach(function (botao) {

            const nota = Number(
                botao.dataset.nota
            );

            const ativa = nota <= notaSelecionada;

            botao.classList.toggle(
                "ativa",
                ativa
            );

            botao.setAttribute(
                "aria-pressed",
                String(nota === notaSelecionada)
            );
        });

        if (notaSelecionada === 0) {
            textoNota.textContent =
                "Nenhuma estrela selecionada";
        } else {
            textoNota.textContent =
                notaSelecionada +
                (notaSelecionada === 1
                    ? " estrela selecionada"
                    : " estrelas selecionadas");
        }
    }

    botoesEstrelas.forEach(function (botao) {
        botao.addEventListener("click", function () {

            notaSelecionada = Number(
                botao.dataset.nota
            );

            atualizarEstrelas();

            mensagem.textContent = "";
        });
    });

    comentario.addEventListener("input", function () {

        caracteres.textContent =
            comentario.value.length +
            " / 1000 caracteres";
    });

    function criarElemento(tag, texto) {

        const elemento = document.createElement(tag);
        elemento.textContent = texto;

        return elemento;
    }

    function atualizarResumo() {

        const quantidade = avaliacoes.length;

        if (quantidade === 0) {
            media.textContent = "—";
            mediaEstrelas.textContent = "☆☆☆☆☆";

            totalAvaliacoes.textContent =
                "Nenhuma avaliação ainda";

            return;
        }

        let soma = 0;

        avaliacoes.forEach(function (item) {
            soma += item.nota;
        });

        const notaMedia = soma / quantidade;

        media.textContent = notaMedia.toLocaleString(
            "pt-BR",
            {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1
            }
        );

        const estrelasCheias = Math.round(notaMedia);

        mediaEstrelas.textContent =
            "★".repeat(estrelasCheias) +
            "☆".repeat(5 - estrelasCheias);

        totalAvaliacoes.textContent =
            quantidade === 1
                ? "1 avaliação registrada"
                : quantidade + " avaliações registradas";
    }

    function mostrarAvaliacoes() {

        lista.replaceChildren();

        if (avaliacoes.length === 0) {

            const vazio = criarElemento(
                "p",
                "Ainda não existem avaliações. Seja o primeiro a deixar sua opinião!"
            );

            vazio.className = "ct10-vazio";

            lista.appendChild(vazio);

            atualizarResumo();

            return;
        }

        const ordenadas = [...avaliacoes].reverse();

        ordenadas.forEach(function (item) {

            const cartao = document.createElement("article");
            cartao.className = "ct10-card-avaliacao";

            const topo = document.createElement("div");
            topo.className = "ct10-card-topo";

            const identificacao = document.createElement("div");

            identificacao.appendChild(
                criarElemento("h3", item.nome)
            );

            identificacao.appendChild(
                criarElemento(
                    "small",
                    item.data || "Avaliação registrada"
                )
            ).className = "ct10-card-data";

            topo.appendChild(identificacao);

            const estrelas = criarElemento(
                "span",
                "★".repeat(item.nota) +
                "☆".repeat(5 - item.nota)
            );

            estrelas.className = "ct10-card-estrelas";

            estrelas.setAttribute(
                "aria-label",
                item.nota + " de 5 estrelas"
            );

            topo.appendChild(estrelas);
            cartao.appendChild(topo);

            const assuntoCard = criarElemento(
                "span",
                item.assunto
            );

            assuntoCard.className = "ct10-card-assunto";

            cartao.appendChild(assuntoCard);

            const texto = criarElemento(
                "p",
                item.comentario
            );

            texto.className = "ct10-card-comentario";

            cartao.appendChild(texto);

            const excluir = criarElemento(
                "button",
                "Excluir avaliação"
            );

            excluir.type = "button";
            excluir.className = "ct10-excluir";

            excluir.addEventListener("click", function () {

                const confirmar = confirm(
                    "Deseja excluir esta avaliação?"
                );

                if (!confirmar) {
                    return;
                }

                const anteriores = [...avaliacoes];

                avaliacoes = avaliacoes.filter(
                    function (avaliacao) {
                        return avaliacao.id !== item.id;
                    }
                );

                if (salvarAvaliacoes()) {

                    mostrarAvaliacoes();

                    mensagem.textContent =
                        "Avaliação excluída com sucesso.";

                } else {
                    avaliacoes = anteriores;
                }
            });

            cartao.appendChild(excluir);
            lista.appendChild(cartao);
        });

        atualizarResumo();
    }

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const nomeDigitado = nome.value.trim();
        const assuntoSelecionado = assunto.value;
        const comentarioDigitado = comentario.value.trim();

        if (!nomeDigitado) {

            mensagem.textContent =
                "Digite seu nome.";

            nome.focus();
            return;
        }

        if (!assuntoSelecionado) {

            mensagem.textContent =
                "Selecione um assunto.";

            assunto.focus();
            return;
        }

        if (notaSelecionada < 1 ||
            notaSelecionada > 5) {

            mensagem.textContent =
                "Selecione uma nota de 1 a 5 estrelas.";

            botoesEstrelas[0].focus();
            return;
        }

        if (comentarioDigitado.length < 10) {

            mensagem.textContent =
                "O comentário deve ter pelo menos 10 caracteres.";

            comentario.focus();
            return;
        }

        const novaAvaliacao = {

            id: Date.now().toString() + "-" +
                Math.random().toString(36).slice(2),

            nome: nomeDigitado,
            assunto: assuntoSelecionado,
            nota: notaSelecionada,
            comentario: comentarioDigitado,
            data: new Date().toLocaleDateString("pt-BR")
        };

        avaliacoes.push(novaAvaliacao);

        if (!salvarAvaliacoes()) {
            avaliacoes.pop();
            return;
        }

        mostrarAvaliacoes();

        formulario.reset();

        notaSelecionada = 0;
        atualizarEstrelas();

        caracteres.textContent =
            "0 / 1000 caracteres";

        mensagem.textContent =
            "Avaliação salva com sucesso!";
    });

    atualizarEstrelas();
    mostrarAvaliacoes();

    console.log(
        "Página 10: formulário e avaliações carregados!"
    );

})();
