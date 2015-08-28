var constants = require('script/constants').constants();
var startPage = require('script/start-page');
var validator = require('script/validator').validator;

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
	}).then(addEventsToButtons);

	function addEventsToButtons() {
		$('#add-album').click(function () {
			var addAlbumContainer = $('#add-album-container');
			if (addAlbumContainer.length === 0) {
				$.ajax('../html/add-album.html', {
					type: 'GET',
					timeout: 5000,
					contextType: 'text/html',
					success: function (response) {
						$('#wrapper').append(response);
						appendEventsToAddAlbumButtons();
					},
					error: function (error) {
						console.log(error.message);
						return;
					}
				});
			}
			else {
				addAlbumContainer.fadeIn(constants.FADEIN_TIME);
			}
		});
	}

	function appendEventsToAddAlbumButtons() {
		var $container = $('#add-album-container');
		$('#add-album-container #button-add').click(function (event) {
			event.preventDefault();
			var title = $('#add-album-container #title').val();
			var description = $('#add-album-container #description').val();
			createNewAlbum(title, description, Parse.User.current());
			$container.fadeOut(constants.FADEOUT_TIME);
			loadAlbums();
		});

		$('#add-album-container #button-cancel').click(function (event) {
			event.preventDefault();
			console.log('cancel');

			$container.fadeOut(constants.FADEOUT_TIME);
		});
	}

	function createNewAlbum(title, description, owner) {
		validator.validateStringLength(title, constants.ALBUM_MIN_TITLE_LENGTH, constants.ALBUM_MAX_TITLE_LENGTH);
		validator.validateStringLength(description, constants.ALBUM_MIN_DESCRIPTION_LENGTH, constants.ALBUM_MAX_DESCRIPTION_LENGTH);

		var Album = Parse.Object.extend('Album');
		var newAlbum = new Album();
		newAlbum.set('title', title);
		newAlbum.set('description', description);
		newAlbum.set('owner', owner);

		newAlbum.save({
			success: function () {
				var relation = owner.relation("albums");
				relation.add(newAlbum);
				owner.save();
				console.log('Album successfuly saved.');
				loadAlbums();
			},
			error: function (error) {
				console.log(error.message);
			}
		});
	}

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
		var $albumsContainer = $('#albums-list');
		$albumsContainer.empty();

		for (var i = 0; i < numberOfAlbums; i++) {
			var $albumBox = $('<li>');
			$albumBox.html(albums[i].get('title'));
			$albumsContainer.append($albumBox);
		}

		return $albumsContainer;
	}
}

module.exports.loader = loader;