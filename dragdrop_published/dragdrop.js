// Building a complex drag-drop interaction in captivate/javascript
// Steven Warwick (c) 2017  eLearningOcean LLC.

if (!knowledge_points) {

	function notifyRedacted() {
		resultDialog = new cp.RuntimeMessageBox(document.getElementById("cpDocument"), 1)
		resultDialog.registerFirstButtonHandler(() => resultDialog.hide() );
		resultDialog.m_textFontName = 'verdana';
		resultDialog.m_foregroundFillColor = "#ebebeb";
		resultDialog.m_buttonFillColor = "#4a8e9e";
		resultDialog.m_separatorColor = "#2a2a2a";
		resultDialog.m_titleText = "Redacted Formulas";
		resultDialog.m_messageText = "note - formulas for this interaction have been redacted so interaction will not execute correctly";
		resultDialog.show()
		return;
	};

	notifyRedacted();

	// -----------------------------   data for this quiz is proprietary ---------------------------

	var knowledge_points = {
		'qil': 10,
		'MDdisease': 10,
		'rnSup': 10,
		'HKSup': 10,
		'pharm': 10,
		'resMD': 10,
		'RNInfect': 10,
		'rncicu': 10,
		'CMO': 10,
		'Lab': 10,
		'Patient': 10,
		'clerk': 10,
		'budget': 10,
		'SocialW': 10,
		'IT': 10,
		'hrSup': 10,

	}

	var team_points = [10, 10, 10,
		10, 10, 10, 10, 10,
		10, 10, 10, 10, 10,
		10, 10, 10, 10];

	var teamGoodScore = 10;
	var skillGoodScore = 10;
	var totalGoodScore = 1000;

	// -----------------------------   data for this quiz is proprietary ---------------------------


	var game1BadColor = "#AE0000";
	var game1GoodColor = "#40B620";
	var game1NeutralColor = "rgb(32, 117, 138)";

	// initialize the background colors

	$('#teamBoxc , #skillBoxc, #totalBoxc').css('transition-duration', "0.5s").css('border-radius', '5px')
	$('#teamBoxc , #skillBoxc, #totalBoxc').css('background', game1NeutralColor);
	$('#teamBoxc , #skillBoxc, #totalBoxc').css('border', "2px white solid");

	function setCss() {

		//  Method of changing color of object using score information.
		//  Hue/Saturation/Luminosity is used to create color map


		/* hsl red to green nice color range:
		H goes from 0 to 110   (red-->green)
		S is 100%
		L is 25%
		A is 1
		 */

		let hslMax = 110;

		let teamHSL = "hsl( " + (team_score / teamGoodScore) * hslMax + ",100%,25%)";
		let skillHSL = "hsl( " + (skill_score / skillGoodScore) * hslMax + ",100%,25%)";
		let totalHSL = "hsl( " + (total_score / totalGoodScore) * hslMax + ",100%,25%)";

		$('#teamBoxc').css('background', teamHSL);
		$('#skillBoxc').css('background', skillHSL);
		$('#totalBoxc').css('background', totalHSL);

		return;

	}

	setCss(); // init values


	// a call to this is added to interaction in drop target
	function game1drop() {

		// this undocumented set of functions reports who was dropped last!
		let iact = cp.DD.CurrInteractionManager.getActiveInteraction();
		current_target = iact.m_DsFrameSetDataID;

		// determine scoring based on number of team members
		team_count += 1;
		team_score = team_points[team_count];

		// determine knowledge diversity based on knowledge weight of team members
		skill_score += knowledge_points[current_target];

		// add these two for total score
		total_score = skill_score + team_score;

		// give real time feedback using color and value
		setCss();

	}

	var iact,
	resultDialog;

	// attached to buttons
	function game1Buttons(btype) {

		//find who got moved last
		iact = cp.DD.CurrInteractionManager.getActiveInteraction();
		current_target = iact.m_DsFrameSetDataID;

		if (btype == 'reset') {
			team_count = 0;
			skill_score = 0;
			team_score = team_points[team_count];
			total_score = 0;
			setCss();
			iact.OnResetButtonClicked();
			return;
		}

		if (btype == 'undo') {

			if (!iact.undoAvailable) {
				return;
			}
			team_count -= 1
			team_score = team_points[team_count];
			skill_score -= knowledge_points[current_target];
			total_score = skill_score + team_score;
			setCss();
			iact.OnUndoButtonClicked();
			return;
		}

		if (btype == 'continue') {
			iact.OnSubmitButtonClicked();

			cpAPIInterface.next();

			return;
		}

		if (btype == 'submit') {

			// report feedback
			resultDialog = new cp.RuntimeMessageBox(document.getElementById("cpDocument"), 1)

				resultDialog.registerFirstButtonHandler(afterGame1Reporting);

			resultDialog.m_textFontName = 'verdana';
			resultDialog.m_foregroundFillColor = "#ebebeb";
			resultDialog.m_buttonFillColor = "#4a8e9e";
			resultDialog.m_separatorColor = "#2a2a2a";

			/*

			// other parameters for result dialog


			resultDialog.m_foregroundFillColor = c;
			resultDialog.m_foregroundStrokeColor = d;
			resultDialog.m_buttonFillColor = e;
			resultDialog.m_buttonStrokeColor = f;
			resultDialog.m_separatorColor = g;
			resultDialog.m_textColor = h;
			resultDialog.m_textShadowColor = i;

			resultDialog.TITLE_DEFAULT_TOP_OFFSET =
			resultDialog.TITLE_DEFAULT_LEFT_OFFSET = 10;

			resultDialog.SEPARATOR_DEFAULT_LEFT_OFFSET =
			resultDialog.SEPARATOR_DEFAULT_TOP_OFFSET = 20;

			resultDialog.MESSAGE_DEFAULT_LEFT_OFFSET =
			resultDialog.MESSAGE_DEFAULT_TOP_OFFSET = 30;

			resultDialog.BG_DEFAULT_WIDTH = 493;
			resultDialog.BG_DEFAULT_HEIGHT = 219;

			resultDialog.FG_DEFAULT_WIDTH = 478;
			resultDialog.FG_DEFAULT_HEIGHT = 198;

			resultDialog.BUTTON_BOTTOM_OFFSET = 10;
			resultDialog.BUTTON_DEFAULT_WIDTH = 100;
			resultDialog.BUTTON_DEFAULT_HEIGHT = 33;
			resultDialog.INTER_BUTTON_OFFSET = 15

			 */

			if (total_score == 1000) {
				resultDialog.m_titleText = "Great Job!! (100%)";
				resultDialog.m_messageText = "You REALLY KNOW how to pick a team!";
				resultDialog.show()
				return;
			}

			let scorePct = Math.round(100 * total_score / 1000) + "%";
			if (total_score > 850) {
				resultDialog.m_titleText = "Very Good! (" + scorePct + ")";
			} else if (total_score > 650) {
				resultDialog.m_titleText = "Needs Work (" + scorePct + ")";
			} else {
				resultDialog.m_titleText = "Try Again (" + scorePct + ")";
			}

			let teamMessage = "You may have picked too many or too few members in your team";
			let skillMessage = "You could improve the skills diversity in your team";

			if (team_score == teamGoodScore) {
				teamMessage = "You picked a team with an optimal number of members"
			};

			if (skill_score == skillGoodScore) {
				skillMessage = "You picked a team with a diverse and relevant set of skills"
			} else {
				if (skill_score > 429) {
					skillMessage = "A few of your team members are helpful, but not the best"
				}
			}

			resultDialog.m_messageText = teamMessage + "<br><br>" + skillMessage;
			resultDialog.show()
			return;

		}

		console.log('should not get here');

	}

	function afterGame1Reporting() {

		// reveal next game button
		cp.show('game1continue');

		resultDialog.hide();

	}

	//  dealing with fullscreen  button

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
