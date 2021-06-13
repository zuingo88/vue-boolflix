function initVue() {
  new Vue({

    el: "#app",

    data: {

      myKey: "3ac305939dc6c020954c9ffffb48a55b",
      imgBase: "https://image.tmdb.org/t/p/w185",
      myLanguage: "it-IT",

      search: "",
      results: [],

      films: [],
      series: [],

      trendingFilm: [],
      trendingTv: [],

      lastFilms: [],
      lastTv: [],

      topFilms: [],
      topTv: [],

      popFilms: [],
      popTv: [],

      hiddenInput: true,
      hiddenSearch: true,
      hiddenSerie: false,
      hiddenFilm: false,
      hiddenInfo: true,

      genres: [],
      castRes: [],
      castObj: {},
      castObjs: [],

      varId: "",

      show: false,
    },

    //carico la home all'avvio
    mounted: function () {
      this.home();
    },

    methods: {

      showInput: function () {
        //mostro o nascondo input di ricerca
        this.hiddenInput = !this.hiddenInput;
      },

      voteToFive: function (originalVote) {
        //trasformo il rating da 1-10 nel suo equivalente 1-5
        return Math.round(originalVote / 2);
      },

      multiSearch: function () {
        //funzione ricerca
        if (this.search) {

          axios
            .get("https://api.themoviedb.org/3/search/multi",
              {
                params:
                {
                  api_key: this.myKey,
                  language: this.myLanguage,
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
              this.hiddenSearch = false;

              //nascondo le altre sezioni
              this.hiddenSerie = true;
              this.hiddenFilm = true;
              this.search = [];
            })

            .catch(() => console.log("error"));
        }
      },

      //di tendenza
      trending: function () {
        axios
          .get("https://api.themoviedb.org/3/trending/all/week?",
            {
              params:
              {
                api_key: this.myKey,
                language: this.myLanguage,
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
          })

          .catch(() => console.log("error"));
      },

      //ultime produzioni
      //film
      lastfilm: function () {
        axios
          .get("https://api.themoviedb.org/3/movie/now_playing?",
            {
              params:
              {
                api_key: this.myKey,
                language: this.myLanguage,
              },
            })

          .then((response) => {
            this.lastFilms = response.data.results;
          })

          .catch(() => console.log("error"));
      },

      //serie
      lasttv: function () {
        axios
          .get("https://api.themoviedb.org/3/tv/airing_today?",
            {
              params:
              {
                api_key: this.myKey,
                language: this.myLanguage,
              },
            })

          .then((response) => {
            this.lastTv = response.data.results;
          })

          .catch(() => console.log("error"));
      },

      //più votati
      //film
      topfilm: function () {
        axios
          .get("https://api.themoviedb.org/3/movie/top_rated?",
            {
              params:
              {
                api_key: this.myKey,
                language: this.myLanguage,
              },
            })

          .then((response) => {
            this.topFilms = response.data.results;
          })

          .catch(() => console.log("error"));
      },
      //serie
      toptv: function () {
        axios
          .get("https://api.themoviedb.org/3/tv/top_rated?",
            {
              params:
              {
                api_key: this.myKey,
                language: this.myLanguage,
              },
            })

          .then((response) => {
            this.topTv = response.data.results;
          })

          .catch(() => console.log("error"));
      },

      //popolari
      //film
      popfilm: function () {
        axios
          .get("https://api.themoviedb.org/3/movie/popular?",
            {
              params:
              {
                api_key: this.myKey,
                language: this.myLanguage,
                page: "1",
              },
            })

          .then((response) => {
            this.popFilms = response.data.results;
          })

          .catch(() => console.log("error"));
      },

      //serie
      poptv: function () {
        axios
          .get("https://api.themoviedb.org/3/tv/popular?",
            {
              params:
              {
                api_key: this.myKey,
                language: this.myLanguage,
                page: "1",
              },
            })

          .then((response) => {
            this.popTv = response.data.results;
          })

          .catch(() => console.log("error"));
      },

      //mostro la home
      home: function () {
        this.hiddenSearch = true;
        this.hiddenSerie = false;
        this.hiddenFilm = false;
        this.trending();
        this.lastfilm();
        this.lasttv();
        this.topfilm();
        this.toptv();
        this.popfilm();
        this.poptv();
        //this.getGenres();
      },

      //mostro serie
      serie: function () {
        this.hiddenSearch = true;
        this.hiddenSerie = false;
        this.hiddenFilm = true;
      },

      //mostro film
      film: function () {
        this.hiddenSearch = true;
        this.hiddenSerie = true;
        this.hiddenFilm = false;
      },

      //mostro cast
      getInfo: function (id) {
        this.varId = id;
        this.castRes = [];
        axios
          .get("https://api.themoviedb.org/3/movie/" + id + "/credits",
            {
              params:
              {
                api_key: this.myKey,
                language: this.myLanguage,
              },
            })

          .then((response) => {
            this.castRes = response.data.cast;

            this.castObjs = [];
            this.actors = [];
            this.characters = [];

            for (let i = 0; i < this.castRes.length; i++) {
              this.castObj = {};

              const castElement = this.castRes[i];
              const actor = castElement.name;
              const character = castElement.character;

              this.castObj.actor = actor;
              this.castObj.character = character;
              this.castObjs.push(this.castObj);

              this.castObjs.splice(5);
            }
          });
      },
    },
  });
}

initVue();

document.addEventListener("DOMContentLoaded", initVue);
