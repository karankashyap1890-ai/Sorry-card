const openNoteButton = document.querySelector("#openNote");
const noteContent = document.querySelector("#noteContent");
const openLabel = document.querySelector("#openLabel");
const responseMessage = document.querySelector("#responseMessage");
const confettiLayer = document.querySelector("#confettiLayer");
const questionScreen = document.querySelector("#questionScreen");
const mainCardScreen = document.querySelector("#mainCardScreen");
const noButton = document.querySelector("#noButton");
const answerArea = document.querySelector("#answerArea");
const cryCaption = document.querySelector("#cryCaption");

document.querySelector("#yesButton").addEventListener("click", () => {
  questionScreen.hidden = true;
  mainCardScreen.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

noButton.addEventListener("pointerenter", evadeNoButton);
noButton.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") {
    event.preventDefault();
    evadeNoButton(event);
  }
});
noButton.addEventListener("click", (event) => {
  if (event.detail === 0) {
    event.preventDefault();
    evadeNoButton(event);
  }
});

let lastEvadeAt = 0;
function evadeNoButton(event) {
  const now = Date.now();
  if (now - lastEvadeAt < 250) return;
  lastEvadeAt = now;

  questionScreen.classList.add("is-crying");
  cryCaption.textContent = "Oh no, the little bear is crying! 🥺";

  const area = answerArea.getBoundingClientRect();
  const button = noButton.getBoundingClientRect();
  const yes = document.querySelector("#yesButton").getBoundingClientRect();
  const maxLeft = Math.max(0, area.width - button.width);
  const maxTop = Math.max(0, area.height - button.height);
  const previousLeft = noButton.style.left ? Number.parseFloat(noButton.style.left) : area.width * (window.matchMedia("(max-width: 560px)").matches ? 0.56 : 0.54);
  const previousTop = noButton.style.top ? Number.parseFloat(noButton.style.top) : 4;
  const pointerX = Number.isFinite(event.clientX) ? event.clientX - area.left : -1000;
  const pointerY = Number.isFinite(event.clientY) ? event.clientY - area.top : -1000;
  let nextLeft = maxLeft;
  let nextTop = maxTop;

  for (let attempt = 0; attempt < 30; attempt += 1) {
    const candidateLeft = Math.random() * maxLeft;
    const candidateTop = Math.random() * maxTop;
    const overlapsYes = candidateLeft < yes.right - area.left && candidateLeft + button.width > yes.left - area.left && candidateTop < yes.bottom - area.top && candidateTop + button.height > yes.top - area.top;
    const tooCloseToPointer = Math.abs(candidateLeft + button.width / 2 - pointerX) < 65 && Math.abs(candidateTop + button.height / 2 - pointerY) < 45;
    const barelyMoved = Math.abs(candidateLeft - previousLeft) < 35 && Math.abs(candidateTop - previousTop) < 25;
    if (!overlapsYes && !tooCloseToPointer && !barelyMoved) {
      nextLeft = candidateLeft;
      nextTop = candidateTop;
      break;
    }
  }

  noButton.style.left = `${nextLeft}px`;
  noButton.style.top = `${nextTop}px`;
}

openNoteButton.addEventListener("click", () => {
  const isOpen = openNoteButton.getAttribute("aria-expanded") === "true";
  openNoteButton.setAttribute("aria-expanded", String(!isOpen));
  noteContent.hidden = isOpen;
  openLabel.textContent = isOpen ? "Open my little note" : "Close my little note";
  if (!isOpen) noteContent.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.querySelectorAll(".response-button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.response === "forgive") {
      responseMessage.textContent = "Sending you the gentlest, biggest hug. Thank you for hearing me 💗";
      showerHearts();
    } else {
      responseMessage.textContent = "Of course. Take all the time you need—I’ll be here when you’re ready 🌷";
    }
  });
});

function showerHearts() {
  const hearts = ["♥", "♡", "♥", "✿", "♡", "♥", "✧", "♡", "♥", "✿", "♡", "♥"];
  hearts.forEach((symbol, index) => {
    const heart = document.createElement("span");
    heart.className = "confetti-heart";
    heart.textContent = symbol;
    heart.style.left = `${6 + Math.random() * 88}%`;
    heart.style.fontSize = `${13 + Math.random() * 15}px`;
    heart.style.animationDelay = `${Math.random() * 0.7}s`;
    heart.style.setProperty("--drift", `${Math.round(Math.random() * 140 - 70)}px`);
    confettiLayer.append(heart);
    window.setTimeout(() => heart.remove(), 3400 + index * 70);
  });
}
