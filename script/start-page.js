var constants = require('script/constants').constants();
var registrator = require('script/register');
var login = require('script/login');
var q = require('node_modules/q/q.js');
var userUpdate = require('script/update-user');
var userHomePage = require('script/user-home-page');

var loadStartPage = function () {
	$('#wrapper').empty();
	
	userUpdate.updateCurrentUser();
	
	appendEventsToButtons();
	
	if (Parse.User.current()) {
		userHomePage.loader();
		return;
	}

	// $.ajax('../html/start-page.html', {
	// 	type: 'GET',
	// 	timeout: 5000,
	// 	contentType: 'text/html',
	// 	success: function (response) {
	// 		$('#wrapper').empty();
	// 		$('#wrapper').append(response);
	// 		$('#start-page').hide();
	// 		$('#start-page').fadeIn(constants.FADEIN_TIME);
	// 	},
	// 	error: function (err) {
	// 		console.log('Error while loading start-page window')
	// 	}
	// })
	// 	.then(appendEventsToButtons)
	// 	.then(appendEventToLogoutButton);
	

	function appendEventsToButtons() {
		$('#button-register-dialog').click(function () {
			registrator.registrator();
		});

		$('#button-login-dialog').click(function () {
			login.login();
		});

		$('#button-logout').on('click', function () {
			q.fcall(Parse.User.logOut)
				.then(loadStartPage)
				.done();
		});
	}
};

loadStartPage();

module.exports.loadStartPage = loadStartPage;