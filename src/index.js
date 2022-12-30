const refs = {
  inputEl: document.querySelector('.search-api'),
  buttonEl: document.querySelector('.button-input'),
  formEl: document.querySelector('.search-form'),
  loadMore: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
};

import NewPhoto from './feachAPI';
const newGetsPhoto = new NewPhoto();

refs.formEl.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoad);
refs.loadMore.style.visibility = 'hidden';
function onSearch(e) {
  e.preventDefault();
  newGetsPhoto.query = e.target.searchQuery.value;
  refs.loadMore.style.visibility = 'visible';
  refs.loadMore.textContent = 'Feaching...';
    
  cleatHtml();
  newGetsPhoto.resetValue();
  newGetsPhoto.getSomePhoto()
    .then(res => {
      renderCarts(res);
      refs.loadMore.textContent = 'Load More';
    })
    .catch(() => {
       
      refs.loadMore.style.visibility = 'hidden';
    });
}

function onLoad() {
  refs.loadMore.textContent = 'Feaching...';
  newGetsPhoto.getSomePhoto().then(res => {
    refs.loadMore.textContent = 'Load More';
    renderCarts(res);
  });
}

function renderCarts(photo) {
  return (comlpPhoto = photo.hits.map(
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
  ));
}

function cleatHtml() {
  refs.galleryEl.innerHTML = '';
}
