// // const
const key = "UUzPDP65cRjdLOD5iG4YUj95hG02sZxZ";
// // dom variables
const form = document.querySelector('#form');
const input = document.querySelector("#search-type");
// // const btnSearch = document.querySelector('#btn-search');
const btnClear = document.querySelector('#btn-clear');
const list = document.querySelector("#list");

// // event handles
async function getImg(e){
    e.preventDefault();
    const url =`https://api.giphy.com/v1/gifs/search?api_key=${key}&q=${input.value}&limit=1`;
    const res = await axios.get(url);
    console.log(res);
    console.log(res.data.data[0].images.fixed_height.url);

    // show img
    let img = document.createElement('img');
    img.src = res.data.data[0].images.original.url;
    img.classList.add("img-fixed");
    list.append(img);
    input.value = "";
}


form.addEventListener("submit", getImg);
btnClear.addEventListener('click', function(){
    list.innerHTML = "";
})
