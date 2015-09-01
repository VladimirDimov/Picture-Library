var constants = require('../script/constants').constants();
var startPage = require('../script/start-page');
var userHomePage = require('../script/user-home-page');
var userUpdate = require('../script/update-user');
var q = require('../node_modules/q/q.js');

var login = function () {

	function loadPage() {
		$('#add-new-album').hide();

		$.ajax('../html/login.html', {
			type: 'GET',
			timeout: 5000,
			contentType: 'text/html',
			success: function (response) {
				$('#wrapper')
					.empty()
					.append(response);
				$('#login-container')
					.hide()
					.fadeIn(constants.FADEIN_TIME);
			},
			error: function (error) {
				console.log(error.message);
			}
		}).then(appendEventsToButtons);
	}

	function appendEventsToButtons() {
		$('#button-back').click(function () {
			$('#login-container')
				.fadeOut(constants.FADEOUT_TIME, startPage.loadStartPage);
		});

		$('#button-login').click(function () {
			var name = $('#username').val();
			var password = $('#password').val();

			logUser(name, password);
		});
	}

	function logUser(username, password) {
		var user = new Parse.User();

		Parse.User.logIn(username, password, {
			success: function (user) {
				console.log('Successful logIn');
				$('#login-container').fadeOut(constants.FADEOUT_TIME, userHomePage.loader('#wrapper'));

			},
			error: function (user, error) {
				var $errorContainer = $('<p>');

				$('#password-input-error').show();
				$('#password-input-error').fadeOut(7000);
			}
		}).then(userUpdate.updateCurrentUser);
	}

	return {
		loadPage: loadPage,
		logUser: logUser
	}
}

module.exports.login = login;