// variables
const form = $('#movie-form');
const list = $('#movie-list');
const title =$('#title');
const rate =$('#rate');

// helper functions
function addNewMovie(t, r){
    let newLi =$('<li>').text(`Title: ${t} Rate: ${r}`);

    let delBtn = $('<button>').text('delete');
    delBtn.css('margin-left', "3px");
    delBtn.on('click', (evt)=>{
        let target = evt.target;
        target.parentNode.remove();
    });
    newLi.append(delBtn);

    list.append(newLi);
    title.val("");
    rate.val("");
}

// event handlers
form.on('submit', function(evt){
    evt.preventDefault()
    addNewMovie(title.val(),rate.val());
});