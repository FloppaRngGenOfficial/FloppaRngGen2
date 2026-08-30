const BOT_USER_ID = "1400199041891172423";
const COOLDOWN_TIME = 2000;

const rarities = [
  { title: "The Commoner", rarity: "Common (60%)" },
  { title: "The Anomaly", rarity: "Rare (25%)" },
  { title: "The Mythic", rarity: "Legendary (5%)" },
  { title: "The Celestial", rarity: "Exotic (0.1%)" },
  { title: "The Chosen", rarity: "Exotic (0.01%)" }
];

let currentRoll = null;
let isCooldown = false;

const bgMusic = document.getElementById('bg-music');
const cutsceneOverlay = document.getElementById('cutscene-overlay');

// Unblock audio on first interaction
const startAudio = () => {
  if (bgMusic && bgMusic.paused) {
    bgMusic.volume = 0.4;
    bgMusic.play().catch(() => {});
  }
  document.removeEventListener('click', startAudio);
  document.removeEventListener('keydown', startAudio);
  document.removeEventListener('mousemove', startAudio);
};

document.addEventListener('click', startAudio);
document.addEventListener('keydown', startAudio);
document.addEventListener('mousemove', startAudio);

document.getElementById('roll-btn').addEventListener('click', async () => {
  if (isCooldown) return;

  isCooldown = true;
  const rollBtn = document.getElementById('roll-btn');
  const overlay = document.getElementById('cooldown-overlay');

  // 1. Card Cutscene Fade
  cutsceneOverlay.classList.add('active');

  // 2. Fetch dictionary word from API
  let generatedName = "Mysterious Floppa";
  try {
    const response = await fetch("https://random-word-form.herokuapp.com/random/adjective");
    const data = await response.json();
    const rawWord = data[0];
    const formattedWord = rawWord.charAt(0).toUpperCase() + rawWord.slice(1);
    generatedName = `${formattedWord} Floppa`;
  } catch (error) {
    console.error("API error, fallback used:", error);
  }

  setTimeout(() => {
    const baseAttr = rarities[Math.floor(Math.random() * rarities.length)];

    currentRoll = {
      name: generatedName,
      title: baseAttr.title,
      rarity: baseAttr.rarity,
    };

    document.getElementById('floppa-title').innerText = currentRoll.title;
    document.getElementById('floppa-name').innerText = currentRoll.name;
    document.getElementById('floppa-rarity').innerText = `Rarity: ${currentRoll.rarity}`;
    document.getElementById('result').classList.remove('hidden');

    cutsceneOverlay.classList.remove('active');
  }, 400);

  // 3. Cooldown Wipe
  rollBtn.disabled = true;
  overlay.style.transition = 'none';
  overlay.style.transform = 'translateY(0%)';
  overlay.offsetHeight; 

  overlay.style.transition = `transform ${COOLDOWN_TIME}ms linear`;
  overlay.style.transform = 'translateY(100%)';

  setTimeout(() => {
    isCooldown = false;
    rollBtn.disabled = false;
  }, COOLDOWN_TIME);
});

document.getElementById('send-btn').addEventListener('click', () => {
  if (!currentRoll) return;

  const textToShare = `I rolled ${currentRoll.name}! [Title: ${currentRoll.title} | Rarity: ${currentRoll.rarity}]`;
  
  navigator.clipboard.writeText(textToShare);
  alert("Floppa roll copied! Paste (Cmd+V) this in your message to Floppa Lord.");

  window.open(`https://discord.com/users/${BOT_USER_ID}`, '_blank');
});