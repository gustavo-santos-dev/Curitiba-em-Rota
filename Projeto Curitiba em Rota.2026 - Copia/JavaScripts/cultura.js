
document.addEventListener("DOMContentLoaded", function () {

    const botoesFiltro = document.querySelectorAll(".cult5-filtro");
    const cartoesMuseus = document.querySelectorAll(".cult5-museu");
    const contadorMuseus = document.getElementById("cult5-contador");

    function filtrarMuseus(categoriaSelecionada) {

        let quantidade = 0;

        botoesFiltro.forEach(function (botao) {
            const selecionado = botao.dataset.filtro === categoriaSelecionada;

            botao.classList.toggle("ativo", selecionado);
            botao.setAttribute("aria-pressed", String(selecionado));
        });

        cartoesMuseus.forEach(function (museu) {

            const categoria = museu.dataset.categoria;

            const mostrar = categoriaSelecionada === "todos" ||
                categoria === categoriaSelecionada;

            museu.hidden = !mostrar;

            if (mostrar) {
                quantidade++;
            }

        });

        if (contadorMuseus) {
            contadorMuseus.textContent = quantidade === 1
                ? "1 local encontrado"
                : quantidade + " locais encontrados";
        }

    }

    botoesFiltro.forEach(function (botao) {

        botao.addEventListener("click", function () {
            filtrarMuseus(botao.dataset.filtro);
        });

    });

    filtrarMuseus("todos");

    const chaveFavoritos = "curitibaEmRotaMuseusFavoritos";

    const botoesFavoritos = document.querySelectorAll(".cult5-favorito");
    const contadorFavoritos = document.getElementById("cult5-favoritos-total");

    const nomesMuseus = {
        mon: "Museu Oscar Niemeyer",
        muma: "Museu Municipal de Arte",
        "museu-paranaense": "Museu Paranaense",
        holocausto: "Museu do Holocausto",
        ucraniano: "Memorial Ucraniano",
        paranista: "Memorial Paranista"
    };

    let favoritos = [];

    try {

        const salvos = JSON.parse(localStorage.getItem(chaveFavoritos));

        if (Array.isArray(salvos)) {
            favoritos = [
                ...new Set(
                    salvos.filter(function (id) {
                        return Object.prototype.hasOwnProperty.call(nomesMuseus, id);
                    })
                )
            ];
        }

    } catch (erro) {
        console.warn("Erro ao carregar favoritos:", erro);
    }

    function atualizarFavoritos() {

        botoesFavoritos.forEach(function (botao) {

            const id = botao.dataset.favorito;
            const estaFavoritado = favoritos.includes(id);

            botao.classList.toggle("favoritado", estaFavoritado);
            botao.setAttribute("aria-pressed", String(estaFavoritado));

            if (botao.classList.contains("cult5-favorito-destaque")) {

                botao.textContent = estaFavoritado
                    ? "♥ Favoritado"
                    : "♡ Favoritar";

            } else {

                botao.textContent = estaFavoritado
                    ? "♥"
                    : "♡";

            }

            botao.setAttribute(
                "aria-label",
                (estaFavoritado
                    ? "Remover dos favoritos: "
                    : "Adicionar aos favoritos: ") +
                (nomesMuseus[id] || "Museu")
            );

        });

        if (contadorFavoritos) {

            const quantidade = favoritos.length;

            if (quantidade === 0) {
                contadorFavoritos.textContent =
                    "Nenhum museu favoritado ainda.";
            } else if (quantidade === 1) {
                contadorFavoritos.textContent =
                    "1 museu salvo nos favoritos.";
            } else {
                contadorFavoritos.textContent =
                    quantidade + " museus salvos nos favoritos.";
            }

        }

    }

    botoesFavoritos.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const id = botao.dataset.favorito;

            if (!Object.prototype.hasOwnProperty.call(nomesMuseus, id)) {
                return;
            }

            const anteriores = [...favoritos];

            if (favoritos.includes(id)) {

                favoritos = favoritos.filter(function (item) {
                    return item !== id;
                });

            } else {

                favoritos.push(id);

            }

            try {

                localStorage.setItem(
                    chaveFavoritos,
                    JSON.stringify(favoritos)
                );

            } catch (erro) {

                favoritos = anteriores;

                console.error(
                    "Não foi possível salvar os favoritos:",
                    erro
                );

                alert("O navegador não permitiu salvar os favoritos.");

            }

            atualizarFavoritos();

        });

    });

    atualizarFavoritos();

});
