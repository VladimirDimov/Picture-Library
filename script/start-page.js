var constants = require('../script/constants').constants();
var registrator = require('../script/register');
var login = require('../script/login');
var q = require('../node_modules/q/q.js');
var userUpdate = require('../script/update-user');
var userHomePage = require('../script/user-home-page');

var loadStartPage = function() {
	$('#wrapper').empty();

	userUpdate.updateCurrentUser();

	appendEventsToButtons();

	updateHiddenItems();

	if (Parse.User.current()) {
		userHomePage.loader('#wrapper');
		return;
	}

	function updateHiddenItems() {
		$('#add-new-album').hide();
	}

	function appendEventsToButtons() {
		$('#button-register-dialog').on('click', function() {
			registrator.registrator().loadPage();
		});

		$('#button-login-dialog').on('click', function() {
			login.login().loadPage();
		});

		$('#button-logout').on('click', function() {
			q.fcall(Parse.User.logOut)
				.then(loadStartPage)
				.done();
		});
	}
};

loadStartPage();

module.exports.loadStartPage = loadStartPage;