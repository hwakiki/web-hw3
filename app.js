function search(list, keyword) {
  const searchTerm = keyword.trim().toLowerCase();
  let searchResult = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].title.toLowerCase().includes(searchTerm)) {
      searchResult.push(list[i]);
    }
  }
  return searchResult;
}

function sortBy(list, key, desc = false) {
  const sign = desc ? -1 : 1;
  return [...list].sort((a, b) => {
    let result = 0;
    if (typeof a[key] === "string") {
      result = a[key].localeCompare(b[key]);
    } else {
      result = a[key] - b[key];
    }
    return result * sign;
  });
}

function posterUrl(path, size) {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

function renderCards(list) {
  const board = document.getElementById("board");
  board.innerHTML = "";
  for (const m of list) {
    const card = document.createElement("article");
    card.className = "card";
    if (m.rating >= 8) {
      card.classList.add("hot");
    }
    card.innerHTML = `
      <img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">
      <span class="badge">${m.rating}</span>
      <div class="info">
        <h2>${m.title}</h2>
        <p class="year">${m.year}</p>
        <p class="overview">${m.overview ?? ""}</p>
        <button class="like" type="button" data-title="${m.title}">♥</button>
      </div>
    `;
    board.appendChild(card);
  }
  const countEl = document.getElementById("count");
  if (countEl) {
    countEl.textContent = list.length + "편";
  }
  if (list.length === 0) {
    board.classList.add("is-empty");
  } else {
    board.classList.remove("is-empty");
  }
}