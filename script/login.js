var constants = require('script/constants').constants();
var startPage = require('script/start-page');
var userHomePage = require('script/user-home-page');

var login = function() {
	$.ajax('../html/login.html', {
			type: 'GET',
			timeout: 5000,
			contentType: 'text/html',
			success: function(response) {
				$('#wrapper')
					.empty()
					.append(response);
				$('#login-container')
					.hide()
					.fadeIn(constants.FADEIN_TIME);
			},
			error: function(error) {
				console.log(error.message);
			}
		})
		.then(appendEventsToButtons);

	function appendEventsToButtons() {
		$('#button-back').click(function() {
			$('#login-container')
				.fadeOut(constants.FADEOUT_TIME, startPage.loadStartPage);
		});

		$('#button-login').click(function() {
			var name = $('#username').val();
			var password = $('#password').val();

			var user = new Parse.User();

			Parse.User.logIn(name, password, {
				success: function(user) {
					console.log('Successful logIn');
					// $('#login-container').fadeOut(constants.FADEOUT_TIME, userHomePage.loader);
				},
				error: function(user, error) {
					console.log('Error: ' + error.message);
				}
			});
		});
	}
}

module.exports.login = login;