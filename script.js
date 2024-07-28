const API_KEY = "64b1eb7b67f34d358623edf6db4e84b5";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("Cricket"));

//When we click on logo.
function reload() {
  window.location.reload();
}

async function fetchNews(query) {
  const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
  const data = await res.json();

  bindData(data.articles);
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  //For new set of cards, replacing old cards.
  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.urlToImage) return;

    // For every dynamic creation of every div in template tag.
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

const searchText = document.getElementById("search-text");

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;

  // Highlight the search text in the news description
  const highlightedDescription = highlightSearchText(
    article.description,
    searchText.value
  );
  newsDesc.innerHTML = highlightedDescription;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} . ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    // _blank means opening new tab.
    window.open(article.url, "_blank");
  });
}

function highlightSearchText(description, searchText) {
  if (!searchText) return description;

  // Case-insensitive search and global match to find all occurrences of the search text
  const regex = new RegExp(searchText, "ig");

  // Replace occurrences of the search text with the same text wrapped in a <span> tag for highlighting
  const highlightedDescription = description.replace(
    regex,
    (match) => `<span class="highlight">${match}</span>`
  );

  return highlightedDescription;
}

let curSelectedNav = null;
function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
