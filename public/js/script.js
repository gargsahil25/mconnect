$("#question").keyup(getQuestions);
$(".question-page").click(redirectToQuesPage);
$("#ask-question").click(saveQuestion);
$("#viewMore").click(viewMore);

var popupData;

function showNext() {
    $('#popupArea').html('');
    $('#popupArea').html(popupData[ptrHtml % popupData.length]);
    $('#forceFulButton').click();
    $("#nextButton").click(showNext);

    ptrHtml++;
}

function viewMore() {
    var quesId = $('#questionId').attr('data');

    $.ajax({
        url: "/getMore?questionId=" + quesId,
        success: function(result) {
            if (result.type == 'answers') {
                $("#addMore").append(result);
            } else if (result.type == 'questions') {
                popupData = result.data;
                showPopup(result.data);
            }
        }
    });
}
var ptrHtml = 0;

function submitAns() {
    var quesId = $('#questionIdMain').attr('data');
    var value = $('#answer').val();
    console.log(this);
    $.ajax({
        url: "/save-answer?userId=1&questionId=" + quesId + "&answer=" + value,
        success: function(result) {
            showNext();
        }
    });

}

function showPopup(data) {
    $('#popupArea').html(data[0]);
    $('#forceFulButton').click();
    $("#nextButton").click(showNext);
    $("#submitButton").click(submitAns);


    ptrHtml++;

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
