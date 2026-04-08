const API = "https://funsies.nonadamanik.workers.dev";
const USERNAME = "nonatized";

const profile = document.getElementById("profile");
const filmsEl = document.getElementById("films");
const statusEl = document.getElementById("status");

// run immediately
loadUser();

async function loadUser() {
  setStatus("Loading...");

  try {
    const res = await fetch(`${API}/?user=${USERNAME}`);
    const data = await res.json();

    console.log(data);

    if (data.error) {
      setStatus("Profile not found");
      return;
    }

    renderProfile(data);
    renderFilms(data.films);
    setStatus("");

  } catch (err) {
    console.error(err);
    setStatus("Failed to load");
  }
}

// --- render ---

function renderProfile(data) {
  profile.innerHTML = `
<span>
  <a href="https://letterboxd.com/${data.username}/" target="_blank" class="profile-link">
    <strong>${data.username}</strong>
  </a>
</span>
        <span>${data.avatar ? `<img src="${data.avatar}">` : ""}
      </span>
    </a>
  `;
}

function renderFilms(films) {
  filmsEl.innerHTML = films.map(f => `
    <div class="card">
      <a href="${f.link}" target="_blank">
        <img src="${f.image}">
        <div class="title">${f.title}</div>
      </a>
    </div>
  `).join("");
}

// --- status ---

function setStatus(msg) {
  statusEl.textContent = msg;
}
