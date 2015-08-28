var constants = require('script/constants').constants();
var registrator = require('script/register');
var login = require('script/login');

var loadStartPage = function() {
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
	}).then(appendEventsToButtons);

	function appendEventsToButtons() {
		$('#button-register').click(function() {
			$('#start-page').fadeOut(constants.FADEOUT_TIME, registrator.registrator);
		});

		$('#button-login').click(function() {
			$('#start-page')
				.fadeOut(constants.FADEOUT_TIME, login.login);
		});
	}
};

loadStartPage();

module.exports.loadStartPage = loadStartPage;