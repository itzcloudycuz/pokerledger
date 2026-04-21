let players = {};
let history = JSON.parse(localStorage.getItem("history")) || [];

// 🌙 Dark Mode
const toggle = document.getElementById("themeToggle");

toggle.onclick = () => {
  document.body.classList.toggle("dark");

  localStorage.setItem(
    "theme",
    document.body.classList.contains("dark") ? "dark" : "light"
  );
};

// Load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
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

  render();
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

  render();
}

// 📊 Render UI
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

// 💾 Save Game Snapshot
function saveGame() {
  history.push({
    date: new Date().toLocaleString(),
    players: JSON.parse(JSON.stringify(players))
  });

  localStorage.setItem("history", JSON.stringify(history));

  alert("Game Saved!");
  renderHistory();
}

// 📅 Render History
function renderHistory() {
  let html = "";

  history.slice().reverse().forEach(game => {
    html += `<div>📅 ${game.date}</div>`;
  });

  document.getElementById("history").innerHTML = html;
}

// Initial render
render();
