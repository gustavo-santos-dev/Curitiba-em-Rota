
(function () {

    const atividades = {
        "museus": "Visitar exposições de arte",
        "barigui": "Caminhada no Parque Barigui",
        "botanico": "Passeio no Jardim Botânico",
        "teatro": "Assistir a uma peça de teatro",
        "tangua": "Fim de tarde no Parque Tanguá",
        "passeio-publico": "Conhecer o Passeio Público"
    };

    const botoesFiltro = document.querySelectorAll(".evt7-filtro");
    const cartoes = document.querySelectorAll(".evt7-card");
    const resultado = document.getElementById("evt7-resultado");

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

            cartoes.forEach(function (cartao) {

                const categoria = cartao.dataset.categoria;
                const mostrar = filtro === "todos" || categoria === filtro;

                cartao.hidden = !mostrar;

                if (mostrar) {
                    quantidade++;
                }
            });

            if (resultado) {
                resultado.textContent =
                    quantidade === 1
                        ? "1 atividade encontrada"
                        : quantidade + " atividades encontradas";
            }
        });
    });

    const formulario = document.getElementById("evt7-formulario");
    const campoAtividade = document.getElementById("evt7-atividade");
    const campoData = document.getElementById("evt7-data");
    const campoHorario = document.getElementById("evt7-horario");
    const campoObservacao = document.getElementById("evt7-observacao");
    const lista = document.getElementById("evt7-lista-salvos");
    const mensagem = document.getElementById("evt7-mensagem");
    const total = document.getElementById("evt7-total");

    const chave = "curitibaEmRotaAgendaEventos";

    let agenda = [];

    try {
        const dados = JSON.parse(localStorage.getItem(chave));

        if (Array.isArray(dados)) {
            agenda = dados.filter(function (item) {
                return item &&
                    typeof item.id === "string" &&
                    Object.prototype.hasOwnProperty.call(
                        atividades,
                        item.atividade
                    ) &&
                    typeof item.data === "string" &&
                    typeof item.horario === "string";
            });
        }
    } catch (erro) {
        console.warn(
            "Não foi possível recuperar a agenda:",
            erro
        );

        agenda = [];
    }

    function criarElemento(tag, texto) {
        const elemento = document.createElement(tag);
        elemento.textContent = texto;
        return elemento;
    }

    function formatarData(data) {
        const partes = data.split("-");

        if (partes.length !== 3) {
            return data;
        }

        return (
            partes[2] + "/" +
            partes[1] + "/" +
            partes[0]
        );
    }

    function salvarAgenda() {
        try {
            localStorage.setItem(
                chave,
                JSON.stringify(agenda)
            );

            return true;

        } catch (erro) {
            console.error(
                "Erro ao salvar programação:",
                erro
            );

            if (mensagem) {
                mensagem.textContent =
                    "Não foi possível salvar neste navegador.";
            }

            return false;
        }
    }

    function mostrarAgenda() {

        if (!lista || !total) {
            return;
        }

        lista.replaceChildren();
        total.textContent = agenda.length;

        if (agenda.length === 0) {
            const vazio = criarElemento(
                "p",
                "Sua programação está vazia. Escolha uma atividade para começar!"
            );

            vazio.className = "evt7-lista-vazia";
            lista.appendChild(vazio);

            return;
        }

        const ordenada = [...agenda].sort(function (a, b) {
            return (
                a.data + "T" + a.horario
            ).localeCompare(
                b.data + "T" + b.horario
            );
        });

        ordenada.forEach(function (item) {

            const cartao = document.createElement("article");
            cartao.className = "evt7-item-salvo";

            cartao.appendChild(
                criarElemento(
                    "h4",
                    atividades[item.atividade]
                )
            );

            cartao.appendChild(
                criarElemento(
                    "p",
                    "📅 " + formatarData(item.data)
                )
            );

            cartao.appendChild(
                criarElemento(
                    "p",
                    "🕒 " + item.horario
                )
            );

            if (
                typeof item.observacao === "string" &&
                item.observacao.trim() !== ""
            ) {
                cartao.appendChild(
                    criarElemento(
                        "p",
                        "📝 " + item.observacao
                    )
                );
            }

            const excluir = criarElemento(
                "button",
                "Excluir atividade"
            );

            excluir.type = "button";
            excluir.className = "evt7-excluir";

            excluir.addEventListener("click", function () {

                const confirmar = confirm(
                    "Deseja excluir esta atividade da programação?"
                );

                if (!confirmar) {
                    return;
                }

                const anteriores = [...agenda];

                agenda = agenda.filter(function (atividade) {
                    return atividade.id !== item.id;
                });

                if (salvarAgenda()) {
                    mostrarAgenda();

                    if (mensagem) {
                        mensagem.textContent =
                            "Atividade excluída com sucesso.";
                    }
                } else {
                    agenda = anteriores;
                }
            });

            cartao.appendChild(excluir);
            lista.appendChild(cartao);
        });
    }

    const botoesAdicionar = document.querySelectorAll(
        ".evt7-adicionar"
    );

    botoesAdicionar.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const id = botao.dataset.atividade;

            if (!Object.prototype.hasOwnProperty.call(
                atividades,
                id
            )) {
                return;
            }

            if (!campoAtividade || !campoData) {
                return;
            }

            campoAtividade.value = id;

            if (mensagem) {
                mensagem.textContent =
                    "Atividade selecionada! Escolha a data e o horário.";
            }

            const secaoAgenda = document.getElementById(
                "minha-agenda"
            );

            if (secaoAgenda) {
                secaoAgenda.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });

    if (formulario) {

        formulario.addEventListener("submit", function (evento) {

            evento.preventDefault();

            const atividade = campoAtividade.value;
            const data = campoData.value;
            const horario = campoHorario.value;
            const observacao = campoObservacao.value.trim();

            if (
                !Object.prototype.hasOwnProperty.call(
                    atividades,
                    atividade
                ) ||
                !data ||
                !horario
            ) {
                mensagem.textContent =
                    "Preencha a atividade, a data e o horário.";

                return;
            }

            const id =
                Date.now().toString() + "-" +
                Math.random().toString(36).slice(2);

            const novaAtividade = {
                id: id,
                atividade: atividade,
                data: data,
                horario: horario,
                observacao: observacao
            };

            agenda.push(novaAtividade);

            if (!salvarAgenda()) {
                agenda.pop();
                return;
            }

            mostrarAgenda();
            formulario.reset();

            mensagem.textContent =
                "Atividade salva com sucesso!";
        });
    }

    mostrarAgenda();

    console.log(
        "Página 7: filtros e programação carregados!"
    );

})();
