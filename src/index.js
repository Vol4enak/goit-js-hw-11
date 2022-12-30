import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import NewPhoto from './feachAPI';
const refs = {
  inputEl: document.querySelector('.search-api'),
  buttonEl: document.querySelector('.button-input'),
  formEl: document.querySelector('.search-form'),
  loadMore: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
};

const newGetsPhoto = new NewPhoto();

let ligthbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

refs.formEl.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoad);
refs.loadMore.style.visibility = 'hidden';

let numOfSearch = 0;


async function onSearch(e) {
  e.preventDefault();
  
  newGetsPhoto.query = e.target.searchQuery.value;
  refs.loadMore.style.visibility = 'visible';
  refs.loadMore.textContent = 'Feaching...';
  cleatHtml();
  newGetsPhoto.resetValue();
  try {
    const resFromPhoto = await newGetsPhoto.getSomePhoto();
    numOfSearch = await resFromPhoto.totalHits;
    renderCarts(resFromPhoto);
    refs.loadMore.textContent = 'Load More';
    refs.loadMore.style.visibility = 'visible';
    Notify.success(`Hooray! We found ${numOfSearch} images.`);
    ligthbox.refresh();
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.loadMore.style.visibility = 'hidden';
  }
}

async function onLoad() {
  refs.loadMore.textContent = 'Feaching...';

  try {
    const resFromPhoto = await newGetsPhoto.getSomePhoto();
  
    if ((numOfSearch -= 40) < 0) {
      throw new Error();
    } 
       Notify.success(`Hooray! We found ${numOfSearch} images.`);
    
    refs.loadMore.textContent = 'Load More';
    renderCarts(resFromPhoto);
    ligthbox.refresh();
  } catch (error) {
    refs.loadMore.style.visibility = 'hidden';
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  }
}

function renderCarts(photo) {
  return photo.hits.map(
    ({
      webformatURL,
      largeImageURL,
      tags,
      likes,
      views,
      comments,
      downloads,
    }) => {
      const render = `
<div class="photo-card">
<a class="gallery__item" href="${largeImageURL}" target="_self" >
  <img class="gallery__image" src="${webformatURL}" alt="${tags}" loading="lazy" width=400 height=350/>
</a>
  <div class="info">
    <p class="info-item">
      <b>Likes <br><span class="info-text">${likes}</span></b>
    </p>
    <p class="info-item">
      <b>Views <br><span class="info-text">${views}</span></b>
    </p>
    <p class="info-item">
      <b>Comments <br><span class="info-text">${comments}</span></b>
    </p>
    <p class="info-item">
      <b>Downloads <br><span class="info-text">${downloads}</span></b>
    </p>
  </div>
</div>`;

      return refs.galleryEl.insertAdjacentHTML('beforeend', render);
    }
  );
}

function cleatHtml() {
  refs.galleryEl.innerHTML = '';
}
