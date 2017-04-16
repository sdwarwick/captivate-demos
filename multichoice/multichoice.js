if (!mylib_loaded) {

	console.log("loaded");
	var mylib_loaded  = true

	$('div[id^="Question"].cp-frameset').on("click", manageToggleButtons);

		
	function manageToggleButtons(clickedButtonObject) {

		// get shpe id of the clicked button,  this will be "selected"
		var targetID = clickedButtonObject.target.id;   

		// create the name of the button you need to toggle to "unselected"
		if ( targetID.match(/_T_/) ) {
			var invTargetID = targetID.replace(/_T_/, "_F_") 
		} 
		
		if ( targetID.match(/_F_/) ) {
			invTargetID = targetID.replace(/_F_/, "_T_") 
		} 
		
		// captivate undocumented function to change state of object
		cp.changeState(targetID, "selected");
		cp.changeState(invTargetID, "Normal");
	}

		
	$('div[id^="submitButton"].cp-frameset').on("click", quizSubmit);
	
	function quizSubmit() {

		//debugger;
	
		// these are defined in captivate and used in analysis
		numberOfRightAnswers = 0;
		numberOfQuestions = 0;
		baseScore = 0;
		baseMaxScore = 0;
		bonusScore = 0;
		bonusMaxScore = 0;

		// the right answer button is selected, signal this internal button
		var theRightAnswers = {
			"Question_T_1" : "Answer_1",
			"Question_F_2" : "Answer_2",
			"Question_T_3" : "Answer_3",
			"Question_F_4" : "Answer_4",
			"Question_T_5" : "Answer_5"
		}
		
		//check each of the right answer button for state, if selected,  signal to captivate
		for (rightAnswerButton in theRightAnswers) {
			
			numberOfQuestions = numberOfQuestions +1;
			rightAnswerSenderButton = theRightAnswers[rightAnswerButton];
			
			// get quiz value for this answer - this is obscure but works
			answerObjectID = cp.D[rightAnswerSenderButton].qnq;
			answerValue = cp.D[rightAnswerSenderButton + "q" + answerObjectID].w;
			
			//add to max base score
			baseMaxScore = baseMaxScore + answerValue;
			
			
			theState = cp.getCurrentStateNameForSlideItem(rightAnswerButton);

			if (theState == "selected") {
				// undocumented function for signalling to a quiz button 
				cp.SubmitInteractions(rightAnswerSenderButton, cp.QuestionStatusEnum.CORRECT, 0)
				numberOfRightAnswers  = numberOfRightAnswers +1;
				baseScore = baseScore + answerValue;
			}

		}
		
		// add bonuses
		rightAnswerSenderButton = "Bonus_25"
		answerObjectID = cp.D[rightAnswerSenderButton].qnq;
		answerValue = cp.D[rightAnswerSenderButton + "q" + answerObjectID].w;
		bonusMaxScore = bonusMaxScore + answerValue;
		
		if (numberOfRightAnswers >= 4) {
			cp.SubmitInteractions(rightAnswerSenderButton, 
										  cp.QuestionStatusEnum.CORRECT, 0);
			bonusScore = bonusScore + answerValue;
		}
			
		rightAnswerSenderButton = "Bonus_50"
		answerObjectID = cp.D[rightAnswerSenderButton].qnq;
		answerValue = cp.D[rightAnswerSenderButton + "q" + answerObjectID].w;
		bonusMaxScore = bonusMaxScore + answerValue;
		
		if (numberOfRightAnswers == 5) {
			cp.SubmitInteractions(rightAnswerSenderButton,
										   cp.QuestionStatusEnum.CORRECT, 0);
			bonusScore = bonusScore + answerValue;
		}

		cpCmndNextSlide = 1;

	}
	
	
	function fullScreenButton() {
let j = $('[id^="fullscreen"]').on('click', function (e) {
let i = parent.document.getElementsByTagName("iframe")[0]
        if (i == null) {
            i = document.getElementById("main_container")
        }
i.requestFullScreen && i.requestFullScreen();
        i.webkitRequestFullScreen && i.webkitRequestFullScreen();
        i.mozRequestFullScreen && i.mozRequestFullScreen();
        i.msRequestFullscreen && i.msRequestFullscreen();
});
};
function cancelFullScreenButton() {
let j = $('[id^="stdscreen"]').on('click', function (e) {
let i = parent.document;
        if (i == null) {
            i = document.getElementById("main_container")
        }
i.cancelFullScreen && i.cancelFullScreen();
        i.webkitCancelFullScreen && i.webkitCancelFullScreen();
        i.mozCancelFullScreen && i.mozCancelFullScreen();
        i.exitFullscreen && i.exitFullscreen();
});
};
fullScreenButton();
cancelFullScreenButton();

	
}
