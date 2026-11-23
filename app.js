// 입력: 영화 배열(list), 검색어 문자열(keyword) ⇒ 출력: 제목에 검색어가 포함된 영화 배열
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

// 입력: 영화 배열(list), 정렬 기준 키(key), 내림차순 여부(desc) ⇒ 출력: 정렬된 새 영화 배열
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

// 입력: 포스터 경로(path), 이미지 크기(size) ⇒ 출력: TMDB 포스터 이미지 URL 문자열
function posterUrl(path, size) {
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

// 입력: 화면에 표시할 영화 배열(list) ⇒ 출력: 없음(DOM 카드 렌더링 및 카운트·빈 상태 갱신)
function renderCards(list) {
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (const m of list) {
    const card = document.createElement("article");
    card.className = "card";
    if (m.rating >= 8) {
      card.classList.add("hot");
    }

    card.setAttribute("data-type", m.type);
    card.setAttribute("data-title", m.title);

    let posterHtml = "";
    if (m.poster === null) {
      card.classList.add("no-poster");
      posterHtml = `<div class="poster-fallback">${m.title[0]}</div>`;
    } else {
      posterHtml = `<img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">`;
    }

    const rankHtml = m.type === "boxoffice" ? `<span class="rank">${m.rank}</span>` : "";
    const likeClass = liked.includes(m.title) ? "like liked" : "like";

    card.innerHTML = `
      ${posterHtml}
      ${rankHtml}
      <span class="badge">${m.rating}</span>
      <div class="info">
        <h3>${m.title}</h3>
        <p class="year">${m.year}</p>
        <p class="overview">${m.overview ?? ""}</p>
        <button class="${likeClass}" type="button" data-title="${m.title}">♥</button>
      </div>
    `;
    board.appendChild(card);
  }

  document.getElementById("likeCount").textContent = liked.length;

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

// 입력: 영화 제목 문자열(title) ⇒ 출력: 없음(상세 내용 채우고 dialog 모달 표시)
function openDetail(title) {
  const m = movies.find((item) => item.title === title);
  if (!m) return;

  const posterBlock = m.poster === null
    ? `<div class="poster-fallback">${m.title[0]}</div>`
    : `<img src="${posterUrl(m.poster, "w500")}" alt="${m.title} 포스터">`;

  document.getElementById("detailBody").innerHTML = `
    ${posterBlock}
    <h2>${m.title}</h2>
    <p class="date">${m.date ?? m.year ?? ""}</p>
    <p class="rating">${m.rating}</p>
    <p class="overview">${m.overview ?? ""}</p>
  `;

  document.querySelector("dialog").showModal();
}

// 입력: 없음(검색·필터·정렬 UI 값 읽음) ⇒ 출력: 검색·필터·정렬이 적용된 영화 배열
function getView() {
  const keyword = document.getElementById("q").value;
  const type = document.querySelector('input[name="type"]:checked').value;
  const sortKey = document.getElementById("sort").value;

  let result = search(movies, keyword);
  if (type !== "all") {
    result = result.filter((m) => m.type === type);
  }
  return sortBy(result, sortKey, sortKey !== "title");
}

// 입력: 없음 ⇒ 출력: 없음(현재 조건 기준으로 카드 목록 다시 렌더링)
function refresh() {
  renderCards(getView());
}

const STORAGE_KEY = "likedMovies";
let liked = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

// 입력: 없음(전역 liked 배열 참조) ⇒ 출력: 없음(localStorage에 찜 목록 저장)
function saveLiked() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(liked));
}

refresh();

document.getElementById("q").addEventListener("input", refresh);
document.getElementById("sort").addEventListener("change", refresh);
document.getElementById("typeFilter").addEventListener("change", refresh);

document.getElementById("board").addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const title = card.getAttribute("data-title");

  if (e.target.closest(".like")) {
    const i = liked.indexOf(title);
    if (i === -1) {
      liked.push(title);
    } else {
      liked.splice(i, 1);
    }
    saveLiked();
    refresh();
    return;
  }

  openDetail(title);
});

document.getElementById("closeDetail").addEventListener("click", () => {
  document.querySelector("dialog").close();
});