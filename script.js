const cursorGlow = document.querySelector(".cursor-glow");
const cursorDot = document.querySelector(".cursor-dot");
const magneticItems = document.querySelectorAll(".magnetic, a, button");
const reveals = document.querySelectorAll(".reveal");
const demoForm = document.querySelector(".demo-form");

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let glowX = mouseX;
let glowY = mouseY;
let dotX = mouseX;
let dotY = mouseY;

const moveCursor = () => {
  glowX += (mouseX - glowX) * 0.08;
  glowY += (mouseY - glowY) * 0.08;
  dotX += (mouseX - dotX) * 0.26;
  dotY += (mouseY - dotY) * 0.26;

  cursorGlow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0)`;
  cursorDot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
  requestAnimationFrame(moveCursor);
};

window.addEventListener("pointermove", (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
  document.body.classList.add("cursor-ready");
});

magneticItems.forEach((item) => {
  item.addEventListener("pointerenter", () => document.body.classList.add("cursor-hover"));
  item.addEventListener("pointerleave", () => {
    document.body.classList.remove("cursor-hover");
    item.style.transform = "";
  });

  item.addEventListener("pointermove", (event) => {
    const bounds = item.getBoundingClientRect();
    const x = event.clientX - bounds.left - bounds.width / 2;
    const y = event.clientY - bounds.top - bounds.height / 2;

    if (item.classList.contains("magnetic")) {
      item.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
    }
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.18 }
);

reveals.forEach((element) => revealObserver.observe(element));

document.addEventListener("scroll", () => {
  const progress = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(3));
});

demoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = demoForm.querySelector("button");
  const original = button.textContent;

  button.textContent = "Walkthrough requested";
  button.style.boxShadow = "0 0 70px rgba(126, 244, 200, 0.48)";

  setTimeout(() => {
    button.textContent = original;
    button.style.boxShadow = "";
    demoForm.reset();
  }, 2600);
});

moveCursor();
