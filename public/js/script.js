// var classname = document.getElementsByClassName("cityButton")

// for (var i = 0; i < classname.length; i++) {
//     console.log(classname[i]);
//     classname[i].addEventListener('click', cityButton);
// }
// var cityButton = function() {
//     console.log(this);
// }



$("#question").keyup(getQuestions);

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

function redirectToQuesPage() {
    var id = $(".questionContainer").attr('link');
    window.location.assign('/question-page?questionId=' + id);
};

$(".questionContainer").click(redirectToQuesPage);
