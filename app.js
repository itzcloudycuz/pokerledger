let players = {};
let history = JSON.parse(localStorage.getItem("history")) || [];

const gameRef = doc(db, "games", "poker-session");

// 🌙 Dark Mode
const toggle = document.getElementById("themeToggle");

toggle.onclick = () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// 📡 REAL-TIME SYNC
onSnapshot(gameRef, (docSnap) => {
  if (docSnap.exists()) {
    players = docSnap.data().players || {};
    render();
  }
});

// 💾 SAVE
async function saveToFirebase() {
  await setDoc(gameRef, { players });
}

// ➕ Add Player
function addPlayer() {
  const name = document.getElementById("playerName").value;

  if (!name || players[name]) return;

  players[name] = {
    balance: 0,
    wins: 0,
    games: 0
  };

  saveToFirebase();
}

// 💰 Add Transaction
function addTransaction() {
  const name = document.getElementById("name").value;
  const amount = parseInt(document.getElementById("amount").value);
  const type = document.getElementById("type").value;

  if (!players[name] || isNaN(amount)) return;

  players[name].games += 1;

  if (type === "win") {
    players[name].balance += amount;
    players[name].wins += 1;
  } else {
    players[name].balance -= amount;
  }

  saveToFirebase();
}

// 📊 Render
function render() {
  let html = "";

  for (let p in players) {
    const player = players[p];
    const winRate = player.games
      ? ((player.wins / player.games) * 100).toFixed(1)
      : 0;

    html += `
      <div>
        <strong>${p}</strong><br>
        Balance: ₹${player.balance}<br>
        Win Rate: ${winRate}%<br>
        Games: ${player.games}
      </div>
    `;
  }

  document.getElementById("balances").innerHTML = html;

  renderHistory();
}

// 📅 History
function saveGame() {
  history.push({
    date: new Date().toLocaleString(),
    players: JSON.parse(JSON.stringify(players))
  });

  localStorage.setItem("history", JSON.stringify(history));
  renderHistory();
}

function renderHistory() {
  let html = "";

  history.slice().reverse().forEach(game => {
    html += `<div>📅 ${game.date}</div>`;
  });

  document.getElementById("history").innerHTML = html;
}

// 🧮 Settlement
function calculateSettlement() {
  let creditors = [];
  let debtors = [];

  for (let name in players) {
    const balance = players[name].balance;

    if (balance > 0) creditors.push({ name, amount: balance });
    else if (balance < 0) debtors.push({ name, amount: -balance });
  }

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  let i = 0, j = 0;
  let settlements = [];

  while (i < creditors.length && j < debtors.length) {
    let credit = creditors[i];
    let debt = debtors[j];

    let amount = Math.min(credit.amount, debt.amount);

    settlements.push(`${debt.name} pays ${credit.name} ₹${amount}`);

    credit.amount -= amount;
    debt.amount -= amount;

    if (credit.amount === 0) i++;
    if (debt.amount === 0) j++;
  }

  renderSettlement(settlements);
}

function renderSettlement(settlements) {
  if (settlements.length === 0) {
    document.getElementById("settlement").innerHTML =
      "✅ All settled!";
    return;
  }

  let html = "";

  settlements.forEach(s => {
    html += `<div>💸 ${s}</div>`;
  });

  document.getElementById("settlement").innerHTML = html;
}

// Initial render
render();
