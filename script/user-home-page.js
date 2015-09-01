var constants = require('script/constants').constants();
var startPage = require('script/start-page');
var validator = require('script/validator').validator;
var loadAlbumContent = require('script/album-content');
var q = require('node_modules/q/q.js');

var loader = function (selector) {
	var currentUser = Parse.User.current();

	$.ajax('../html/user-home-page.html', {
		type: 'GET',
		timeout: 5000,
		contentType: 'text/html',
		success: function (response) {
			$(selector).empty();
			$(selector).append(response);

			$('#user-home-page').hide();
			$('#user-home-page').fadeIn(constants.FADEIN_TIME);
			$('#current-user').html('User: ' + currentUser._serverData.username);

			showHiddenItems();
			loadAlbums();
		},
		error: function (error) {
			console.log(error.message);
		}
	}).then(addEventsToButtons);

	function addEventsToButtons() {
		$('#add-new-album').click(function () {
			$('#add-album-container').fadeIn(constants.FADEIN_TIME);
		});

		appendEventsToAddAlbumButtons();
	}

	function showHiddenItems() {
		$('#add-new-album').show();
	}

	function appendEventsToAddAlbumButtons() {
		var $container = $('#add-album-container');
		$('#add-album-container #button-add').click(function (event) {
			event.preventDefault();
			var title = $('#add-album-container #title').val();
			var description = $('#add-album-container #description').val();
			createNewAlbum(title, description, Parse.User.current());
			$container.fadeOut(constants.FADEOUT_TIME);
			loader();
		});

		$('#add-album-container #button-cancel').click(function (event) {
			event.preventDefault();
			console.log('cancel');

			$container.fadeOut(constants.FADEOUT_TIME);
		});

		$('#toggle-albums').click(function (event) {
			$('#albums-container').toggle(1000);
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
				loadAlbums();
				console.log('Album successfuly saved.');
			},
			error: function (error) {
				console.log(error.message);
			}
		});
	}

	var userToAlbumsRelation = currentUser.relation("albums");
	var userToAlbumsQuery = userToAlbumsRelation.query();
	var userAlbums;

	function updateAlbumsDataBase() {
		var d = q.defer();
		userToAlbumsQuery.find({
			success: function (list) {
				// list contains all albums of the current user
				userAlbums = list;
				d.resolve(list);
			}
		});
		return d.promise;
	}

	function loadAlbums() {
		updateAlbumsDataBase();
		userToAlbumsQuery.find({
			success: function (list) {
				// list contains all albums of the current user
				
				var $albumsContainer;
				q.fcall(updateAlbumsDataBase).then(function (promiseedValue) {
					$albumsContainer = getAlbumsContainer(userAlbums);
				}).then(function (promise) {
					$('#albums-container').empty();
					$('#albums-container').append($albumsContainer);
				})
				
				$('#toggle-albums').unbind();
				$('#toggle-albums').click(function (event) {
					$('#albums-container').toggle(1000);
				});
			}
		});
	}

	function getAlbumsContainer(albums) {
		var numberOfAlbums = albums.length;
		var $albumsContainer = $('<div>');
		$albumsContainer.empty();

		for (var i = 0; i < numberOfAlbums; i++) {
			var $albumBox = $('<button>');
			$albumBox.addClass('list-group-item');
			$albumBox.html(albums[i].get('title'));
			$albumBox.attr('data', albums[i].id);
			$albumsContainer.append($albumBox);

			$albumBox.click(function (ev) {
				var albumId = $(this).attr('data');
				var selectedAlbum = userAlbums.filter(function (item) {
					return item.id === albumId;
				})[0];

				sessionStorage.setItem('selectedAlbum', selectedAlbum.id);

				loadAlbumContent.loader(selectedAlbum).loadPage();

				$('#albums-container').toggle(1000);
			});
		}

		return $albumsContainer;
	}
}

module.exports.loader = loader;