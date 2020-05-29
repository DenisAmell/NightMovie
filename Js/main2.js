const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
const SERVER = 'https://api.themoviedb.org/3';
const API_KEY = '952267fe1e9f3c5bf116d0213f36ff66';


// Меню

const leftMenu = document.querySelector('.left-menu');
const hamburger = document.querySelector('.hamburger');
const tvShowsList = document.querySelector('.tv-shows__list');
const modal =  document.querySelector('.modal');
const tvShows = document.querySelector('.tv-shows');
const tvCardImg = document.querySelector('.tv-card__img');
const modalTitle = document.querySelector('.modal__title');
const genresList = document.querySelector('.genres-list');
const rating = document.querySelector('.rating');
const description = document.querySelector('.description');
const modalLink = document.querySelector('.modal__link');
const searchForm = document.querySelector('.search__form');
const searchFormInput = document.querySelector('.search__form-input');
const preloader = document.querySelector('.preloader');
const dropdown = document.querySelectorAll('.dropdown');
const tvShowsHead = document.querySelector('.tv-shows__head');
const posterWrapper = document.querySelector('.poster__wrapper');
const modalContent = document.querySelector('.modal__content');
const nightM = document.querySelector('.night-m');
const pagination = document.querySelector('.pagination');
const tvBegin = document.querySelector('.tv-begin');
const footerM = document.querySelector('.footer-m')

const loading = document.createElement('div');
loading.className = 'loading';

class DBService {
	getData = async (url) => {
		const res = await fetch(url); 
		if (res.ok) {
			return res.json();
		} else {
			throw new Error(`Не удалось получить данные по адресу ${url}`);
		}
	}	

	getTestData = () => {
		return this.getData('test.json')
	}
	getTestCard = () => {
		return this.getData('card.json');
	}
	getSearchResult = query => {
		this.temp = `${SERVER}/search/tv?api_key=952267fe1e9f3c5bf116d0213f36ff66&query=${query}&page=1&language=ru-RU`;
		return this.getData(this.temp);
	}
	getNextPage = page => {
		return this.getData(this.temp + '&page=' + page);
	}
	getTvShows = id => {
		return this.getData(`${SERVER}/tv/${id}?api_key=952267fe1e9f3c5bf116d0213f36ff66&language=ru-RU`)
	}
	getTopRated = () => {
		return this.getData(`${SERVER}/tv/top_rated?api_key=952267fe1e9f3c5bf116d0213f36ff66&language=ru-RU&page=1`)
	}
	getPopular = () => {
		return this.getData(`${SERVER}/tv/popular?api_key=952267fe1e9f3c5bf116d0213f36ff66&language=ru-RU&page=1`)
	}
	getToday = () => {
		return this.getData(`${SERVER}/tv/airing_today?api_key=952267fe1e9f3c5bf116d0213f36ff66&language=ru-RU&page=1`)
	}
	getWeek = () => {
		return this.getData(`${SERVER}/tv/on_the_air?api_key=952267fe1e9f3c5bf116d0213f36ff66&language=ru-RU&page=1`)
	}
}

const renderCard = (response, target) => {
	tvShowsList.textContent = '';

	

	if (!response.total_results){
		loading.remove();
		tvShowsHead.textContent = 'К сожалению, по вашему запросу ничего не найдено...';
		tvShowsHead.style.cssText = 'color: red;';
		return;
	}

	tvShowsHead.textContent = target ? target.textContent : 'Результат поиска:';
	tvShowsHead.style.color = 'yellow';

	response.results.forEach(item => {
		const {
			backdrop_path: backdrop,
			name: title,
			poster_path: poster,
			vote_average: vote,
			id
		} = item;
		const posterIMG = poster ? IMG_URL + poster: 'img/no-poster.jpg';
		const backdropIMG = backdrop ? IMG_URL + backdrop : '';
		const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>`: '';

		const card = document.createElement('li');
		card.idTv = id;
		card.className = ('tv-shows__item');
		card.innerHTML = `
		<a href="#" id="${id}" class="tv-card">
                        ${voteElem}
                        <img class="tv-card__img"
                             src="${posterIMG}"
                             data-backdrop="${backdropIMG}"
                             alt="${title}">
                        <h4 class="tv-card__head">${title}</h4>
                    </a>
					`;
					loading.remove();
                    tvShowsList.append(card);


	});


	pagination.textContent = '';

	if (!target && response.total_pages > 1){
		for(let i = 1; i <= response.total_pages; i++){
			pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`
		}
	}
};

searchForm.addEventListener('submit', event =>{
	event.preventDefault();
	const value = searchFormInput.value.trim();
	searchFormInput.value = '';
	if (value){
		tvShows.append(loading);
		new DBService().getSearchResult(value).then(renderCard);
		tvBegin.textContent = '';
	}
});

// Открытие/закрытие меню
const closeDropDown = () =>{
	dropdown.forEach(item =>{
		item.classList.remove('active');
	})
}

hamburger.addEventListener('click', event => {
	leftMenu.classList.toggle('openMenu');
	hamburger.classList.toggle('open');
	closeDropDown();
});


document.addEventListener('click', event => {
	if (!event.target.closest ('.left-menu')) {
		leftMenu.classList.remove('openMenu');
		hamburger.classList.remove('open');
		closeDropDown();
	}
});

leftMenu.addEventListener('click', event =>{
	event.preventDefault();
	const target = event.target;
	const dropdown = target.closest('.dropdown');
	if (dropdown) {
		dropdown.classList.toggle('active');
		leftMenu.classList.add('openMenu');
		hamburger.classList.add('open');
	}

	if (target.closest('#top-rated')){
		new DBService().getTopRated().then((response) => renderCard(response, target));
	}
	if (target.closest('#popular')){
		new DBService().getPopular().then((response) => renderCard(response, target));
	}
	if (target.closest('#week')){
		new DBService().getWeek().then((response) => renderCard(response, target));
	}
	if (target.closest('#today')){
		new DBService().getToday().then((response) => renderCard(response, target));
	}
	if(target.closest('#search')){
		tvShowsList.textContent = '';
		tvShowsHead.textContent = '';
	}
});

footerM.addEventListener('click', event => {
	event.preventDefault();
	const target = event.target;
	if (target.closest('#top-rated')){
		new DBService().getTopRated().then((response) => renderCard(response, target));
	}
	if (target.closest('#popular')){
		new DBService().getPopular().then((response) => renderCard(response, target));
	}
	if (target.closest('#week')){
		new DBService().getWeek().then((response) => renderCard(response, target));
	}
	if (target.closest('#today')){
		new DBService().getToday().then((response) => renderCard(response, target));
	}

});

// Открытие модального окна

tvShowsList.addEventListener('click', event => {
	event.preventDefault();
	const target = event.target;
	const card = target.closest('.tv-card');
	if (card) {
		preloader.style.display = 'block';

		new DBService().getTvShows(card.id)
			.then( data => {
				if (data.poster_path){
					tvCardImg.src = IMG_URL + data.poster_path;
					tvCardImg.alt = data.name;
					posterWrapper.style.display = '';
					modalContent.style.paddingLeft = '';
				} else {
					posterWrapper.style.display = 'none';
					modalContent.style.paddingLeft = '25px';
				}
				console.log(data);
				modalTitle.textContent = data.name;
				genresList.textContent = '';
				data.genres.forEach( item => {
					genresList.innerHTML += `<li>${item.name}</li>`;
				})
				rating.textContent = data.vote_average; 
				description.textContent = data.overview; 
				modalLink.href = data.homepage;
		})
		.then(() => {
			document.body.style.overflow = ('hidden');
			modal.classList.remove('hide');
		})
		.finally(() =>{
			preloader.style.display= '';
		})
	}
});

// Закрытие модального окна

modal.addEventListener('click', event => {
	if (event.target.closest('.cross') ||
		event.target.classList.contains('modal')) {
		document.body.style.overflow = '';
		modal.classList.add('hide');
	}
});

const changeImage = event => {
	const card = event.target.closest('.tv-shows__item');
	if (card) {
		const img = card.querySelector('.tv-card__img');
		if (img.dataset.backdrop) {
			[img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
		}
		
	}
};

nightM.addEventListener ('click', event =>{
	if(event.target.closest('.night-m')){
		new DBService().getToday().then(renderCard)
		.then( () => {
			tvShowsHead.textContent = 'На сегодня'
			tvBegin.textContent = 'Желаешь отыскать информацию о любимых фильмах либо сериалах? Введи наименование и кликни на кнопку "НАЙТИ", всё осталное мы сделаем за тебя!;)';
		})
	}
});



tvShowsList.addEventListener('mouseover', changeImage);
tvShowsList.addEventListener('mouseout', changeImage);


pagination.addEventListener('click', event => {
	event.preventDefault();
	const target = event.target;
	if (target.classList.contains('pages')) {
		tvShows.append(loading);
		new DBService().getNextPage(target.textContent).then(renderCard);
	}
});


	new DBService().getToday().then(renderCard)
		.then( () => {
			tvShowsHead.textContent = 'На сегодня'
		});