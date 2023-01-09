const autoCompleteConfig = {
  renderOption : (movie) => {
    const imgSrc = movie.Poster === 'N/A' ? '' : movie.Poster;
    return `
    <img src="${imgSrc}" />
    ${movie.Title} (${movie.Year})
    `;
   },
   inputValue(movie){
     return movie.Title;
   },
   async fetchData(searchTerm) {
    const response = await axios.get('http://www.omdbapi.com/', {
      params: {
        apikey:'aea23175',
        s: searchTerm
      }
    });
  
  
    if(response.data.Error) {
      return [];
    }
  
    return response.data.Search;
  }  
};

createAutoComplete({
  ...autoCompleteConfig,
 root : document.querySelector('#right-autocomplete'),
 onOptionSelect(movie) {
  document.querySelector('.tutorial').classList.add('is-hidden');
  onMovieSelect(movie, document.querySelector('#right-summary'), 'right')
 },
});

createAutoComplete({
  ...autoCompleteConfig,
 root : document.querySelector('#left-autocomplete'),
 onOptionSelect(movie) {
  document.querySelector('.tutorial').classList.add('is-hidden');
  onMovieSelect(movie, document.querySelector('#left-summary'), 'left')
 },
});

let rightMovie;
let leftMovie;


const onMovieSelect = async (movie, summaryElement, side) => {
response = await axios.get('http://www.omdbapi.com/', {
    params: {
      apikey:'aea23175',
      i: movie.imdbID
    }
  });
  summaryElement.innerHTML = movieTemplete(response.data);

  if(side === 'right'){
    leftMovie = response.data;
  } else {
    rightMovie = response.data;
  };

  if(leftMovie && rightMovie){
    runComparison()
  }
};

const runComparison = () => {
  console.log('it is working')
  const rightSideStats = document.querySelectorAll('#right-summary .notification');
  const leftSideStats = document.querySelectorAll('#left-summary .notification');

  rightSideStats.forEach((rightStat, index) =>{
    const leftStat = leftSideStats[index]
    

    const rightSideValue = rightStat.dataset.value;
    const leftSideValue = leftStat.dataset.value;

    if(rightSideValue > leftSideValue){
      rightStat.classList.remove('is-primary');
      rightStat.classList.add('is-warning');
    }else{
      leftStat.classList.remove('is-primary');
      leftStat.classList.add('is-warning');
    }
  })
}

const movieTemplete = (movieDetail) => {
  const dollars = parseInt((movieDetail.BoxOffice.replace(/\$/d, '').replace(/,/d,'')));
  const metascore = parseInt(movieDetail.Metascore);
  const imdbRating = parseFloat((movieDetail.imdbRating));
  const imdbVotes = parseInt((movieDetail.imdbVotes.replace(/,/d,'')));

  const awards = movieDetail.Awards.split(' ').reduce((prev, word)=>{
    const value = parseInt(word);

    if(isNaN(value)){
      return prev;
    } else {
      return prev + value;
    }
  }, 0);

  return `
    <article class="media">
      <figure class="media-left">
        <p class="image">
          <img src="${movieDetail.Poster}"/>
        </p>
      </figure>
      <div class="media-content">
        <div class="content">
          <h1>${movieDetail.Title}</h1>
          <h4>${movieDetail.Genre}</h4>
          <p>${movieDetail.Plot}</p>
        </div>
      </div>
    </article>
    <article data-value=${awards} class="notification is-primary">
      <p class="title">${movieDetail.Awards}</p>
      <p class="subtitle">Awards</p>
    </article>
      <article data-value=${dollars} class="notification is-primary">
      <p class="title">${movieDetail.BoxOffice}</p>
      <p class="subtitle">Box Office</p>
    </article>
      <article data-value=${metascore} class="notification is-primary">
      <p class="title">${movieDetail.Metascore}</p>
      <p class="subtitle">Metascore</p>
    </article>
      <article data-value=${imdbRating} class="notification is-primary">
      <p class="title">${movieDetail.imdbRating}</p>
      <p class="subtitle">IMDB Rating</p>
    </article>
      <article data-value=${imdbVotes} class="notification is-primary">
      <p class="title">${movieDetail.imdbVotes}</p>
      <p class="subtitle">IMDB Votes</p>
    </article>
  `
};