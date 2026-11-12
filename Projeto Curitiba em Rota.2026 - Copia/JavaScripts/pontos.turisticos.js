
document.addEventListener("DOMContentLoaded", function () {

    const botoesFiltro = document.querySelectorAll(".tour-filtro");
    const cartoesTurismo = document.querySelectorAll(".tour-cartao");
    const contadorTurismo = document.querySelector("#tour-resultado");

    function filtrarAtracoes(categoriaSelecionada) {

        let quantidade = 0;

        cartoesTurismo.forEach(function (cartao) {

            const categorias = (cartao.dataset.categorias || "").split(" ");

            const mostrar = categoriaSelecionada === "todos" ||
                categorias.includes(categoriaSelecionada);

            cartao.hidden = !mostrar;

            if (mostrar) {
                quantidade++;
            }

        });

        contadorTurismo.textContent = quantidade === 1
            ? "1 atração encontrada"
            : quantidade + " atrações encontradas";

    }

    botoesFiltro.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const categoriaSelecionada = botao.dataset.filtro;

            botoesFiltro.forEach(function (item) {

                const selecionado = item === botao;

                item.classList.toggle("ativo", selecionado);
                item.setAttribute("aria-pressed", String(selecionado));

            });

            filtrarAtracoes(categoriaSelecionada);

        });

    });

    filtrarAtracoes("todos");

});
