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

  cutsceneOverlay.classList.add('active');

  // Quick UI cleanup during screen flash
  setTimeout(() => {
    cutsceneOverlay.classList.remove('active');
  }, 1200);

  let word = "mysterious";
  let definition = "A enigmatic entity from the dictionary.";

  try {
    // 1. Fetch a batch of real dictionary adjectives directly from Datamuse
    const dictRes = await fetch("https://api.datamuse.com/words?rel_jjb=thing&md=d&max=100");
    const dictData = await dictRes.json();
    
    // Pick a completely random item from the dictionary response
    const randomItem = dictData[Math.floor(Math.random() * dictData.length)];
    word = randomItem.word;

    // Pull definition if Datamuse provided one, otherwise query dictionary API
    if (randomItem.defs && randomItem.defs.length > 0) {
      // Clean up the definition string (removes part of speech prefixes like "adj\t")
      definition = randomItem.defs[0].replace(/^[a-z]+\s+/, '');
    }
  } catch (err) {
    console.error("Dictionary fetch error:", err);
  }

  const formattedWord = word.charAt(0).toUpperCase() + word.slice(1);
  const baseAttr = rarities[Math.floor(Math.random() * rarities.length)];

  currentRoll = {
    name: `${formattedWord} Floppa`,
    title: baseAttr.title,
    rarity: baseAttr.rarity,
    desc: definition
  };

  // Render to UI
  document.getElementById('floppa-title').innerText = currentRoll.title;
  document.getElementById('floppa-name').innerText = currentRoll.name;
  document.getElementById('floppa-rarity').innerText = `Rarity: ${currentRoll.rarity}`;
  
  const descEl = document.getElementById('floppa-desc');
  if (descEl) descEl.innerText = `Meaning: "${currentRoll.desc}"`;

  document.getElementById('result').classList.remove('hidden');

  // Cooldown bar animation
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