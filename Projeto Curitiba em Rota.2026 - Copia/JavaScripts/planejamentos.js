
(function () {

    const camposGastos = [
        "plan8-transporte",
        "plan8-alimentacao",
        "plan8-passeios",
        "plan8-hospedagem",
        "plan8-outros"
    ];

    const botaoCalcular = document.getElementById(
        "plan8-calcular"
    );

    const resultado = document.getElementById(
        "plan8-valor-total"
    );

    const mensagem = document.getElementById(
        "plan8-status"
    );

    function calcularGastos() {

        let total = 0;

        for (const id of camposGastos) {

            const campo = document.getElementById(id);

            if (!campo) {
                console.error(
                    "Campo não encontrado: " + id
                );
                return;
            }

            if (campo.value === "") {
                continue;
            }

            if (!campo.checkValidity()) {
                campo.reportValidity();
                return;
            }

            const valor = Number(campo.value);

            if (
                !Number.isFinite(valor) ||
                valor < 0
            ) {
                mensagem.textContent =
                    "Preencha apenas valores válidos.";

                campo.focus();
                return;
            }

            total += valor;
        }

        const totalFormatado = total.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

        resultado.textContent = totalFormatado;

        mensagem.textContent =
            "Orçamento calculado com sucesso!";

        console.log(
            "Total estimado: " + totalFormatado
        );
    }

    if (botaoCalcular) {

        botaoCalcular.addEventListener(
            "click",
            calcularGastos
        );

    } else {

        console.error(
            "O botão Calcular gastos não foi encontrado."
        );
    }

    const formularioOrcamento = document.getElementById(
        "plan8-form-orcamento"
    );

    if (formularioOrcamento) {

        formularioOrcamento.addEventListener(
            "submit",
            function (evento) {
                evento.preventDefault();
                calcularGastos();
            }
        );
    }

})();

(function () {

    const formulario = document.getElementById(
        "plan8-form-item"
    );

    const campoItem = document.getElementById(
        "plan8-novo-item"
    );

    const listaExtras = document.getElementById(
        "plan8-itens-extras"
    );

    const percentual = document.getElementById(
        "plan8-percentual"
    );

    const contador = document.getElementById(
        "plan8-contador"
    );

    const barra = document.getElementById(
        "plan8-barra-preenchida"
    );

    const botaoLimpar = document.getElementById(
        "plan8-limpar-checklist"
    );

    const chaveMarcados = "curitibaRotaChecklistV1";
    const chaveExtras = "curitibaRotaItensExtrasV1";

    function carregar(chave, padrao) {

        try {
            const dados = localStorage.getItem(chave);

            return dados === null
                ? padrao
                : JSON.parse(dados);

        } catch (erro) {
            console.warn("Erro ao carregar dados:", erro);
            return padrao;
        }
    }

    let marcados = carregar(chaveMarcados, {});
    let itensExtras = carregar(chaveExtras, []);

    if (
        !marcados ||
        typeof marcados !== "object" ||
        Array.isArray(marcados)
    ) {
        marcados = {};
    }

    if (!Array.isArray(itensExtras)) {
        itensExtras = [];
    }

    function salvar(chave, dados) {

        try {

            localStorage.setItem(
                chave,
                JSON.stringify(dados)
            );

            return true;

        } catch (erro) {

            alert(
                "Não foi possível salvar os dados neste navegador."
            );

            console.error(erro);
            return false;
        }
    }

    function obterCheckboxes() {

        return document.querySelectorAll(
            ".plan8-lista-checklist input[type='checkbox'], " +
            ".plan8-itens-extras input[type='checkbox']"
        );
    }

    function atualizarProgresso() {

        const caixas = Array.from(
            obterCheckboxes()
        );

        const total = caixas.length;

        const concluidos = caixas.filter(
            function (caixa) {
                return caixa.checked;
            }
        ).length;

        const porcentagem = total === 0
            ? 0
            : Math.round(
                (concluidos / total) * 100
            );

        percentual.textContent =
            porcentagem + "%";

        contador.textContent =
            concluidos + " de " +
            total + " itens concluídos";

        barra.style.width =
            porcentagem + "%";
    }

    function configurarCheckbox(caixa) {

        const id = caixa.dataset.item;

        caixa.checked = marcados[id] === true;

        caixa.addEventListener("change", function () {

            const valorAnterior = marcados[id];

            marcados[id] = caixa.checked;

            if (!salvar(chaveMarcados, marcados)) {

                marcados[id] = valorAnterior;
                caixa.checked = !caixa.checked;
            }

            atualizarProgresso();
        });
    }

    document.querySelectorAll(
        ".plan8-lista-checklist input[type='checkbox']"
    ).forEach(configurarCheckbox);

    function mostrarItensExtras() {

        listaExtras.replaceChildren();

        itensExtras.forEach(function (item) {

            const linha = document.createElement("div");
            linha.className = "plan8-item-extra";

            const label = document.createElement("label");
            label.className = "plan8-item";

            const caixa = document.createElement("input");
            caixa.type = "checkbox";
            caixa.dataset.item = item.id;

            const texto = document.createElement("span");
            texto.textContent = item.texto;

            label.appendChild(caixa);
            label.appendChild(texto);

            const excluir = document.createElement("button");

            excluir.type = "button";
            excluir.className = "plan8-excluir-item";
            excluir.textContent = "Excluir";

            excluir.addEventListener("click", function () {

                const anteriores = [...itensExtras];

                itensExtras = itensExtras.filter(
                    function (outro) {
                        return outro.id !== item.id;
                    }
                );

                if (!salvar(chaveExtras, itensExtras)) {

                    itensExtras = anteriores;
                    return;
                }

                delete marcados[item.id];

                salvar(chaveMarcados, marcados);

                mostrarItensExtras();
            });

            linha.appendChild(label);
            linha.appendChild(excluir);
            listaExtras.appendChild(linha);

            configurarCheckbox(caixa);
        });

        atualizarProgresso();
    }

    formulario.addEventListener("submit", function (evento) {

        evento.preventDefault();

        const nome = campoItem.value.trim();

        if (nome === "") {
            alert("Digite o nome do item.");
            return;
        }

        const novoItem = {
            id: "extra-" +
                Date.now() + "-" +
                Math.random().toString(36).slice(2),
            texto: nome
        };

        itensExtras.push(novoItem);

        if (!salvar(chaveExtras, itensExtras)) {

            itensExtras.pop();
            return;
        }

        campoItem.value = "";

        mostrarItensExtras();

        console.log(
            "Item adicionado:",
            novoItem.texto
        );
    });

    botaoLimpar.addEventListener("click", function () {

        const anteriores = { ...marcados };
        const novos = {};

        obterCheckboxes().forEach(function (caixa) {
            novos[caixa.dataset.item] = false;
        });

        if (!salvar(chaveMarcados, novos)) {

            marcados = anteriores;
            return;
        }

        marcados = novos;

        obterCheckboxes().forEach(function (caixa) {
            caixa.checked = false;
        });

        atualizarProgresso();
    });

    mostrarItensExtras();

    console.log(
        "Checklist da página 8 funcionando!"
    );

})();

(function () {

    const chave = "curitibaRotaOrcamentoV1";

    const ids = [
        "plan8-transporte",
        "plan8-alimentacao",
        "plan8-passeios",
        "plan8-hospedagem",
        "plan8-outros"
    ];

    let salvos = {};

    try {

        salvos = JSON.parse(
            localStorage.getItem(chave)
        ) || {};

    } catch (erro) {
        salvos = {};
    }

    function atualizarTotal() {

        let total = 0;

        ids.forEach(function (id) {

            const campo = document.getElementById(id);
            const valor = Number(campo.value);

            if (
                campo.value !== "" &&
                campo.checkValidity() &&
                Number.isFinite(valor) &&
                valor >= 0
            ) {
                total += valor;
            }
        });

        document.getElementById(
            "plan8-valor-total"
        ).textContent = total.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );
    }

    function salvarValores() {

        const valores = {};

        ids.forEach(function (id) {

            valores[id] = document.getElementById(
                id
            ).value;
        });

        try {

            localStorage.setItem(
                chave,
                JSON.stringify(valores)
            );

        } catch (erro) {

            console.warn(
                "Não foi possível salvar o orçamento.",
                erro
            );
        }
    }

    ids.forEach(function (id) {

        const campo = document.getElementById(id);
        const valor = salvos[id];

        if (
            typeof valor === "string" &&
            valor !== "" &&
            Number.isFinite(Number(valor)) &&
            Number(valor) >= 0 &&
            Number(valor) <= 1000000
        ) {
            campo.value = valor;
        }

        campo.addEventListener("input", function () {
            atualizarTotal();
            salvarValores();
        });
    });

    document.getElementById(
        "plan8-limpar-orcamento"
    ).addEventListener("click", function () {

        ids.forEach(function (id) {
            document.getElementById(id).value = "";
        });

        atualizarTotal();
        salvarValores();
    });

    atualizarTotal();

})();
