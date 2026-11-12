
document.addEventListener("DOMContentLoaded", function () {

    const cartoes = document.querySelectorAll(".pagina-gastronomia .gastro-cartao");
    const chave = "curitibaEmRotaFavoritos";

    let favoritos = [];

    try {
        const dados = JSON.parse(localStorage.getItem(chave));
        favoritos = Array.isArray(dados) ? dados : [];
    } catch (erro) {
        favoritos = [];
    }

    const secao = document.querySelector(".gastro-pratos");
    const grade = document.querySelector(".gastro-grade");

    if (!secao || !grade || cartoes.length === 0) {
        return;
    }

    const contador = document.createElement("p");
    contador.className = "gastro-favoritos-contador";
    contador.setAttribute("aria-live", "polite");

    grade.before(contador);

    function atualizarContador() {
        const quantidade = favoritos.length;

        contador.textContent = quantidade === 0
            ? "Você ainda não favoritou nenhum prato."
            : `${quantidade} prato(s) favorito(s) salvo(s).`;
    }

    function salvarFavoritos() {
        try {
            localStorage.setItem(chave, JSON.stringify(favoritos));
        } catch (erro) {
            contador.textContent = "Não foi possível salvar os favoritos neste navegador.";
            return false;
        }

        return true;
    }

    cartoes.forEach(function (cartao) {

        const titulo = cartao.querySelector("h3");
        const conteudo = cartao.querySelector(".gastro-cartao-conteudo");

        if (!titulo || !conteudo) {
            return;
        }

        const nome = titulo.textContent.trim();
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "gastro-favoritar";

        function atualizarBotao() {
            const favorito = favoritos.includes(nome);

            botao.textContent = favorito
                ? "♥ Favoritado"
                : "♡ Adicionar aos favoritos";

            botao.classList.toggle("favoritado", favorito);
            botao.setAttribute("aria-pressed", String(favorito));
            botao.setAttribute(
                "aria-label",
                favorito
                    ? `Remover ${nome} dos favoritos`
                    : `Adicionar ${nome} aos favoritos`
            );
        }

        botao.addEventListener("click", function () {

            const estavaFavoritado = favoritos.includes(nome);

            if (estavaFavoritado) {
                favoritos = favoritos.filter(function (item) {
                    return item !== nome;
                });
            } else {
                favoritos.push(nome);
            }

            if (!salvarFavoritos()) {
                if (estavaFavoritado) {
                    favoritos.push(nome);
                } else {
                    favoritos = favoritos.filter(function (item) {
                        return item !== nome;
                    });
                }
                return;
            }

            atualizarBotao();
            atualizarContador();

        });

        conteudo.appendChild(botao);
        atualizarBotao();

    });

    atualizarContador();

});
