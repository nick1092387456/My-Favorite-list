const BASE_URL = "https://movie-list.alphacamp.io/"
const INDEX_URL = BASE_URL + "api/v1/movies/"
const POSTER_URL = BASE_URL + "posters/"
const PAGE_MOVIE_QUANTITY = 12

const movies = JSON.parse(localStorage.getItem("favoriteMovies")) || []
let filteredMovies = []
const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")

//搜尋功能
searchForm.addEventListener("submit", function searchMovie(event) {
  event.preventDefault()

  const keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字:${keyword} 沒有符合的搜尋結果 `)
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMovieToPage(1))
})

//輸出所有電影
function renderMovieList(data) {
  let movieContent = ""
  //processing
  data.forEach((items) => {
    movieContent += `
  <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + items.image}"
              class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${items.title}</h5>
            </div>
            <div class="card-footer">
              <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${
                items.id
              }">More
              </button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${
                items.id
              }">x
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `
  })
  dataPanel.innerHTML = movieContent
}
//分頁功能
function getMovieToPage(page) {
  //page1 0~11
  //page2 12~23
  //page3 24~35
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * PAGE_MOVIE_QUANTITY
  const endIndex = startIndex + PAGE_MOVIE_QUANTITY
  return data.slice(startIndex, endIndex)
}

//產生下欄分頁函式
function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / PAGE_MOVIE_QUANTITY)
  let rawHTML = ""
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `
    <li class="page-item"><a class="page-link" data-page="${page}" href="#">${page}</a></li>
    `
  }
  paginator.innerHTML = rawHTML
}

//modal點擊後處理事件
dataPanel.addEventListener("click", function panelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    console.log(Number(event.target.dataset.id))
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFavorite(Number(event.target.dataset.id))
  }
})

//分頁按鈕點擊後的功能
paginator.addEventListener("click", function renderNewPage(event) {
  if (event.target.tagName !== "A") return
  const page = Number(event.target.dataset.page)
  renderMovieList(getMovieToPage(page))
})

//刪除最愛
function removeFavorite(id) {
  if (!movies) {
    return movies
  }
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  if (movieIndex === -1) return
  movies.splice(movieIndex, 1)
  localStorage.setItem("favoriteMovies", JSON.stringify(movies))
  renderMovieList(movies)
}

//顯示modal內容
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title")
  const modalImage = document.querySelector("#movie-modal-image")
  const modalDate = document.querySelector("#movie-modal-date")
  const modalDescription = document.querySelector("#movie-modal-description")

  const datas = movies.find((movie) => movie.id === id)
  modalTitle.innerText = datas.title
  modalImage.innerHTML = `
    <img src="${
      POSTER_URL + datas.image
    }" class="card-img-top" alt="Movie Poster">
    `
  modalDate.innerText = "Release Date : " + datas.release_date
  modalDescription.innerText = datas.description
}

renderMovieList(getMovieToPage(1))
renderPaginator(movies.length)
