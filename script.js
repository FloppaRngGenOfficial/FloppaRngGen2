const BOT_USER_ID = "1400199041891172423"; // Put YOUR Discord ID here (Not the bot ID!)
const COOLDOWN_TIME = 2000;

const dictionaryFloppas = [
  { word: "Luminous", desc: "Emitting or reflecting light; glowing brightly." },
  { word: "Ephemeral", desc: "Lasting for a very short time; fleeting." },
  { word: "Sovereign", desc: "Possessing supreme or ultimate authority." },
  { word: "Whimsical", desc: "Playfully quaint or fanciful, especially in an appealing way." },
  { word: "Oblivion", desc: "The state of being forgotten or completely destroyed." },
  { word: "Celestial", desc: "Pertaining to the spiritual or outer space realms." },
  { word: "Sinister", desc: "Giving the impression that something harmful or evil is happening." },
  { word: "Ethereal", desc: "Extremely delicate and light in a way that seems too perfect for this world." },
  { word: "Prismatic", desc: "Showing brilliant, shimmering colors like a prism." },
  { word: "Abyssal", desc: "Relating to the unfathomable depths of the ocean or underworld." },
  { word: "Voracious", desc: "Wanting or devouring great quantities of food or knowledge." },
  { word: "Radiant", desc: "Sending out light or glowing with joy and health." },
  { word: "Enigmatic", desc: "Mysterious, puzzling, and difficult to interpret." },
  { word: "Galactic", desc: "Relating to a galaxy or unimaginably vast dimensions." }
];

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

// Unblock audio on absolute first mouse/keyboard action
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

document.getElementById('roll-btn').addEventListener('click', () => {
  if (isCooldown) return;

  isCooldown = true;
  const rollBtn = document.getElementById('roll-btn');
  const overlay = document.getElementById('cooldown-overlay');

  // 1. Card Cutscene Fade
  cutsceneOverlay.classList.add('active');

  setTimeout(() => {
    // 2. Generate Roll
    const randomEntry = dictionaryFloppas[Math.floor(Math.random() * dictionaryFloppas.length)];
    const generatedName = `${randomEntry.word} Floppa`;
    const baseAttr = rarities[Math.floor(Math.random() * rarities.length)];

    currentRoll = {
      name: generatedName,
      title: baseAttr.title,
      rarity: baseAttr.rarity,
      desc: randomEntry.desc
    };

    document.getElementById('floppa-title').innerText = currentRoll.title;
    document.getElementById('floppa-name').innerText = currentRoll.name;
    document.getElementById('floppa-rarity').innerText = `Rarity: ${currentRoll.rarity}`;
    document.getElementById('floppa-desc').innerText = `Meaning: "${currentRoll.desc}"`;
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

  const textToShare = `I rolled ${currentRoll.name}! [Title: ${currentRoll.title} | Rarity: ${currentRoll.rarity}]\nMeaning: ${currentRoll.desc}`;
  
  navigator.clipboard.writeText(textToShare);
  alert("Floppa roll copied! Paste (Cmd+V) this in your message to Floppa Lord.");

  window.open(`https://discord.com/users/${BOT_USER_ID}`, '_blank');
});