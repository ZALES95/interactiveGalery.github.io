const searchBar = document.querySelector(".searchbar")
const photoCategory = document.querySelector("#photo-category")
const photoInfo = document.querySelector(".photo-info")
const photoBox = document.querySelector(".photo-box")
const carousel = document.querySelector(".carousel")
const carouselInner = document.querySelector(".carousel-inner")
const bodyShadow = document.querySelector(".body-shadow")

class PicturesMethods {
	constructor(baseUrl) {
		this.baseUrl = baseUrl
	}

	async getAll() {
		const response = await fetch(`${this.baseUrl}`, {
			method: "GET",
		})
		const data = await response.json()
		return data
	}
}

const pictures = new PicturesMethods("http://localhost:3000/images")

async function getPhotosFromClass() {
	let allPhotos = await pictures.getAll()
	return allPhotos
}

async function renderRandomPhotos() {
	let allPhotos = await getPhotosFromClass()
	const photosToRender = 6
	const arrayOfIndexes = []

	for (let i = 0; i < photosToRender; i++) {
		generatePhoto(allPhotos, arrayOfIndexes)
	}
}

const generatePhoto = (allPhotos, arrayOfIndexes) => {
	let index = Math.floor(Math.random() * allPhotos.length)

	if (arrayOfIndexes.includes(index)) {
		do {
			index = Math.floor(Math.random() * allPhotos.length)
		} while (arrayOfIndexes.includes(index))
	}

	createPhoto(index, allPhotos)

	arrayOfIndexes.push(index)
}

const createPhoto = (index, allPhotos) => {
	const newPhoto = document.createElement("div")
	newPhoto.classList.add("photo")
	newPhoto.innerHTML = `<img class="image" src="${allPhotos[index].url}" alt="${allPhotos[index].description}">`
	photoBox.appendChild(newPhoto)
}

async function renderCarosuel() {
	let allPhotos = await getPhotosFromClass()
	for (let i = 0; i < allPhotos.length; i++) {
		const newSlide = document.createElement("div")
		newSlide.classList.add("carousel-item")
		newSlide.innerHTML = `<img src="${allPhotos[i].url}" class="d-block w-100" alt="${allPhotos[i].description}">`
		carouselInner.appendChild(newSlide)
	}
}

async function showSlides(e) {
	await renderCarosuel()
	carousel.style.display = "block"
	bodyShadow.style.display = "block"
	const imgSrc = e.target.getAttribute("src")
	const allSlidesCollection = carouselInner.querySelectorAll("img")
	const allSlides = [...allSlidesCollection]
	allSlides.forEach(slide => {
		const slideUrl = slide.getAttribute("src")
		if (slideUrl === imgSrc) {
			slide.closest(".carousel-item").classList.add("active")
		}
	})
}

const checkWhetherImg = e => {
	if (e.target.matches(".image")) {
		showSlides(e)
	}
}

const hideCarosuel = () => {
	carouselInner.textContent = ""
	carousel.style.display = "none"
	bodyShadow.style.display = "none"
	const allSlidesCollection = carouselInner.querySelectorAll("img")
	const allSlides = [...allSlidesCollection]
	allSlides.forEach(slide => {
		slide.closest(".carousel-item").classList.remove("active")
	})
}

async function searchPicturesByName() {
	let allPhotos = await getPhotosFromClass()
	const searchedTerm = searchBar.value.toLowerCase()
	photoBox.textContent = ""

	allPhotos.forEach(pic => {
		if (
			pic.name.toLowerCase().indexOf(searchedTerm) !== -1 &&
			searchedTerm !== ""
		) {
			createSearchedphoto(pic)
		} else if (
			pic.description.toLowerCase().indexOf(searchedTerm) !== -1 &&
			searchedTerm !== ""
		) {
			createSearchedphoto(pic)
		}
	})

	if (searchedTerm === "") {
		renderRandomPhotos()
		photoInfo.textContent = "Wybrane zdjęcia"
	} else {
		photoInfo.textContent = `${searchedTerm}`
	}
}

async function searchPicturesByCategory() {
	let allPhotos = await getPhotosFromClass()
	const currentCategory = photoCategory[photoCategory.selectedIndex]
	photoBox.textContent = ""

	if (currentCategory.value === "1") {
		allPhotos.forEach(pic => {
			if (pic.category === currentCategory.text) {
				createSearchedphoto(pic)
			}
		})
		photoInfo.textContent = currentCategory.text
	} else if (currentCategory.value === "2") {
		renderRandomPhotos()
		photoInfo.textContent = currentCategory.text
	} else if (currentCategory.value === "3") {
		allPhotos.forEach(pic => {
			createSearchedphoto(pic)
		})
		photoInfo.textContent = currentCategory.text
	}
}

const createSearchedphoto = pic => {
	const newPhoto = document.createElement("div")
	newPhoto.classList.add("photo")
	newPhoto.innerHTML = `<img class="image" src="${pic.url}" alt="${pic.description}">`
	photoBox.appendChild(newPhoto)
}

renderRandomPhotos()

photoBox.addEventListener("click", checkWhetherImg)
bodyShadow.addEventListener("click", hideCarosuel)
searchBar.addEventListener("input", searchPicturesByName)
photoCategory.addEventListener("change", searchPicturesByCategory)
