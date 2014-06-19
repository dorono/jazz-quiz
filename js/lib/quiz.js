var Quiz = Quiz || {};

$(document).ready(function () {

  // create the flash cards and display them one at a time with questions
  // coming in via JSON
  Quiz.getCards = function(jsonSrc) {
      $('next , result').hide();
      $.ajax({
          url: jsonSrc,
          dataType: 'json',
          success: function (data) {
              Quiz.buildCards(data);
          }
      });
  }

  Quiz.buildCards = function(jsonData) {
      // we'll need these two variables outside of this function
      numQuestions = jsonData.quizQuestions.length;
      correctAns = jsonData.quizQuestions[questionIndex].correctAnswer;

      // cute transition to get us between cards
      $('.flash-card').toggle("drop" , function() {
          $(this).remove();
      });

      // build the flash card
      $('.container-fluid').prepend(
          '<div class="flash-card">' +
          '<dl>' +
          '<dt>' + jsonData.quizQuestions[questionIndex].question + '</dt>' +
          '</dl>' +
          '</div>'
      );

      // generate answer option list for each question
      $.each(jsonData.quizQuestions[questionIndex].answers , function(x,indivAnswer) {
          $('.flash-card dl').append(
          '<dd>' +
          '<label>' +
          '<input type="radio" name="q_' + (questionIndex + 1) + '" value="question_' + (questionIndex + 1) + '_answers_' + (x + 1) + '">' +
          indivAnswer +
          '</label>' +
          '</dd>'
          );
      });

      // disable the prop button since the user still hasn't made a selection
      $('button').prop('disabled', true);

  };

  // Handles the scoring and messaging upon the user's answer input
  Quiz.submitAnswer = function(correctMsg,incorrectMsg) {
      // if the answer is correct
      if($('input[type="radio"]:checked').val() == correctAns) {
          totalScore++;
          $('score span').text(totalScore);
          $('result').removeClass('incorrect').addClass('correct').text(correctMsg);
      } else {
      // if the answer is incorrect
          $('.flash-card').effect('shake');
          $('result').removeClass('correct').addClass('incorrect').text(incorrectMsg);
          $('input[value="' + correctAns+ '"]').val(correctAns).parent('label').addClass('highlighted');
      }

      // once an answer has been submitted, disable the radio and submission buttons
      $('button , input').prop('disabled', true);
      $('result').show();
      if((questionIndex + 1) < numQuestions) {
          $('next').show();
      } else {
          // if this is the very last question, give it a few seconds and then display
          // the results screen
          setTimeout(function() {
              Quiz.tallyResults()
          } , 2000);
      }
      return;
  }

  // handles the computation of the score as well as displaying
  // the final summary screen
  Quiz.tallyResults = function() {
      $('.flash-card , button , result').remove();
      $('#total').show();
      $('#total h3 strong').text(totalScore);
      if(totalScore == 1) {
          $('#total plural').hide();
      }
      $('#total h3 span').text(numQuestions);
      Quiz.determinePercentage(successMessageUnder26 , successMessageUnder50 , successMessageUnder75 , successMessageOver75 , successMessage100);
      $('#total h4').html(successMessage);
      $('score').hide();
  }

  // determine the percentage of correct answers, and display appropriate
  // text summarizing the user's performance
  Quiz.determinePercentage =
  function(successMessageUnder26 , successMessageUnder50 , successMessageUnder75 , successMessageOver75 , successMessage100) {
      percentage = Math.floor(totalScore/numQuestions * 100);
      $('percentage').text(percentage + "%");
      if(percentage < 25) {
          successMessage = successMessageUnder26;
      } else if(percentage >= 25 && percentage < 50) {
          successMessage = successMessageUnder50;
      } else if(percentage >= 50 && percentage < 75) {
          successMessage = successMessageUnder75;
      } else if(percentage >= 75 && percentage < 100) {
          successMessage = successMessageOver75;
      } else {
          successMessage = successMessage100;
      }

  }

  // because the radio buttons are coming in via AJAX, we must wait until the AJAX
  // call is complete before assigning any sort of click handler to these
  $(document).ajaxSuccess(function() {
      $('input').on('click' , function() {
          $('button').prop('disabled', false);
      })
  });

  $('button').click(function() {
      Quiz.submitAnswer(correctMsg,incorrectMsg);
  });

  $('a.continue').click(function(e) {
      e.preventDefault();
      if((questionIndex + 1) >= numQuestions) {
          $('button').prop('disabled', true);
      } else {
          questionIndex++;
          Quiz.getCards(jsonSrc);
      }
  });

});
