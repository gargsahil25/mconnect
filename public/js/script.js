// var classname = document.getElementsByClassName("cityButton")

// for (var i = 0; i < classname.length; i++) {
//     console.log(classname[i]);
//     classname[i].addEventListener('click', cityButton);
// }
// var cityButton = function() {
//     console.log(this);
// }




// document.getElementsById().addEventListener('key', cityButton);
$("#question").keyup(function() {

    $.ajax({
        url: "/related-question?localityId=1&text=" + this.value,
        success: function(result) {
            $("#questions").html(result);
        }
    });
    console.log(this);
    // alert("Handler for .keyup() called.");
});
