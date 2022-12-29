import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
const PER_KEY = '32444596-f2f4d32c85d571017a032d14e';
const apiSettings =
  '&image_type=photo&orientation=horizontal&safesearch=true&per_page=40';

export default class NewPhoto {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
 async getSomePhoto() {
  try {
     const getFetch = await axios.get(
       `https://pixabay.com/api/?key=${PER_KEY}&q=${this.searchQuery}${apiSettings}&page=${this.page}`
     );
     if (getFetch.data.hits.length === 0 || !this.searchQuery) {
       throw new Error();
    }
     Notify.success(`Hooray! We found ${getFetch.data.totalHits} images.`);
     this.incrementValue();
     return getFetch.data;
   } catch{
     Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
  }
      };

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  incrementValue(){
     this.page += 1;
  }

  resetValue() {
    this.page = 1;
  }
}
