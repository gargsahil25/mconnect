$("#question").keyup(getQuestions);
$(".question-page").click(redirectToQuesPage);
$("#ask-question").click(saveQuestion);
$("#viewMore").click(viewMore);
$(".buttonLike").click(incrementLikeCount);
$(".buttonDislike").click(incrementDislikeCount);

var popupData;

function incrementLikeCount() {
    console.log(this);
    third(this, 1);
}

function incrementDislikeCount() {
    console.log(this);
    third(this, 0);

}

function third(e, isLike) {
    var obj = e.parentElement.dataset;
    answerId = obj.answerid;
    if (!($(e).hasClass('active'))) {
        $.ajax({
            url: "/rate-answer?userId=1&answerId=" + obj.answerid + "&isLike=" + isLike,
            success: function(result) {
                var len = $(e.parentElement).find('.active').length;
                if (isLike) {
                    var likeCount = $(e.parentElement).find('.isLike').html()
                    $(e.parentElement).find('.isLike').html(++likeCount);
                    $(e).addClass('active');

                    if (len) {
                        $(e.parentElement).find('.buttonDislike').removeClass('active');
                        var dislikeCount = $(e.parentElement).find('.isDislike').html()
                        $(e.parentElement).find('.isDislike').html(--dislikeCount);
                    }

                } else {
                    var dislikeCount = $(e.parentElement).find('.isDislike').html()
                    $(e.parentElement).find('.isDislike').html(++dislikeCount);
                    $(e).addClass('active');

                    if (len) {
                        $(e.parentElement).find('.buttonLike').removeClass('active');
                        var likeCount = $(e.parentElement).find('.isLike').html()
                        $(e.parentElement).find('.isLike').html(--likeCount);
                    }
                    // $(e.parentElement).find('.buttonLike').removeClass('active');

                }
            }
        });
    }

}

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
                $(".buttonLike").click(incrementLikeCount);
                $(".buttonDislike").click(incrementDislikeCount);
                $("#addMore").append(result.data);
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
