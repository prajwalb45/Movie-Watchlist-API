const main = document.querySelector("main")
let watchlist = JSON.parse(localStorage.getItem("watchlist"))


renderWatchlist(watchlist, main)

function renderWatchlist(contentInfo, tagToRender) { 
    watchlist = JSON.parse(localStorage.getItem("watchlist"))
    if (!watchlist.length) {
       return main.innerHTML = `
        <div class="start-app">
            <a href="./index.html">
                <h1><i class="fa-solid fa-circle-plus"></i> </h1>
                <h4>Add Items to your Watchlist</h4>
            </a>
        </div>`
    } 
    tagToRender.innerHTML = contentInfo.map(content => {
        const {Title, Poster, imdbRating, Runtime, Genre, imdbID, Plot} = content
        return `
            <div class="content inner-container">
                <img src="${Poster}">
                <div class="content-text">
                    <div class="content-title">
                        <h3>${Title}</h3>
                        <p class="star-icon"><i class="fa-solid fa-star"></i><p>
                        <p>${imdbRating}</p>
                    </div>
                    <div class="content-info">
                        <p>${Runtime}</p>
                        <p>${Genre}</p>
                        <button  class="remove-btn" id="remove-${imdbID}" data-imdb-ID="${imdbID}" data-rm="rm"><i class="fa-solid fa-circle-minus"></i> Remove</button>
                    </div>
                    <div class="content-plot">
                        <p>${Plot}</p>
                    </div>
                </div>
            </div>`
    }).join("")
}


// Remove from watchlist button logic
document.addEventListener("click", (e) => {
    if (e.target.dataset.imdbId) {
        const ID = e.target.dataset.imdbId
        removeFromWatchlist(ID)
    }
  });


function removeFromWatchlist(ID) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist"))
    watchlist.map((title, index) => {
        if (title.imdbID === ID) {
            watchlist.splice(index, 1)
        }
    })
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
    renderWatchlist(watchlist, main)
}