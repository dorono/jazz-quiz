var jsonSrc = 'json/questions.json',
correctMsg = 'Woo-hoo, correct!',
incorrectMsg = 'Oops-a-daisy, incorrect!',
successMessageUnder26 = 'Hmm...yeah, ok. Do you even know what jazz <em>is</em>?',
successMessageUnder50 = 'OK, I guess you know <em>something</em>, but you really should check out some more stuff.',
successMessageUnder75 = "Alright, we're getting somewhere. Keep at it!",
successMessageOver75 = 'Well done, my friend, you are definitely <em>not</em> jive.',
successMessage100 = 'OOH-BOP SHA-BAM, a perfect performance!',
jsonData,
questionIndex = 0,
totalScore = 0,
numQuestions,
correctAns,
percentage,
successMessage;

$(document).ready(function () {

  // load up the first question upon page load
  Quiz.getCards(jsonSrc);

});
