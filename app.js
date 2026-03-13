window.onload = function() {
    console.log("Bienvenido al mundo de los gatitos 🐱");
}

const tarjetas = document.querySelectorAll(".card");

tarjetas.forEach(function(card){
    
    card.addEventListener("click", function(){

        const nombre = card.querySelector("h3").textContent;

        alert("¡Has seleccionado al " + nombre + "! 🐾");

    });

});