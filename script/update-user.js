function updateCurrentUser() {
	var currentUser = Parse.User.current();
	if (currentUser) {
		$('header #current-user').html(currentUser.attributes.username);
	} else {
		$('header #current-user').html('No logged user');
	}
}

updateCurrentUser();
	
module.exports.updateCurrentUser = updateCurrentUser;