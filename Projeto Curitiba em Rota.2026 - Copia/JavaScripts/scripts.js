
document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".destaque-inicio .slide");

    let indiceAtual = 0;

    if (slides.length > 1) {
        setInterval(function () {
            slides[indiceAtual].classList.remove("ativo");

            indiceAtual = (indiceAtual + 1) % slides.length;

            slides[indiceAtual].classList.add("ativo");
        }, 3000);
    }
});
