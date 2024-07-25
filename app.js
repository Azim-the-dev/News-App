const APIKEY = "48ff62f47cd64a03b630f3f65877ed41";
const URL = "https://newsapi.org/v2/everything?q=";

function randomNews() {
    const arr = ["Coding", "Web Development", "JavaScript", "React", "AI", "Gaming"];
    let count = Math.floor(Math.random() * arr.length);
    return arr[count];
}

window.addEventListener("load", () => {
    try {
        fetchNews(randomNews());
    } catch {
        errorScreen("UNKNOWN_ERROR");
    }
});

async function fetchNews(query) {
    try {
        let response = await fetch(URL + query + "&apiKey=" + APIKEY);
        let data = await response.json();
        bindData(data.status, data.articles);
    } catch (error) {
        if (!errorPage) errorScreen("NETWORK_IS_NOT_AVAILABLE");
    }
}

function bindData(status, articles) {
    if (status == "ok") {
        const cardsContainer = document.getElementById("cards-container");
        const cardTemplate = document.getElementById("card-template");

        cardsContainer.innerHTML = "";

        articles.forEach((article) => {
            if (!article.urlToImage) return;
            const cardClone = cardTemplate.content.cloneNode(true);
            fillData(cardClone, article);
            cardsContainer.appendChild(cardClone);
        });
    } else {
        if (!errorPage) errorScreen("UNABLE_TO_FETCH_API");
    }
}

function fillData(cardClone, article) {
    const img = cardClone.getElementById("news-img");
    const titel = cardClone.getElementById("news-titel");
    const description = cardClone.getElementById("news-description");
    const sourse = cardClone.getElementById("news-sourse");

    img.setAttribute("src", article.urlToImage);
    titel.textContent = article.title;
    description.textContent = article.description;

    const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    sourse.textContent = article.source.name + " - " + date;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let errorPage = false;
function errorScreen(code) {
    errorPage = true;
    const errorTemplate = document.getElementById("error-screen");
    const errorScreen = errorTemplate.content.cloneNode(true);
    document.body.appendChild(errorScreen);

    const retry = document.getElementById("retry-btn");
    retry.addEventListener("click", () => {
        location.reload();
    });

    const msg = document.getElementById("err-code");
    msg.innerHTML = "Error Code: " + code;
}

function searchQuery() {
    const query = document.getElementById("search-query");
    try {
        fetchNews(query.value);
    } catch {
        errorScreen("UNKNOWN_ERROR");
    }
}