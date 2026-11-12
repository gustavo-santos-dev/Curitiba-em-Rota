
const botoesFiltro = document.querySelectorAll(".rot6-filtro");
const cartoesRoteiros = document.querySelectorAll(".rot6-card");
const contadorRoteiros = document.getElementById("rot6-resultado");

botoesFiltro.forEach(function (botao) {
    botao.addEventListener("click", function () {
        const filtro = botao.dataset.filtro;
        let quantidade = 0;

        botoesFiltro.forEach(function (item) {
            item.classList.remove("ativo");
            item.setAttribute("aria-pressed", "false");
        });

        botao.classList.add("ativo");
        botao.setAttribute("aria-pressed", "true");

        cartoesRoteiros.forEach(function (cartao) {
            const categoria = cartao.dataset.categoria;
            const mostrar = filtro === "todos" || categoria === filtro;

            cartao.hidden = !mostrar;

            if (mostrar) {
                quantidade++;
            }
        });

        if (contadorRoteiros) {
            contadorRoteiros.textContent =
                quantidade === 1
                    ? "1 roteiro encontrado"
                    : quantidade + " roteiros encontrados";
        }
    });
});

const chaveFavoritos = "curitibaEmRotaRoteirosFavoritos";
const botoesFavoritos = document.querySelectorAll(".rot6-favorito");
const totalFavoritos = document.getElementById("rot6-favoritos-total");

const nomesRoteiros = {
    "um-dia": "Curitiba em 1 dia",
    "dois-dias": "Curitiba em 2 dias",
    "economico": "Roteiro Econômico",
    "cultural": "Roteiro Cultural"
};

let favoritos = [];

try {
    const dados = JSON.parse(localStorage.getItem(chaveFavoritos));

    if (Array.isArray(dados)) {
        favoritos = [
            ...new Set(
                dados.filter(function (id) {
                    return Object.prototype.hasOwnProperty.call(
                        nomesRoteiros,
                        id
                    );
                })
            )
        ];
    }
} catch (erro) {
    console.warn("Erro ao carregar os favoritos:", erro);
}

function atualizarBotoesFavoritos() {
    botoesFavoritos.forEach(function (botao) {
        const id = botao.dataset.roteiro;
        const estaSalvo = favoritos.includes(id);

        botao.classList.toggle("favoritado", estaSalvo);
        botao.setAttribute("aria-pressed", String(estaSalvo));

        if (estaSalvo) {
            botao.textContent = "♥ Roteiro salvo";
        } else {
            botao.textContent = "♡ Salvar roteiro";
        }

        botao.setAttribute(
            "aria-label",
            (estaSalvo
                ? "Remover dos favoritos: "
                : "Salvar nos favoritos: ") +
            (nomesRoteiros[id] || "Roteiro")
        );
    });
}

function atualizarContadorFavoritos() {
    if (!totalFavoritos) {
        return;
    }

    const quantidade = favoritos.length;

    if (quantidade === 0) {
        totalFavoritos.textContent =
            "Nenhum roteiro salvo ainda.";
    } else if (quantidade === 1) {
        totalFavoritos.textContent =
            "1 roteiro salvo nos favoritos.";
    } else {
        totalFavoritos.textContent =
            quantidade + " roteiros salvos nos favoritos.";
    }
}

botoesFavoritos.forEach(function (botao) {
    botao.addEventListener("click", function () {
        const id = botao.dataset.roteiro;

        if (!Object.prototype.hasOwnProperty.call(
            nomesRoteiros,
            id
        )) {
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
                "Erro ao salvar favoritos:",
                erro
            );

            alert(
                "Não foi possível salvar o roteiro neste navegador."
            );
        }

        atualizarBotoesFavoritos();
        atualizarContadorFavoritos();
    });
});

atualizarBotoesFavoritos();
atualizarContadorFavoritos();

console.log("Página 6: filtros e favoritos carregados!");

(function () {
    const formulario = document.getElementById("rot6-formulario");
    const lista = document.getElementById("rot6-lista-salvos");
    const mensagem = document.getElementById("rot6-mensagem");
    const chave = "curitibaEmRotaMeusRoteiros";

    if (!formulario || !lista) {
        return;
    }

    let roteiros = [];

    try {
        const dados = JSON.parse(localStorage.getItem(chave));

        if (Array.isArray(dados)) {
            roteiros = dados;
        }
    } catch (erro) {
        console.warn(
            "Não foi possível carregar os roteiros.",
            erro
        );
    }

    function criarElemento(tag, texto) {
        const elemento = document.createElement(tag);
        elemento.textContent = texto;
        return elemento;
    }

    function formatarData(data) {
        if (!data) {
            return "Data não definida";
        }

        const partes = data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return partes[2] + "/" +
               partes[1] + "/" +
               partes[0];
    }

    function mostrarRoteiros() {
        lista.replaceChildren();

        if (roteiros.length === 0) {
            const vazio = criarElemento(
                "p",
                "Você ainda não criou nenhum roteiro."
            );

            vazio.className = "rot6-vazio";
            lista.appendChild(vazio);
            return;
        }

        roteiros.forEach(function (roteiro, indice) {
            const cartao = document.createElement("article");
            cartao.className = "rot6-roteiro-salvo";

            cartao.appendChild(
                criarElemento("h4", roteiro.nome)
            );

            cartao.appendChild(
                criarElemento(
                    "p",
                    "📅 " + formatarData(roteiro.data) +
                    " | " + roteiro.periodo
                )
            );

            cartao.appendChild(
                criarElemento("p", "📍 Lugares:")
            );

            const lugares = document.createElement("ul");

            roteiro.lugares.forEach(function (lugar) {
                lugares.appendChild(
                    criarElemento("li", lugar)
                );
            });

            cartao.appendChild(lugares);

            if (roteiro.observacoes) {
                cartao.appendChild(
                    criarElemento(
                        "p",
                        "📝 " + roteiro.observacoes
                    )
                );
            }

            const excluir = criarElemento(
                "button",
                "Excluir roteiro"
            );

            excluir.type = "button";
            excluir.className = "rot6-excluir";

            excluir.addEventListener("click", function () {
                const confirmar = confirm(
                    "Deseja excluir este roteiro?"
                );

                if (!confirmar) {
                    return;
                }

                const anteriores = [...roteiros];

                roteiros.splice(indice, 1);

                if (salvarRoteiros()) {
                    mostrarRoteiros();

                    mensagem.textContent =
                        "Roteiro excluído.";
                } else {
                    roteiros = anteriores;
                }
            });

            cartao.appendChild(excluir);
            lista.appendChild(cartao);
        });
    }

    function salvarRoteiros() {
        try {
            localStorage.setItem(
                chave,
                JSON.stringify(roteiros)
            );

            return true;
        } catch (erro) {
            console.error(
                "Erro ao salvar roteiro:",
                erro
            );

            mensagem.textContent =
                "Não foi possível salvar neste navegador.";

            return false;
        }
    }

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const nome = document.getElementById(
            "rot6-nome"
        ).value.trim();

        const data = document.getElementById(
            "rot6-data"
        ).value;

        const periodo = document.getElementById(
            "rot6-periodo"
        ).value;

        const textoLugares = document.getElementById(
            "rot6-lugares"
        ).value;

        const observacoes = document.getElementById(
            "rot6-observacoes"
        ).value.trim();

        const lugares = textoLugares
            .split("\n")
            .map(function (lugar) {
                return lugar.trim();
            })
            .filter(function (lugar) {
                return lugar.length > 0;
            });

        if (!nome || lugares.length === 0) {
            mensagem.textContent =
                "Informe um nome e pelo menos um lugar.";

            return;
        }

        const novoRoteiro = {
            nome: nome,
            data: data,
            periodo: periodo,
            lugares: lugares,
            observacoes: observacoes
        };

        roteiros.push(novoRoteiro);

        if (!salvarRoteiros()) {
            roteiros.pop();
            return;
        }

        mostrarRoteiros();
        formulario.reset();

        mensagem.textContent =
            "Roteiro salvo com sucesso!";
    });

    mostrarRoteiros();
})();
