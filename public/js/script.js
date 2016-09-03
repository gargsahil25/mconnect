$("#question").keyup(getQuestions);
$(".question-page").click(redirectToQuesPage);
$("#ask-question").click(saveQuestion);
$("#viewMore").click(viewMore);

function viewMore() {
    var quesId = $('#questionId').attr('data');

    $.ajax({
        url: "/getMore?questionId=" + quesId,
        success: function(result) {
            console.log(result);
            if (result == '') {
                window.location.assign('/allQuesPage');
            }
            $("#addMore").append(result);
        }
    });
}

function getQuestions() {
    $("#questions").html('');

    var value = this.value;
    $.ajax({
        url: "/related-question?localityId=1&text=" + value,
        success: function(result) {
            $("#questions").html(result);
            $(".question-page").click(redirectToQuesPage);
        }
    });
};

function redirectToQuesPage(el) {
    var id = el.currentTarget.dataset.questionid;
    var answerCount = el.currentTarget.dataset.answercount;
    if (parseInt(answerCount, 10) != 0) {
        window.location.assign('/question?questionId=' + id);
    } else {
        getAnswer(id, el.currentTarget.dataset.question);
    }
};

function getAnswer(questionId, question) {
    $.ajax({
        url: "/get-answer?questionId=" + questionId + "&question=" + question,
        success: function(result) {
            window.alert("We don't have any answers for this yet. We will get back to you as soon as we have the answers.");
        }
    });
};

function saveQuestion() {
    var question = $("#question").val();
    if (!question) {
        return;
    }
    $.ajax({
        url: "/save-question?userId=1&localityId=1&question=" + question,
        success: function(result) {
            window.alert("We will get back to you as soon as we have the answers for your question.");
        }
    });
};
