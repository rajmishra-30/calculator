const orbitContainer = document.getElementById("orbitContainer");
const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

const buttons = [
  "C","⌫","(",")",
  "7","8","9","/",
  "4","5","6","*",
  "1","2","3","-",
  "0",".","=","+"
];

let expression = "";

const radius = 180;
const centerX = 250;
const centerY = 250;

/* =========================
   CREATE BUTTONS
========================= */

buttons.forEach((text, index) => {

  const angle = (Math.PI * 2 / buttons.length) * index;

  const btn = document.createElement("button");

  btn.className = "btn";
  btn.innerText = text;

  const x = centerX + radius * Math.cos(angle) - 32;
  const y = centerY + radius * Math.sin(angle) - 32;

  btn.style.left = `${x}px`;
  btn.style.top = `${y}px`;

  /* Floating animation offset */
  btn.animate(
    [
      { transform: "translateY(0px)" },
      { transform: "translateY(-10px)" },
      { transform: "translateY(0px)" }
    ],
    {
      duration: 2000 + Math.random() * 2000,
      iterations: Infinity
    }
  );

  btn.onclick = (e) => {

    createParticles(e.clientX, e.clientY);

    /* CLEAR */
    if(text === "C") {

      expression = "";

      expressionEl.innerText = "";
      resultEl.innerText = "0";

      return;
    }

    /* BACKSPACE */
    if(text === "⌫") {

      expression = expression.slice(0, -1);

      expressionEl.innerText = expression;

      return;
    }

    /* CALCULATE */
    if(text === "=") {

      try {

        expression = eval(expression).toString();

        resultEl.innerText = expression;

        expressionEl.innerText = "";

        pulseResult();

      } catch {

        resultEl.innerText = "Error";

        shakeCalculator();
      }

      return;
    }

    /* PREVENT DOUBLE OPERATORS */
    const operators = ["+","-","*","/"];

    const lastChar = expression.slice(-1);

    if(
      operators.includes(lastChar) &&
      operators.includes(text)
    ) {
      return;
    }

    expression += text;

    expressionEl.innerText = expression;
  };

  orbitContainer.appendChild(btn);
});

/* =========================
   PARTICLE EFFECT
========================= */

function createParticles(x, y) {

  for(let i = 0; i < 20; i++) {

    const particle = document.createElement("div");

    particle.className = "particle";

    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    particle.style.setProperty(
      "--x",
      `${(Math.random() - 0.5) * 250}px`
    );

    particle.style.setProperty(
      "--y",
      `${(Math.random() - 0.5) * 250}px`
    );

    document.body.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 700);
  }
}

/* =========================
   RESULT PULSE
========================= */

function pulseResult() {

  resultEl.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.2)" },
      { transform: "scale(1)" }
    ],
    {
      duration: 400
    }
  );
}

/* =========================
   ERROR SHAKE
========================= */

function shakeCalculator() {

  document.querySelector(".calculator").animate(
    [
      { transform: "translateX(0px)" },
      { transform: "translateX(-10px)" },
      { transform: "translateX(10px)" },
      { transform: "translateX(0px)" }
    ],
    {
      duration: 300
    }
  );
}

/* =========================
   MOUSE 3D EFFECT
========================= */

document.addEventListener("mousemove", (e) => {

  const x = e.clientX / window.innerWidth;
  const y = e.clientY / window.innerHeight;

  document.querySelector(".calculator").style.transform =
    `
    rotateY(${(x - 0.5) * 25}deg)
    rotateX(${(0.5 - y) * 25}deg)
    `;
});

/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener("keydown", (e) => {

  const allowed = "0123456789/*-+().";

  if(allowed.includes(e.key)) {

    const operators = ["+","-","*","/"];

    const lastChar = expression.slice(-1);

    if(
      operators.includes(lastChar) &&
      operators.includes(e.key)
    ) {
      return;
    }

    expression += e.key;

    expressionEl.innerText = expression;
  }

  /* ENTER */
  if(e.key === "Enter") {

    try {

      expression = eval(expression).toString();

      resultEl.innerText = expression;

      expressionEl.innerText = "";

      pulseResult();

    } catch {

      resultEl.innerText = "Error";

      shakeCalculator();
    }
  }

  /* BACKSPACE */
  if(e.key === "Backspace") {

    expression = expression.slice(0, -1);

    expressionEl.innerText = expression;
  }

  /* ESC CLEAR */
  if(e.key === "Escape") {

    expression = "";

    expressionEl.innerText = "";

    resultEl.innerText = "0";
  }
});

/* =========================
   DYNAMIC ORBIT ROTATION
========================= */

let rotation = 0;

function animateOrbit() {

  rotation += 0.002;

  const btns = document.querySelectorAll(".btn");

  btns.forEach((btn, index) => {

    const angle =
      (Math.PI * 2 / buttons.length) * index + rotation;

    const x =
      centerX + radius * Math.cos(angle) - 32;

    const y =
      centerY + radius * Math.sin(angle) - 32;

    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
  });

  requestAnimationFrame(animateOrbit);
}

animateOrbit();