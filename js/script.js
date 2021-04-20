function initVue() {
  new Vue({
    el: "#app",
    data: {
      myKey: "3ac305939dc6c020954c9ffffb48a55b",
      imgBase: "https://image.tmdb.org/t/p/w185",
      language: "it-IT",
      results: [],
      films: [],
      series: [],
      trendingFilm: [],
      trendingTv: [],
      news: [],
      search: "",
      hiddenInput: "true",
      hidden: "true,",
    },
    mounted: function () {
      this.trending();
      this.lastProd();
    },
    methods: {
      showInput: function () {
        //mostro o nascondo input di ricerca
        this.hiddenInput = !this.hiddenInput;
      },
      showSearched: function () {
        this.hidden = !this.hidden;
      },
      multiSearch: function () {
        //funzione ricerca
        if (this.search) {
          axios
            .get("https://api.themoviedb.org/3/search/multi", {
              params: {
                api_key: this.myKey,
                language: this.language,
                query: this.search,
              },
            })
            .then((response) => {
              //metto tutti i dati ottenuti nella mia variabile 'results'
              this.results = response.data.results;
              this.films = [];
              this.series = [];
              //procedo poi a dividerli tra 'films' e 'series'
              for (let i = 0; i < this.results.length; i++) {
                const element = this.results[i];
                if (element.media_type == "movie") {
                  this.films.push(element);
                } else if (element.media_type == "tv") {
                  this.series.push(element);
                }
              }
              //rendo visibile il risultato della ricerca
              this.showSearched();
              this.search = [];
            })
            .catch(() => console.log("error"));
        }
      },
      voteToFive: function (originalVote) {
        //trasformo il rating da 1-10 nel suo equivalente 1-5
        return Math.round(originalVote / 2);
      },
      trending: function () {
        axios
          .get("https://api.themoviedb.org/3/trending/all/week?", {
            params: {
              api_key: this.myKey,
              language: this.language,
              //   query: this.search,
            },
          })
          .then((response) => {
            this.results = response.data.results;
            for (let i = 0; i < this.results.length; i++) {
              const element = this.results[i];
              if (element.media_type == "movie") {
                this.trendingFilm.push(element);
              } else if (element.media_type == "tv") {
                this.trendingTv.push(element);
              }
            }
          });
      },
      lastProd: function () {
        axios
          .get("https://api.themoviedb.org/3/discover/movie?", {
            params: {
              api_key: this.myKey,
              language: this.language,
              sort_by: "release_date.desc",
              //   query: this.search,
            },
          })
          .then((response) => {
            this.news = response.data.results;
          });
      },
    },
  });
}

initVue();

document.addEventListener("DOMContentLoaded", initVue);
