/**************************
 * constants and variables
 *************************/
const ALL_CATS = []; // collection of objects of all categories info
const TOTAL_NUM_CATEGORIES = 1000;
const NUM_CATEGORIES = 6;
const NUM_CLUES_BY_CATEGORY = 2; // for each category
const BASE_URL = "https://jservice.io";
const category_url = "/api/category";
const categories_url = '/api/categories';

let categories = [];
let gameClues = [];
let countClueAnswered = 0;

// DOM
const btnStart = $("#start");
const spinner = $("#spin-container");
const gameArea = $("#jeopardy");
const header = $("header");
const body = $('body');

/*******************
 * Retrive Data
 *******************/

/**
 * This function automatically  runs to initialize the app
 * It populates ALL_CATS, array of TOTAL_NUM_CATEGORIES category objects with {id, title, clues_count}
 * It first tries to load the collection from localStorage. If not stored, fetch from the API and 
 * storage the result in localStorage
 */
async function getTotalCategories(){
    ALL_CATS.length = 0;
    if (localStorage.getItem("jeopardy") === null){
        let url = BASE_URL + categories_url;
        let offset = 0;
        let count = 100;
        while (offset < TOTAL_NUM_CATEGORIES){
            let args = {params: {count, offset}};
            showLoadingView();
            let {data:categoryIds} = await axios.get(url, args);
            hideLoadingView();
            ALL_CATS.push(...categoryIds);
            console.log(offset);
            offset += count;
        }
        localStorage.setItem("jeopardy", JSON.stringify(ALL_CATS));
    }
    else{
        ALL_CATS.push(...JSON.parse(localStorage.getItem("jeopardy")));
    }
    return ALL_CATS.length;
}


/**
 * refresh variables:categories and gameClues for a new game
 * categories: collection of clues returned from API without sampling,
 *     listed by title: [
 *     {title: "soda pop quiz", clues: [...]},
 *     {title: "soda pop quiz", clues: [...]},
 *     ...]
 * gameClues: collection of randomly selected (NUM_CATEGORIES X NUM_CLUES_BY_CATEGORY) individual clues, 
 *     ordered by categoried: [
 *     {answer: "a pickpocket",
        question: "Cutpurse is an old-time word for this type of crowd-working criminal",
        title: "crime"},
 *     {answer: "West Virginia",
        question: "Country roads, take me to this state with lowest crime ...",
        title: "crime"},
 *     {answer: "the sabre-toothed tiger",
        question: "All the encyclopedias used by Jeopardy! have the same painting of ...",
        title: "ancient america"},
 *     {answer: "rubber",
        question: "Mayans played a sacred game on special courts using a ball made from ...",
        title: "ancient america"},
        ...
        ]
 */
async function getGameData(){
    // cleaning from previous game
    categories = [];
    gameClues = [];

    // select categories
    let catsSelected = sampleArray(ALL_CATS, NUM_CATEGORIES);

    // get and select clues from categories
    for(let cat of catsSelected){
        let res = await getCluesByCategory(cat.id);
        categories.push(res);
        // randomly select NUM_CLUES_BY_CATEGORY clues
        selectClues = sampleArray(res.clues, NUM_CLUES_BY_CATEGORY);
        for(let clue of selectClues){ // store them in gameClues
            gameClues.push({title:cat.title, answer:clue.answer, question:clue.question});
        }
    }
}


/**
 * fetch clues for a given category
 */
async function getCluesByCategory(id){
    let url = BASE_URL + category_url;
    let args = {params:{id}};
    let {data:{title}, data:{clues}} =  await axios.get(url, args);
    clues = clues.map((e)=>{
        let {answer, question} = e;
        return {answer, question};
    })
    return {title, clues};
}



/*******************
 * Event Handling
 *******************/

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {    
    console.log("initial...");
    btnStart.addClass('btn-start');
    btnStart.on("click", handleStartClick);
    gameArea.on("click", '.cell-active', handleClick);
   
    //popup a card
    let card = $(`
    <div class="card ipop">
        <div class="card-header title bc-danger">
        title
        </div>
        <div class="card-body">
            <h5 class="card-title question">question</h5>
            <p class="card-text answer mb-1 pb-1">answer</p>
        
        </div>
    </div>
    `);
    card.css('opacity', '0');
    card.css('z-index', -2);
    body.prepend(card);

    let hint = $('<div class="hint">HINT: Click on the center portion the first time to review the answer, and the second time to discharge the clue</div>');

    hint.css('visibility', 'hidden');
    body.prepend(hint);

    body.on("click", ".question", handleCardClick );
    showLoadingView();
    await getTotalCategories();
    hideLoadingView();

}

/** On click of start / restart button */
async function handleStartClick(evt){
    showLoadingView();
    await fillTable();
    hideLoadingView();
    this.innerText ="Start Over!";
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable() {
    gameArea.empty();
    console.log("creating table");
    countClueAnswered = 0;
    await getGameData();

    //table
    const table = $("<table>");

    //head
    const rh = $("<tr>");
    for(let i=0; i<NUM_CATEGORIES;  i++){
        let th = $(`<th>${categories[i].title.toUpperCase()}</th>`);
        rh.append(th);
    }
    table.append(rh);

    //body
    for(let i=0; i<NUM_CLUES_BY_CATEGORY; i++){
        let tr = $("<tr>");
        for(let j=0; j<NUM_CATEGORIES; j++){
            let td = $(`<td class="large cell-active" data-row=${i} data-col=${j}>?</td>`);
            tr.append(td);
        }
        table.append(tr);
    }

    gameArea.append(table);

}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

async function handleClick(evt) { // click on clue - table cell
    let target = evt.target;
    if(target !== this) 
         return;
    
    let card = $(".ipop");
    let hint = $('.hint');

    let i = Number(target.dataset.row);
    let j = Number(target.dataset.col);
    let idx = j * NUM_CLUES_BY_CATEGORY + i;
    $(target).removeClass('cell-active');
    $(target).empty();
    $(target).css('backgroundColor', 'black');
    
    
    let title = $('.title');
    let question = $('.question');
    let answer = $('.answer');
    
    title.text("Category: "+ gameClues[idx].title.toUpperCase());
    question.text(gameClues[idx].question);
    answer.text("Answer: " + gameClues[idx].answer);
    let tc = answer.css('color');
    answer.data('data-color', tc);
    let bc = answer.css('background-color');
    answer.css('color', bc);

    card.data('data-status', 'un-answered');
    card.css('opacity', '1');
    card.css('z-index', 100);

    hint.css('visibility', 'visible');
}
/** handle clicking on popup card */
async function handleCardClick(evt){
    let target = evt.target;
    if(target !== this)
          return;
    let card = $('.card');
    let hint = $('.hint');
    let answer = $('.answer');
    answer.css('color', answer.data('data-color'));
    let status = card.data('data-status');

    switch(status){
        case "un-answered":
            card.data('data-status', 'answered');
            break;
        case "answered":
            card.css('opacity', '0');
            card.css('z-index', -3);

            hint.css('visibility', "hidden");

            countClueAnswered++;
            if(countClueAnswered === NUM_CATEGORIES * NUM_CLUES_BY_CATEGORY){//all shown
                    setTimeout(()=>{alert("Game Over. Please reload.")}, 500);
                    await fillTable();
                 };
    }    
}
/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {
    spinner.css('display', "block");
}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
    spinner.css('display', "none");
}

/** On page load, add event handler for clicking clues */

// TODO



/************************
 *  Utility functions 
 * *********************/

/**
 * Randomly select n elements from arr
 * It fills backwards from index n-1 to 0.
 */
function sampleArray(arr, n){ 
    let size = arr.length;
    let samples = [...arr];
    let count = size;
    while (count > size - n){
        let idx = Math.floor(Math.random() * count);
        count--;
        let tmp = samples[count];
        samples[count] = samples[idx];
        samples[idx] = tmp;
    }
    return samples.slice(size-n);
}


/**
 * shuffle arr in-place
 */
function shuffleArr(arr){
    let size = arr.length;
    let count = size;
    while (count > 0){
        let idx = Math.floor(Math.random() * count);
        count--;
        let tmp = arr[count];
        arr[count] = arr[idx];
        arr[idx] = tmp;
    }
}


/********************
 * Initial the app
 *******************/
setupAndStart();



/* <span id="hint">HINT: Click on the center portion the first time to review the answer, and the second time to discharge the clue</span> */