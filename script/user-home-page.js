var constants = require('script/constants').constants();
var startPage = require('script/start-page');

var loader = function () {
	$.ajax('../html/user-home-page.html', {
		type: 'GET',
		timeout: 5000,
		contentType: 'text/html',
		success: function (response) {
			$('#wrapper').empty();
			$('#wrapper').append(response);
			$('#user-home-page').hide();
			$('#user-home-page').fadeIn(constants.FADEIN_TIME);

			loadAlbums();
		},
		error: function (error) {
			console.log(error.message);
		}
	})

	function loadAlbums() {
		var user = Parse.User.current();
		var relation = user.relation("albums");
		var query = relation.query();
		// query.equalTo("id", user.id);
		query.find({
			success: function (list) {
				// list contains all albums of the current user
				var $albumsContainer = getAlbumsContainer(list);
				
				$('nav#navigation').append($albumsContainer);
			}
		});
	}

	function getAlbumsContainer(albums) {
		var numberOfAlbums = albums.length;
		var $albumsContainer = $('<ul>');
		$albumsContainer.attr('id', 'albums-list');

		for (var i = 0; i < numberOfAlbums; i++) {
			var $albumBox = $('<li>');
			$albumBox.html(albums[i].get('title'));
			$albumsContainer.append($albumBox);
		}
		
		return $albumsContainer;
	}
}

module.exports.loader = loader;