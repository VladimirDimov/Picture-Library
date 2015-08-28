var constants = require('script/constants').constants();
var loader = require('script/start-page');

var registrator = function() {
	$.ajax('../html/register.html', {
		type: 'GET',
		timeout: 5000,
		contentType: 'text/html',
		success: function(response) {
			$('#wrapper').empty();
			$('#wrapper').append(response);
			$('#register-container').hide();
			$('#register-container').fadeIn(constants.FADEIN_TIME);
		},
		error: function(err) {
			console.log('Error while loading register window')
		}
	}).then(appendEvents);

	function appendEvents() {
		$('#button-register').click(function() {
			var userToRegister = new Parse.User();

			userToRegister.set('username', $('#username').val());
			userToRegister.set('password', $('#password-first').val());

			userToRegister.signUp(null, {
				success: function(user) {
					console.log('User successfully registered!');
				},
				error: function(user, error) {
					console.log('Error: ' + error.message);
				}
			});
		});

		$('#button-back').click(function() {
			$('#register-container')
				.fadeOut(constants.FADEOUT_TIME, loader.loadStartPage);
		});
	}
};

module.exports.registrator = registrator;