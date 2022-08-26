export default class FetchImages {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async fetchImages() {
    const axios = require('axios').default;
    const KEY_Pixabay = '29443813-ca22e65ccc725dfd305ed5d5a';
    const url = `https://pixabay.com/api/?key=${KEY_Pixabay}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=20&page=${this.page}`;
    
    const response = await axios.get(url);

    return await response.json();
  }

  resetPage() {
    this.page = 1;
  }

  get searchQuery() {
    return this.searchQuery;
  }

  set searchQuery(newQuery) {
    this.searchQuery = newQuery;
  }
}
