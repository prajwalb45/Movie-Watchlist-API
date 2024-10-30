let pageContent
let watchlist = JSON.parse(localStorage.getItem("watchlist")) || localStorage.setItem("watchlist", JSON.stringify([]))
const main = document.querySelector("main")


// Search form
document.querySelector("form").addEventListener("submit", e => {
    e.preventDefault()
    let title = document.getElementById("search-bar").value
    title = title.replace(/\s+/g, '+').replace(/&/g, "%26")
    getImdbId(title)
})

// Get imdb ID's
async function getImdbId(title) {
    const response = await fetch(`https://www.omdbapi.com/?apikey=575185a6&s=${title}`)
    const data = await response.json()
    const mediaImdbID = data.Search.map(result => result.imdbID)
    getContentInfo(mediaImdbID)
}

// Get the info of the ID's
async function getContentInfo(IDs) {
    const contentInfo = await Promise.all(
        IDs.map(async id => {
            const response = await fetch(`https://www.omdbapi.com/?apikey=575185a6&i=${id}`)
            const data = await response.json()
            return data
        })
    )
    // Save contentInfo so we can use it in remove and add to watchlist
    pageContent = contentInfo
    renderSearchResults(contentInfo, main)
}

function renderSearchResults(contentInfo, tagToRender) {  
    const watchlist = JSON.parse(localStorage.getItem("watchlist"))
    tagToRender.innerHTML = contentInfo.map(content => {
        const {Title, Poster, imdbRating, Runtime, Genre, imdbID, Plot} = content
        // Check if title is already on watchlist and decide wich button to render
        const button = watchlist.find(title => title.imdbID === imdbID) ? ` <button  class="remove-btn" id="remove-${imdbID}" data-imdb-ID="${imdbID}" data-rm="rm"><i class="fa-solid fa-circle-minus"></i> Remove</button>` 
            : `<button id="add-${imdbID}" data-imdb-ID="${imdbID}" data-add="add"><i class="fa-solid fa-circle-plus"></i> Watchlist</button>`
        
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
                        ${button}
                    </div>
                    <div class="content-plot">
                        <p>${Plot}</p>
                    </div>
                </div>
            </div>`
    }).join("")
}



function addToWatchlist(ID) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist"))
    pageContent.map(title => {
        if (title.imdbID === ID) {
            watchlist.push(title)
        }
    })
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
    renderSearchResults(pageContent, main)
}

function removeFromWatchlist(ID) {
    const watchlist = JSON.parse(localStorage.getItem("watchlist"))
    watchlist.map((title, index) => {
        if (title.imdbID === ID) {
            watchlist.splice(index, 1)
        }
    })
    localStorage.setItem("watchlist", JSON.stringify(watchlist))
    renderSearchResults(pageContent, main)
}


// Remove and Add to watchlist button logic
document.addEventListener("click", (e) => {
    if (e.target.dataset.imdbId) {
        const ID = e.target.dataset.imdbId
        if (e.target.dataset.add) {
            return addToWatchlist(ID)  
        } 
        removeFromWatchlist(ID)
    }
  });




// Start exploring "click" to focus on searchbar
document.getElementById("start-app").addEventListener("click",() => {
    document.getElementById("search-bar").focus()
})