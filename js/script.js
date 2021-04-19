function initVue() {
  new Vue({
    el: "#app",
    data: {
      results: [],
      films: [],
      series: [],
      search: "",
      imgBase: "https://image.tmdb.org/t/p/w154",
    },
    methods: {
      multiSearch: function () {
        if (this.search) {
          axios
            .get("https://api.themoviedb.org/3/search/multi", {
              params: {
                api_key: "3ac305939dc6c020954c9ffffb48a55b",
                query: this.search,
              },
            })
            .then((response) => {
              //metto i dati nella mia variabile 'films'
              this.results = response.data.results;
              this.films = [];
              this.series = [];
              for (let i = 0; i < this.results.length; i++) {
                const element = this.results[i];
                if (element.media_type == "movie") {
                  this.films.push(element);
                } else if (element.media_type == "tv") {
                  this.series.push(element);
                }
              }
              this.search = [];
            })
            .catch(() => console.log("error"));
        }
      },
    },
  });
}

initVue();

document.addEventListener("DOMContentLoaded", initVue);
