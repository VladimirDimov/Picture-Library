var constants = require('script/constants').constants();
var registrator = require('script/register');
var login = require('script/login');
var q = require('node_modules/q/q.js');
var userUpdate = require('script/update-user');
var userHomePage = require('script/user-home-page');

var loadStartPage = function() {
	userUpdate.updateCurrentUser();
	
	if (Parse.User.current()) {
		appendEventToLogoutButton();
		userHomePage.loader();
		return;
	}
	
	$.ajax('../html/start-page.html', {
		type: 'GET',
		timeout: 5000,
		contentType: 'text/html',
		success: function(response) {
			$('#wrapper').empty();
			$('#wrapper').append(response);
			$('#start-page').hide();
			$('#start-page').fadeIn(constants.FADEIN_TIME);
		},
		error: function(err) {
			console.log('Error while loading start-page window')
		}
	})
	.then(appendEventsToButtons)
	.then(appendEventToLogoutButton);

	function appendEventsToButtons() {
		$('#button-register').click(function() {
			$('#start-page').fadeOut(constants.FADEOUT_TIME, registrator.registrator);
		});

		$('#button-login').click(function() {
			$('#start-page')
				.fadeOut(constants.FADEOUT_TIME, login.login);
		});		
	}
	
	function appendEventToLogoutButton(){
		$('#button-logout').on('click', function(){
			q.fcall(Parse.User.logOut)
			.then(loadStartPage)
			.done();
		});
	}
};

loadStartPage();

module.exports.loadStartPage = loadStartPage;