// var classname = document.getElementsByClassName("cityButton")

// for (var i = 0; i < classname.length; i++) {
//     console.log(classname[i]);
//     classname[i].addEventListener('click', cityButton);
// }
// var cityButton = function() {
//     console.log(this);
// }



$("#question").keyup(getQuestions);
$(".questionContainer").click(redirectToQuesPage);

function getQuestions() {
    $("#questions").html('');

    var value = this.value;
    $.ajax({
        url: "/related-question?localityId=1&text=" + value,
        success: function(result) {
            $("#questions").html(result);
            $(".questionContainer").click(redirectToQuesPage);
        }
    });
};

function redirectToQuesPage(el) {
    var id = el.currentTarget.id;
    var answerCount = el.currentTarget.childNodes[0].id;
    if (parseInt(answerCount, 10) != 0) {
        window.location.assign('/question?questionId=' + id);
    } else {
        window.alert('bsidfbisudbfiusdbdf');
    }
};
