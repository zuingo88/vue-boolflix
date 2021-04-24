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

      lastFilms: [],
      lastTv: [],

      topFilms: [],
      topTv: [],

      search: "",
      hiddenInput: true,
      hidden: true,
      hiddenSection: false,
      hiddenInfo: true,
    },

    mounted: function () {
      this.home();
    },

    methods: {
      showInput: function () {
        //mostro o nascondo input di ricerca
        this.hiddenInput = !this.hiddenInput;
      },

      showSearched: function () {
        this.hidden = !this.hidden;
      },

      hiddenSections: function () {
        this.hiddenSection = !this.hiddenSection;
      },

      showInfo: function () {
        this.hiddenInfo = !this.hiddenInfo;
      },

      voteToFive: function (originalVote) {
        //trasformo il rating da 1-10 nel suo equivalente 1-5
        return Math.round(originalVote / 2);
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
              //nascondo le altre sezioni
              this.hiddenSections();
              this.search = [];
            })
            .catch(() => console.log("error"));
        }
      },

      //di tendenza
      trending: function () {
        axios
          .get("https://api.themoviedb.org/3/trending/all/week?", {
            params: {
              api_key: this.myKey,
              language: this.language,
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

      //ultime produzioni
      //film
      lastfilm: function () {
        axios
          .get("https://api.themoviedb.org/3/discover/movie", {
            params: {
              api_key: this.myKey,
              language: this.language,
              sort_by: "release_date.desc",
            },
          })

          .then((response) => {
            this.lastFilms = response.data.results;
          });
      },
      //serie
      lasttv: function () {
        axios
          .get("https://api.themoviedb.org/3/discover/tv?", {
            params: {
              api_key: this.myKey,
              language: this.language,
            },
          })

          .then((response) => {
            this.lastTv = response.data.results;
            console.log(this.lastTv);
          });
      },

      //più votati
      //film
      topfilm: function () {
        axios
          .get("https://api.themoviedb.org/3/movie/top_rated?", {
            params: {
              api_key: this.myKey,
              language: this.language,
            },
          })

          .then((response) => {
            this.topFilms = response.data.results;
          });
      },
      //serie
      toptv: function () {
        axios
          .get("https://api.themoviedb.org/3/tv/top_rated?", {
            params: {
              api_key: this.myKey,
              language: this.language,
            },
          })

          .then((response) => {
            this.topTv = response.data.results;
          });
      },

      home: function () {
        this.hidden = true;
        this.hiddenSection = false;
        this.trending();
        this.lastfilm();
        this.lasttv();
        this.topfilm();
        this.toptv();
      },
    },
  });
}

initVue();

document.addEventListener("DOMContentLoaded", initVue);
