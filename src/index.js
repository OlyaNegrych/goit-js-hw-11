import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;
const KEY_Pixabay = '29443813-ca22e65ccc725dfd305ed5d5a';

let gallery = new SimpleLightbox('.gallery .photo-card a', {
  captionDelay: 250,
});
let searchQuery = '';
let page = 1;

const formRef = document.querySelector('.search-form');
const galleryRef = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

formRef.addEventListener('submit', onSearchImages);
loadMoreBtn.addEventListener('click', onLoadMore);
galleryRef.addEventListener('click', onOpenImageModal);

function onSearchImages(evt) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.elements.searchQuery.value;

  if (searchQuery === '') {
    clearImageList();
  }

  clearImageList();
  page = 1;

  renderImagesMarkup(searchQuery.trim());

  // fetchImages(searchQuery.trim())
  //   .then(images => {
  //     insertImageMarkup(images);
  //     loadMoreBtn.classList.add('is-hidden');

  //     if (images.totalHits > 0) {
  //       Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
  //       loadMoreBtn.classList.remove('is-hidden');

  //     }
  //     if (images.total === 0) {
  //       Notiflix.Notify.failure(
  //         'Sorry, there are no images matching your search query. Please try again.'
  //       );
  //     }

  //     page += 1;
  //     gallery.refresh();
  //   })
  //   .catch(error => console.log(error));
}

async function renderImagesMarkup(searchQuery) {
  try {
    const images = await fetchImages(searchQuery.trim());
    const renderMarkup = await insertImageMarkup(images);
    loadMoreBtn.classList.add('is-hidden');

    if (images.totalHits > 0) {
      Notiflix.Notify.success(`Hooray! We found ${images.totalHits} images.`);
      loadMoreBtn.classList.remove('is-hidden');
    }
    if (images.total === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    page += 1;
    gallery.refresh();
    
  } catch (error) {
    console.log(error);
  }
}

function onLoadMore() {
  fetchImages(searchQuery.trim())
    .then(images => {
      insertImageMarkup(images);
      loadMoreBtn.classList.remove('.is-hidden');
      smoothScroll();

      if (images.hits.length === 0) {
        loadMoreBtn.classList.add('is-hidden');
        Notiflix.Notify.warning(
          `We're sorry, but you've reached the end of search results.`
        );
      }

      page += 1;
      gallery.refresh();
    })
    .catch(error => console.log(error));
}

async function fetchImages(name) {
  const url = `https://pixabay.com/api/?key=${KEY_Pixabay}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=20&page=${page}`;
  const response = await fetch(url);

  return await response.json();
}

// function fetchImages(name) {
//   const url = `https://pixabay.com/api/?key=${KEY_Pixabay}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true&per_page=20&page=${page}`;

//   return fetch(url).then(response => {
//     return response.json();
//   });
// }

function createImageCardMarkup(images) {
  return images.hits
    .map(
      image => `<div class="photo-card">
  <a class="gallery__item" href="${image.largeImageURL}"><img class="gallery__image" src="${image.webformatURL}" alt="${image.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
       <br/>
      ${image.likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      <br/>
      ${image.views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      <br/>
      ${image.comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <br/>
      ${image.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}

function onOpenImageModal(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
}

function insertImageMarkup(images) {
  const markup = createImageCardMarkup(images);
  galleryRef.insertAdjacentHTML('beforeend', markup);
}

function clearImageList() {
  galleryRef.innerHTML = '';
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
