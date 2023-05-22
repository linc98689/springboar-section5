"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");
const $episodesList = $("#episodesList");
const defaultImg = "https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.

  
    let args = {params:{q:term}};
    const res = await axios.get("http://api.tvmaze.com/search/shows", args);
    let {data} = res;
    return data.map((e)=>{let {id, name, summary, image} = e.show;
                               return {id,name, summary, image}});
}


/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();
  for (let show of shows) {
    let imgSrc = defaultImg;
    if(show.image !== null){
      imgSrc = Object.values(show.image)[0];
    }
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${imgSrc}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary!== null? show.summary:''}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  let url = `http://api.tvmaze.com/shows/${id}/episodes`;
  const res = await axios.get(url);
  let {data} = res;
  return data.map((e)=>{
    let {id,name, season, number} = e;
    return {id,name, season, number};
  });

 }

/** Event Handler when episode button is clicked
 * It is given arr of episode object containing id, name, season and number
 * renders those info in DOM with li in episodesArea
 */

function populateEpisodes(episodes) {
  $episodesArea.css("display", "block");
  $episodesList.empty();
  for(let episode of episodes){
    let $li = $(`<li>${episode.name} (${episode.number !== null? "Number "+episode.number+",": ""}
    ${episode.season !== null? "Season "+episode.season: ""})</li>`);
    $episodesList.append($li);
  }
 }
  

/** Handle episodes click */
async function clickHandle_showID(e){
   let target = e.target.parentElement.parentElement.parentElement;
   let id = target.dataset.showId;
   let episodes = await getEpisodesOfShow(id);
   populateEpisodes(episodes);
}

// Add event listener
$showsList.on("click", ".Show", clickHandle_showID);
