var constants = require('script/constants').constants();
var loader = require('script/start-page');

var registrator = function() {
	$('#add-new-album').hide();
	
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
			
			var passwordFirstInput = $('#password-first').val();
			var passwordSecondInput = $('#password-second').val();
			
			if (passwordFirstInput !== passwordSecondInput) {
				$('#password-input-error').show();
				$('#password-input-error').css('position', 'absolute');
				$('#password-input-error').fadeOut(7000);
				return;
			}
			
			userToRegister.set('username', $('#username').val());
			userToRegister.set('password', passwordFirstInput);

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