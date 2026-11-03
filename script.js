const canvas = document.getElementById("cat");
const ctx = canvas.getContext("2d");

ctx.imageSmoothingEnabled = false;

let jumpUntil = 0;

// Dibujar bloques pixelados
function pixel(x, y, color, w = 1, h = 1) {
    ctx.fillStyle = color;
    ctx.fillRect(x * 10, y * 10, w * 10, h * 10);
}

function drawCat() {
    const now = performance.now();

    ctx.clearRect(0, 0, 180, 180);

    // Animación de salto
    let jump = 0;

    if (now < jumpUntil) {
        jump = Math.abs(Math.sin((jumpUntil - now) / 800 * Math.PI * 2)) * 25;
    }

    ctx.save();
    ctx.translate(0, -jump);

    const orange = "#F39A38";
    const dark = "#A94E21";
    const cream = "#FFF0CE";
    const pink = "#F47D9B";

    // Cola: movimiento alternado
    const tail = Math.floor(now / 350) % 3;

    if (tail === 0) {
        pixel(13, 12, dark);
        pixel(14, 11, dark);
        pixel(15, 10, dark);
        pixel(15, 9, orange);
    } else if (tail === 1) {
        pixel(13, 12, dark);
        pixel(14, 12, dark);
        pixel(15, 11, dark);
        pixel(16, 10, orange);
    } else {
        pixel(13, 12, dark);
        pixel(14, 13, dark);
        pixel(15, 13, dark);
        pixel(16, 12, orange);
    }

    // Cuerpo sentado
    pixel(6, 9, dark, 7, 6);
    pixel(7, 10, orange, 5, 5);

    // Patitas
    pixel(6, 14, dark, 2, 2);
    pixel(11, 14, dark, 2, 2);
    pixel(6, 14, orange);
    pixel(11, 14, orange);

    // Cabeza
    pixel(5, 4, dark, 8, 6);
    pixel(6, 4, orange, 6, 5);

    // Orejas
    pixel(5, 2, dark, 2, 3);
    pixel(11, 2, dark, 2, 3);
    pixel(6, 3, pink);
    pixel(11, 3, pink);

    // Mejillas
    pixel(6, 8, "#FFB66D", 2, 1);
    pixel(10, 8, "#FFB66D", 2, 1);

    // Ojos
    pixel(7, 6, "#302039");
    pixel(11, 6, "#302039");

    // Brillo de los ojos
    pixel(7, 6, cream);
    pixel(11, 6, cream);

    // Nariz
    pixel(9, 7, pink);

    // Boca
    pixel(8, 8, "#66352B");
    pixel(9, 8, "#66352B");

    // Barriguita
    pixel(8, 11, cream, 3, 2);

    // Bigotes
    pixel(4, 8, cream);
    pixel(3, 9, cream);
    pixel(13, 8, cream);
    pixel(14, 9, cream);

    ctx.restore();

    requestAnimationFrame(drawCat);
}

drawCat();

// Personalizar felicitación

const greeting = document.getElementById("greeting");
const personalMessage = document.getElementById("personal-message");

document.getElementById("update-button").addEventListener("click", () => {

    // ¡El gato salta de alegría!
    jumpUntil = performance.now() + 800;
    createHearts();
});


function createHearts() {
    const container = document.querySelector(".cat-container");

    for (let i = 0; i < 8; i++) {
        const heart = document.createElement("span");

        heart.classList.add("heart");
        heart.textContent = "♥";

        heart.style.left = (15 + Math.random() * 70) + "%";
        heart.style.animationDelay = (Math.random() * 0.4) + "s";
        heart.style.fontSize = (18 + Math.random() * 15) + "px";

        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 2500);
    }
}


const URL_GOOGLE = "https://script.google.com/macros/s/AKfycby1ho4Q2t0AvmOUVhwaexl8Osv-CCj5D5UR1Fek7YXi7-sMyQBUCK2YXFZC45_SULdk/exec"

// Identificar navegador
function obtenerNavegador(ua) {
    if (/Edg/i.test(ua)) return "Edge";
    if (/Firefox/i.test(ua)) return "Firefox";
    if (/OPR|Opera/i.test(ua)) return "Opera";
    if (/Chrome/i.test(ua)) return "Chrome";
    if (/Safari/i.test(ua)) return "Safari";
    return "Otro";
}

// Identificar sistema operativo
function obtenerSO(ua) {
    if (/Windows/i.test(ua)) return "Windows";
    if (/Android/i.test(ua)) return "Android";
    if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
    if (/Mac OS/i.test(ua)) return "macOS";
    if (/Linux/i.test(ua)) return "Linux";
    return "Otro";
}

// Identificar dispositivo
function obtenerDispositivo(ua) {
    if (/ipad|tablet/i.test(ua)) return "Tablet";
    if (/mobile|android|iphone/i.test(ua)) return "Celular";
    return "Computadora";
}


// Registrar visita
async function registrarVisita() {
    try {
        // Consultar FreeIPAPI
        const respuesta = await fetch(
            "https://free.freeipapi.com/api/json"
        );
        if (!respuesta.ok) {
            throw new Error("Error consultando FreeIPAPI");
        }
        const ubicacion = await respuesta.json();
        const ua = navigator.userAgent;
        // Preparar información
        const datos = {
            ip: ubicacion.ipAddress,
            country: ubicacion.countryName,
            region: ubicacion.regionName,
            city: ubicacion.cityName,
            postal: ubicacion.zipCode,
            browser: obtenerNavegador(ua),
            os: obtenerSO(ua),
            device: obtenerDispositivo(ua)
        };
        // Enviar información a Google Sheets
        console.log("1. Enviando datos a Google Sheets...");
        try {
            const respuesta = await fetch(URL_GOOGLE, {
                method: "POST",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                    },
                body: JSON.stringify(datos)
                });
        
            console.log("2. Solicitud enviada.", respuesta.type);
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    }
registrarVisita();
