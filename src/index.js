import debounce from 'lodash.debounce';
import Notiflix from 'notiflix'; //Notiflix.Notify.success(failure,warning,info)('Sol lucet omnibus');
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const { height: cardHeight } = document
  .querySelector('.gallery')
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: 'smooth',
});

const axios = require('axios').default;

// axios.<method> will now provide autocomplete and parameter typings

const KEY = '29443813-ca22e65ccc725dfd305ed5d5a';
const DEBOUNCE_DELAY = 300;
const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

formRef.addEventListener('submit', debounce(onSearchImages, DEBOUNCE_DELAY));

async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}

function onSearchImages(evt) {
  evt.preventDefault();
  clearImageList();
  fetchImages(evt.target.value.trim())
    .then(images => {
      if (images.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (images.length > 1 && images.length < 10) {
        clearImageList();
        insertImageMarkup(images);
      }
      if (images.status === 404) {
        Notiflix.Notify.failure('Oops, there is no country with that name.');
      }
    })
    .catch(error => console.log(error));
}

const fetchImages = name => {
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`
  ).then(response => {
    return response.json();
  });
};

function createImageCardMarkup(images) {
  return images
    .map(
      image => `<div class="photo-card">
  <img src="${image.webformatURL/largeImageURL}" alt="${image.tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${image.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}

function insertImageMarkup(images) {
  const markup = createImageCardMarkup(images);
  galleryRef.insertAdjacentHTML = ('beforend', markup);
}

function clearImageList() {
  galleryRef.innerHTML = '';
}
