
(function () {

    const botoesFiltro = document.querySelectorAll(
        ".dic9-filtro"
    );

    const cartoes = document.querySelectorAll(
        ".dic9-card"
    );

    const resultado = document.getElementById(
        "dic9-resultado"
    );

    botoesFiltro.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const filtro = botao.dataset.filtro;

            let quantidade = 0;

            botoesFiltro.forEach(function (item) {

                item.classList.remove("ativo");

                item.setAttribute(
                    "aria-pressed",
                    "false"
                );

            });

            botao.classList.add("ativo");

            botao.setAttribute(
                "aria-pressed",
                "true"
            );

            cartoes.forEach(function (cartao) {

                const categoria = cartao.dataset.categoria;

                const mostrar =
                    filtro === "todos" ||
                    categoria === filtro;

                cartao.hidden = !mostrar;

                if (mostrar) {
                    quantidade++;
                }

            });

            if (resultado) {

                resultado.textContent =
                    quantidade === 1
                        ? "1 dica encontrada"
                        : quantidade + " dicas encontradas";

            }

        });

    });

    const chave = "curitibaEmRotaDicasFavoritas";

    const botoesFavoritos = document.querySelectorAll(
        ".dic9-favorito"
    );

    const contadorFavoritos = document.getElementById(
        "dic9-total-favoritos"
    );

    const nomesDicas = {
        "onibus": "Conheça o transporte público",
        "agasalho": "Leve um agasalho",
        "pertences": "Cuide dos seus pertences",
        "rotas": "Planeje suas rotas",
        "chuva": "Confira a previsão do tempo",
        "horarios": "Confira horários de visitação"
    };

    let favoritos = [];

    try {

        const dados = JSON.parse(
            localStorage.getItem(chave)
        );

        if (Array.isArray(dados)) {

            favoritos = [
                ...new Set(
                    dados.filter(function (id) {

                        return Object.prototype.hasOwnProperty.call(
                            nomesDicas,
                            id
                        );

                    })
                )
            ];

        }

    } catch (erro) {

        console.warn(
            "Erro ao carregar os favoritos:",
            erro
        );

        favoritos = [];

    }

    function atualizarFavoritos() {

        botoesFavoritos.forEach(function (botao) {

            const id = botao.dataset.dica;

            const salvo = favoritos.includes(id);

            if (salvo) {

                botao.textContent = "♥ Dica salva";

                botao.classList.add("favoritado");

                botao.setAttribute(
                    "aria-pressed",
                    "true"
                );

            } else {

                botao.textContent = "♡ Salvar dica";

                botao.classList.remove("favoritado");

                botao.setAttribute(
                    "aria-pressed",
                    "false"
                );

            }

        });

        const total = favoritos.length;

        if (contadorFavoritos) {

            if (total === 0) {

                contadorFavoritos.textContent =
                    "Nenhuma dica salva ainda.";

            } else if (total === 1) {

                contadorFavoritos.textContent =
                    "1 dica salva nos favoritos.";

            } else {

                contadorFavoritos.textContent =
                    total + " dicas salvas nos favoritos.";

            }

        }

    }

    botoesFavoritos.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const id = botao.dataset.dica;

            if (!Object.prototype.hasOwnProperty.call(
                nomesDicas,
                id
            )) {
                return;
            }

            const anteriores = [...favoritos];

            if (favoritos.includes(id)) {

                favoritos = favoritos.filter(
                    function (item) {
                        return item !== id;
                    }
                );

            } else {

                favoritos.push(id);

            }

            try {

                localStorage.setItem(
                    chave,
                    JSON.stringify(favoritos)
                );

            } catch (erro) {

                favoritos = anteriores;

                console.error(
                    "Erro ao salvar favoritos:",
                    erro
                );

                alert(
                    "Não foi possível salvar a dica neste navegador."
                );

                return;

            }

            atualizarFavoritos();

        });

    });

    atualizarFavoritos();

    console.log(
        "Página 9: filtros e favoritos funcionando!"
    );

})();
