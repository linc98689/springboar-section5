$(function(){
    console.log('Let’s get ready to party with jQuery!');
})
// document.addEventListener("DOMContentLoaded", (event) => {
//     console.log('Let’s get ready to party with jQuery!') ;
//   });

$("article img").addClass('image-center');
// const imgs = document.querySelectorAll('article img');
// for(let img of imgs){
//     img.classList.add('image-center');
// }

$('p').eq(-1).remove();
// let pgs = document.querySelectorAll('p');
// pgs[pgs.length - 1].remove();

let n = Math.random() * 100 + 1
$('#title').css("font-size", `${n}px`);
// document.querySelector('#title').style.fontSize = `${n}px`

$('img').before('<img src="pup-on-grass.webp" class="image-center">');
// const existImg = document.querySelector('img');
// const newImg = document.createElement('img')
// newImg.setAttribute("src","pup-on-grass.webp");
// newImg.classList.add('image-center');
// existImg.parentNode.insertBefore(newImg, existImg);

// const newLi = $('<li>').text("I like the pupy above me");
// $('ol').append(newLi);
const newLi = document.createElement('li');
newLi.innerText = "She is cute";
document.querySelector('ol').append(newLi);

$('ol').remove()
$('aside').append($('<p>').text("Rerum debitis aspernatur, ipsum animi! Quis ullam dolore blanditaccusantium eius minus tempore, iure maxime similique vel! Possimureprehenderit autem, recusandae quos laudantium nesciunt libero suscipitofficia rerum, et."));
// document.querySelector('ol').remove();
// const newP = document.createElement('p');
// newP.innerText ="Rerum debitis aspernatur, ipsum animi! Quis ullam dolore blanditaccusantium eius minus tempore, iure maxime similique vel! Possimureprehenderit autem, recusandae quos laudantium nesciunt libero suscipitofficia rerum, et.";
// document.querySelector('aside').append(newP);

$('input.form-control').on('keyup',  function(evt){
    const colors = $('input.form-control');
    let red = +colors.eq(0).val();
    let blue = +colors.eq(1).val();
    let green = +colors.eq(2).val();
    let color = `rgb(${red},${green}, ${blue})`;
    $('body').css('background-color', color);
});

$('img').on('click', function(evt){
    $(this).remove();
})