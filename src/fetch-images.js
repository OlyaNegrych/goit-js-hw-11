async function renderImagesMarkup(searchQuery) {
  evt.preventDefault();
  searchQuery = evt.currentTarget.elements.searchQuery.value.trim();
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
  } catch (error) {
    console.log(error);
  }
}
