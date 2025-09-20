document.addEventListener("DOMContentLoaded", () => {
  const playBtn = document.getElementById("playPauseBtn");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");
  const currentTimeEl = document.getElementById("currentTime");
  const totalTimeEl = document.getElementById("totalTime");
  const audio = document.querySelector("audio"); 
  const mensajeContainer = document.getElementById("mensaje-container");

  // --- MENSAJE NORMAL ---
  const mensaje = [
    "H🤗",
    "Mi corazón de melón 💛",
    "Hoy, en este día tan especial de las flores amarillas,",
    "Quiero recordarte lo mucho que iluminas mi vida.",
    "Chyntia",
    "Eres increíble, admirable y única.",
    "Cada cosa que haces me inspira y me llena de orgullo.",
    "Tu esencia es tan hermosa que no solo endulza mis días,",
    "Sino que los convierte en algo mágico.",
    "Como un abrazo cálido que siempre llega cuando más lo necesito.",
    "Gracias por ser quien eres...",
    "Fuerte, tierna, especial… simplemente maravillosa.",
    "Cada dia a tu lado",
    "Es un regalo que valoro en el fondo de mi corazón ❤️",
    "Te Quiero 🌻"
  ];

  // --- MENSAJE ESPECIAL (3ra vez) ---
  const mensajeEspecial = [
    "Sabes...",
    "Quiero que sepas lo mucho que te valoro, lo importante que eres para mí.",
    "Cada vez que no te veo, siento que me falta algo, como si el día no fuera el mismo.",
    "En los momentos en los que, sin querer, te pienso.",
    "Sé que a veces puedo ser bobo o no hago lo que esperas.",
    "Pero siempre intento mejorar porque que te quiero, y quiero que estes bien.",
    "Tal vez las cosas no saldran como queramos.",
    "Pero lo que siento por ti siempre sera inmenso.",
    "No necesito que pasen años para darme cuenta de lo especial que eres.",
    "Y de lo mucho que me importas.",
    "Aunque la distancia o el tiempo nos separen,",
    "Siempre voy a estar para ti, con lo mejor de mí, con todo lo que soy.",
    "Esperando el momento para verte de nuevo.",
    "Te extraño más de lo que imaginas. Cada recuerdo contigo lo guardo con mucho cariño.",
    "Te quiero mucho!!! mucho!!!, mi corazón de melón.",
    "Y pase lo que pase, siempre te voy a llevar conmigo.",
    "En el fondo de mi corazón ❤️"
];

  // 🔹 Duraciones personalizadas solo para el mensaje especial
  const duracionesEspecial = [
  2000, // "Sabes..."
  3500, // "Quiero que sepas..."
  4500, // "Cada vez que no te veo..."
  3000, // "En los momentos..."
  3000, // "Sé que a veces puedo ser bobo..."
  3850, // "Pero siempre intento mejorar..."
  3000, // "Tal vez... discutamos..."
  3000, // "Pero mi cariño..."
  3000, // "No necesito que pasen años..."
  3000, // "Y de lo mucho..."
  3000, // "Aunque la
  3500, // "Siempre voy a estar..."
  2000, // "Esperando el momento..."
  4000, // "Te extraño más..."
  2500, // "Te quiero mucho!!!..."
  3000, // "Y pase lo que pase..."
  2500, // "En el fondo..."
];

  let mensajeTimeouts = [];
  let vecesReproducidas = 0; // 🔹 contador de reproducciones

  function mostrarMensaje(listaMensajes, duraciones = [], defaultDuracion = 3000) {
    let i = 0;
    mensajeContainer.innerHTML = "";

    function mostrarLinea() {
      if (i < listaMensajes.length) {
        const linea = document.createElement("p");
        linea.classList.add("mensaje-linea");
        linea.textContent = listaMensajes[i];
        mensajeContainer.innerHTML = "";
        mensajeContainer.appendChild(linea);

        setTimeout(() => linea.classList.add("visible"), 50);

        const duracion = duraciones[i] || defaultDuracion;

        setTimeout(() => {
          linea.classList.remove("visible");
          linea.classList.add("hidden");
        }, duracion - 500);

        i++;
        mensajeTimeouts.push(setTimeout(mostrarLinea, duracion));
      }
    }

    mostrarLinea();
  }

  function resetearMensaje() {
    mensajeContainer.innerHTML = "";
    mensajeTimeouts.forEach(t => clearTimeout(t));
    mensajeTimeouts = [];
  }

  // --- BOTÓN PLAY/PAUSE ---
  playBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  // --- EVENTO PLAY ---
  audio.addEventListener("play", () => {
    playIcon.style.display = "none";
    pauseIcon.style.display = "block";

    // 🔹 Si empieza desde el inicio
    if (audio.currentTime < 0.1) {
      resetearMensaje();
      document.body.classList.add("modo-oscuro");
      const flores = document.querySelector(".flowers");
      flores.style.display = "block";

      vecesReproducidas++;

      if (vecesReproducidas === 3) {
        // 🔹 Solo la tercera vez → mensaje especial
        audio.volume = 0.5; // baja volumen
        setTimeout(() => {
          mostrarMensaje(mensajeEspecial, duracionesEspecial, 6000);
        }, 3000);

      } else {
        // 🔹 Todas las demás veces
        audio.volume = 1; // volumen normal
        setTimeout(() => {
          mostrarMensaje(mensaje, [], 3500);
        }, 4000);
      }
    }
  });

  // --- EVENTO PAUSE ---
  audio.addEventListener("pause", () => {
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
  });

  // --- PROGRESO Y TIEMPO ---
  audio.addEventListener("timeupdate", () => {
    const progress = (audio.currentTime / audio.duration) * 100;
    progressFill.style.width = `${progress}%`;
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  audio.addEventListener("loadedmetadata", () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  progressBar.addEventListener("click", (e) => {
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const percentage = offsetX / rect.width;
    audio.currentTime = percentage * audio.duration;
  });

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // --- AL TERMINAR LA CANCIÓN ---
  audio.addEventListener("ended", () => {
    resetearMensaje();

    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
    progressFill.style.width = "0%";
    currentTimeEl.textContent = "0:00";

    audio.currentTime = 0; // listo para reiniciar
  });
});















// --- PARTICULAS (ESTRELLAS/BRILLOS) ---
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d", { alpha: false });
document.body.appendChild(canvas);

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.pointerEvents = "none";
canvas.style.zIndex = "999";

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;
// 🔹 Ajuste especial para móviles (reduce resolución del canvas)
if (/Mobi|Android/i.test(navigator.userAgent)) {
  canvas.width = Math.floor(width / 1.5);
  canvas.height = Math.floor(height / 1.5);
  ctx.scale(0.67, 0.67);
}
window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

class Particle {
  constructor(x, y, color, size, velocity) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.size = size;
    this.velocity = velocity;
    this.alpha = 1;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.02;
  }

  draw() {
  if (this.alpha < 0.05) return; // 🔹 NO dibujar partículas casi invisibles

  ctx.globalAlpha = this.alpha;
  ctx.globalCompositeOperation = "lighter";

  const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
  gradient.addColorStop(0, "#ffffff");
  gradient.addColorStop(0.2, "#fffacd");
  gradient.addColorStop(0.6, "#ffd700");
  gradient.addColorStop(1, "rgba(255, 215, 0, 0)");

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(255, 255, 200, 0.5)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size * 1.5, 0, Math.PI * 2);
  ctx.stroke();

  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";
}

}

let particles = [];
let copos = [];

// --- Explosión en click ---
function createExplosion(x, y) {
  const colors = ["#ffffff", "#ffd700", "#fffacd", "#ffffe0"];
  const explosionCount = /Mobi|Android/i.test(navigator.userAgent) ? 5 : 12; // menos en móvil
  for (let i = 0; i < explosionCount; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 1.2 + 0.3; // 🔹 velocidad entre 0.3 y 1.5
    particles.push(
      new Particle(
        x,
        y,
        colors[Math.floor(Math.random() * colors.length)],
        Math.random() * 3 + 1.5, // tamaño más pequeño (1.5 a 4.5 px)
        { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed }
      )
    );
  }
}

// --- Brillos siguiendo el mouse ---
function createTrail(x, y) {
  const colors = ["#ffffff", "#ffd700", "#fff8dc"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  particles.push(
    new Particle(
      x,
      y,
      color,
      Math.random() * 2 + 1, // tamaño más chico y estable
      { x: (Math.random() - 0.5) * 0.25, y: (Math.random() - 0.5) * 0.25 } // 🔹 movimiento muy suave
    )
  );
}

const MAX_PARTICLES = /Mobi|Android/i.test(navigator.userAgent) ? 30 : 700;
 // ajusta si quieres más/menos partículas en pantalla
// Dentro de audio.addEventListener("play", ...)
window.addEventListener("load", () => {
  setTimeout(() => {
    animate();
  }, 1000);
});
const isMobile = /Mobi|Android/i.test(navigator.userAgent);
function animate() {
  // 1) Fade suave del frame anterior SIN parpadear:
  // usamos 'destination-out' para "borrar parcialmente" dejando rastro luminoso.
 // 🔹 Limpieza completa → elimina manchas
ctx.clearRect(0, 0, width, height);



  // 2) Dibujar / actualizar partículas con iteración inversa (seguro al splicear)
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.update();
    p.draw();
    if (p.alpha <= 0.05 || p.size <= 0) {
      particles.splice(i, 1);
    }
  }

  // 3) Dibujar / actualizar copos (idem)
  for (let i = copos.length - 1; i >= 0; i--) {
    const c = copos[i];
    c.update();
    c.draw();
    if (c.alpha <= 0) copos.splice(i, 1);
  }

  // 4) Cap total de partículas para evitar saturación (previene "congelados")
  if (particles.length > MAX_PARTICLES) {
    // quitar los más antiguos
    particles.splice(0, particles.length - MAX_PARTICLES);
  }
  // 🔹 Cap total de copos para evitar saturación en móviles
  const MAX_COPOS = /Mobi|Android/i.test(navigator.userAgent) ? 20 : 120;
  if (copos.length > MAX_COPOS) {
    copos.splice(0, copos.length - MAX_COPOS);
  }

  if (isMobile) {
  setTimeout(() => requestAnimationFrame(animate), 33); // ~30 FPS
} else {
  requestAnimationFrame(animate); // normal en PC
}
  
}

animate();


// --- Copos de nieve ---
// En PC: salen normal cada 1.5s
// En Móvil: empiezan 3s después y salen cada 8s
if (/Mobi|Android/i.test(navigator.userAgent)) {
  setTimeout(() => {
    setInterval(() => {
      copos.push(new FallingCopo());
    }, 8000); // cada 8 seg en celular (menos copos)
  }, 3000);   // retraso de 3s al presionar play (no todo de golpe)
} else {
  setInterval(() => {
    copos.push(new FallingCopo());
  }, 1500); // PC normal
}
 // ❄️ más copos, cada 2.5s

// --- Eventos ---
let dragging = false;
let lastX = 0, lastY = 0;

window.addEventListener("mousedown", (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

window.addEventListener("mouseup", () => {
  dragging = false;

  // ✨ efecto final elegante al soltar
  for (let i = 0; i < 20; i++) {
    particles.push(
      new Particle(
        lastX,
        lastY,
        ["#ffffff", "#ffd700"][Math.floor(Math.random() * 2)],
        Math.random() * 4 + 2,
        { x: (Math.random() - 0.5) * 4, y: (Math.random() - 0.5) * 4 }
      )
    );
  }
});

// 🔹 Control de cuántos brillitos se generan
const trailCount = /Mobi|Android/i.test(navigator.userAgent) ? 1 : 2;

// --- Movimiento con mouse (PC) ---
window.addEventListener("mousemove", (e) => {
  if (dragging) {
    for (let i = 0; i < trailCount; i++) {
      createTrail(e.clientX, e.clientY);
    }
  }
  lastX = e.clientX;
  lastY = e.clientY;
});

// --- Click (explosión y copos) ---
window.addEventListener("click", (e) => {
  createExplosion(e.clientX, e.clientY);

  copos.forEach((c, i) => {
    if (c.isClicked(e.clientX, e.clientY)) {
      copos.splice(i, 1);
      createExplosion(c.x, c.y); // ❄️ explotan como chispas
    }
  });
});

// --- Copos de nieve brillosos ---
class FallingCopo {
  constructor() {
    this.x = Math.random() * width;
    this.y = -20;
    this.size = Math.random() * 8 + 6;     // tamaño copo
    this.speed = Math.random() * 0.4 + 0.1; // velocidad de caída
    this.alpha = 1;
    this.offset = Math.random() * 100;     // desfase para movimiento oscilante
  }

  update() {
    this.y += this.speed;
    this.x += Math.sin((this.y + this.offset) * 0.02) *0.3; // ❄️ se balancea
    if (this.y > height + 20) {
      this.alpha = 0; // desaparece al salir
    }
  }

  draw() {
    ctx.globalAlpha = this.alpha;
    ctx.globalCompositeOperation = "lighter";

    // Copo con brillo blanco-dorado ✨
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    gradient.addColorStop(0, "#ffffff");     // centro blanco brillante
    gradient.addColorStop(0.3, "#fffacd");   // dorado claro
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }

  isClicked(mx, my) {
    const dx = mx - this.x;
    const dy = my - this.y;
    return Math.sqrt(dx * dx + dy * dy) < this.size;
  }
}









// --- Soporte para celular (touch) ---
canvas.addEventListener("touchstart", (e) => {
  e.preventDefault(); // evita que se desplace la página
  dragging = true;
  const touch = e.touches[0];
  lastX = touch.clientX;
  lastY = touch.clientY;
  createExplosion(touch.clientX, touch.clientY);
}, { passive: false });

canvas.addEventListener("touchend", (e) => {
  e.preventDefault();
  dragging = false;
}, { passive: false });

canvas.addEventListener("touchmove", (e) => {
  e.preventDefault(); // evita scroll mientras arrastras
  if (dragging) {
    const touch = e.touches[0];
    createTrail(touch.clientX, touch.clientY);
  }
}, { passive: false });



// --- Soporte táctil para móviles ---
window.addEventListener("touchstart", (e) => {
  dragging = true;
  const touch = e.touches[0];
  lastX = touch.clientX;
  lastY = touch.clientY;
});

window.addEventListener("touchend", () => {
  dragging = false;
});

window.addEventListener("touchmove", (e) => {
  if (dragging) {
    const touch = e.touches[0];
    for (let i = 0; i < 2; i++) {
      createTrail(touch.clientX, touch.clientY);
    }
    lastX = touch.clientX;
    lastY = touch.clientY;
  }
});
















