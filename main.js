const BASE_URL = "https://movie-list.alphacamp.io/"
const INDEX_URL = BASE_URL + "api/v1/movies/"
const POSTER_URL = BASE_URL + "posters/"
const PAGE_MOVIE_QUANTITY = 12

const movies = [] //總清單
let filteredMovies = [] //搜尋清單
let mode = "card"
let currentPage = 1

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const changeMode = document.querySelector("#change-mode")
const paginator = document.querySelector("#paginator")

//資料抓取
//將電影api抓入movies裡面
axios
  .get(INDEX_URL)
  .then(function (response) {
    movies.push(...response.data.results)
    renderCardMode(getMovieToPage(1))
    renderPaginator(movies.length)
  })
  .catch(function (error) {
    console.log(error)
  })

//監聽
//監聽搜尋按鈕
searchForm.addEventListener("submit", function searchMovie(event) {
  event.preventDefault()
  console.log(movies)
  const keyword = searchInput.value.trim().toLowerCase()
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  console.log(filteredMovies)

  if (filteredMovies.length === 0) {
    return alert(`您輸入的關鍵字:${keyword} 沒有符合的搜尋結果 `)
  }
  renderPaginator(filteredMovies.length)
  renderCardMode(getMovieToPage(1))
})

//監聽more及favorite按鈕動作
dataPanel.addEventListener("click", function panelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    console.log(Number(event.target.dataset.id))
    showMovieModal(Number(event.target.dataset.id))
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

//監聽切換模式
changeMode.addEventListener("click", function onChangeModePanelClicked(event) {
  if (event.target.matches("#cardMode")) {
    mode = "card"
  } else if (event.target.matches("#listMode")) {
    mode = "list"
  }
  displayStyle()
})

//監聽分頁按鈕
paginator.addEventListener("click", function renderNewPage(event) {
  if (event.target.tagName !== "A") return
  currentPage = Number(event.target.dataset.page)
  renderCardMode(getMovieToPage(currentPage))
})

//function
//清單呈現方式選擇
function displayStyle() {
  if (mode === "card") {
    renderCardMode(getMovieToPage(currentPage))
  } else if (mode === "list") {
    renderListMode(getMovieToPage(currentPage))
  }
}

//More內容渲染
function showMovieModal(id) {
  const modalTitle = document.querySelector("#movie-modal-title")
  const modalImage = document.querySelector("#movie-modal-image")
  const modalDate = document.querySelector("#movie-modal-date")
  const modalDescription = document.querySelector("#movie-modal-description")

  axios
    .get(INDEX_URL + id)
    .then(function (response) {
      // console.log(response)
      let data = response.data.results
      modalTitle.innerText = data.title
      modalImage.innerHTML = `
    <img src="${
      POSTER_URL + data.image
    }" class="card-img-top" alt="Movie Poster">
    `
      modalDate.innerText = "Release Date : " + data.release_date
      modalDescription.innerText = data.description
    })
    .catch(function (error) {
      console.log(error)
    })
}

//加入最愛
function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []
  const movie = movies.find(isMovieMatched)

  if (list.some((movie) => movie.id === id)) {
    return alert("電影已在收藏清單中")
  }

  function isMovieMatched(movie) {
    return movie.id === id
  }

  list.push(movie)
  localStorage.setItem("favoriteMovies", JSON.stringify(list))
}

//分頁產生器
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

//功能分頁內容數量規劃
function getMovieToPage(page) {
  //輸入page參數來決定要顯示第幾頁
  const data = filteredMovies.length ? filteredMovies : movies //三元運算子(一種條件式判斷)
  const startIndex = (page - 1) * PAGE_MOVIE_QUANTITY
  const endIndex = startIndex + PAGE_MOVIE_QUANTITY
  return data.slice(startIndex, endIndex)
}

//Render電影清單函式 (cardMode)
function renderCardMode(data) {
  let movieContent = ""
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
                      <button class="btn btn-info btn-add-favorite" data-id="${
                        items.id
                      }">+
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

//Render電影清單函式 (listMode)
function renderListMode(data) {
  let movieContent = ""
  movieContent += `
  <table class="table table-sm">
  <thead>
    <tr>
    <th scope="col">#</th>
    <th scope="col">電影名稱</th>
    <th scope="col">動作</th>
    </tr>
    </thead>
    <tbody>
    `
  data.forEach((items, index) => {
    let currentIndex = Number(index) + 1
    movieContent += `
    <tr>
      <th scope="row">${currentIndex}</th>
      <td>${items.title}</td>
      <td>
      <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${items.id}">More</button>
      <button class="btn btn-info btn-add-favorite" data-id="${items.id}">+</button>
      </td>
    </tr>
      `
  })
  movieContent += `
    </tbody>
    </table>
  `
  dataPanel.innerHTML = movieContent
}
