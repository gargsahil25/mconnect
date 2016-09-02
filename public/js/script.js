var classname = document.getElementsByClassName("cityButton")

for (var i = 0; i < classname.length; i++) {
    console.log(classname[i]);
    classname[i].addEventListener('click', cityButton);
}
var cityButton = function() {
    console.log(this);
}
