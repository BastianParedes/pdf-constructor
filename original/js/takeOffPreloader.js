"use strict";

window.onload = function() {
    let body = document.querySelector("body");
    let contenedorPreloader = document.querySelector("#preloader-container");
    body.removeChild(contenedorPreloader)
    body.style["overflow"] = "visible";
}


