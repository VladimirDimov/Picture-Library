var handlebars = require('node_modules/handlebars/dist/handlebars.js');
var q = require('node_modules/q/q.js');
require('script/lightbox.js');

function loader(album) {
	$.ajax('../html/album-content.html', {
		type: 'GET',
		timeout: 5000,
		contentType: 'text/html',
		success: function (response) {
			$('#album-container').empty();

			$('#album-container').append(response);
			$('h1').html(album.get('title'));
			$('#album-description').html(album.get('description'));

			getImages(album);
		},
		error: function (error) {
			throw new Error('Unable to find html file: album-content.html');
		}
	}).then(appendEventhandlers);

	function appendEventhandlers() {
		$('#btn-upload-image').click(function () {

			var fileElement = $('#btn-add-image')[0];
			var filePath = $('#btn-add-image').val();
			var fileName = filePath.split('\\').pop();

			if (fileElement.files.length > 0) {
				var file = fileElement.files[0];

				var newFile = new Parse.File(fileName, file);
				newFile.save({
					success: function () {
						console.log('File successfully uploaded!');
					},
					error: function (err) {
						console.log(err.message);
					}
				}).then(function (uploadedFile) {
					var Image = Parse.Object.extend('Image');
					var newImage = new Image();
					var imageTitle = fileName.split('.')[0];
					newImage.set('album', album);
					newImage.set('title', imageTitle);
					newImage.set('file', uploadedFile);
					newImage.save({
						success: function () {
							console.log('File successfully uploaded!');
							var relation = album.relation('images');
							relation.add(newImage);
							album.save({
								success: function () {
									$('#thumbnails-container').empty();
									getImages(album);
								}
							});
						},
						error: function (err) {
							console.log(err.message);
						}
					});
				});
			}
		});
	}

	function getAlbumById(id) {
		var Album = Parse.Object.extend("Album");
		var query = new Parse.Query(Album);

		query.equalTo("objectId", id);

		query.first({
			success: function (result) {
				return result;
			},
			error: function (object, error) {
				console.log(error, message);
			}
		});
	}

	function getImages(album) {
		var relation = album.relation("images");
		var query = relation.query();

		query.find({
			success: function (list) {
				// list contains all images of the current album
				appendImagesToContainer(list);
			}
		});
	}

	function appendImagesToContainer(images) {
		var source = $('#thumbnail').html();
		var template = handlebars.compile(source);
		images = images.map(function (item) {
			var modifiedItem = {};
			modifiedItem.location = item._serverData.file.url();
			modifiedItem.title = item._serverData.title;
			modifiedItem.objectId = item.id;
			return modifiedItem;
		});
		var data = {};
		data.images = images;
		$('#thumbnails-container').empty();
		$('#thumbnails-container').append(template(data));
		appendHandlersToDeleteImageButtons();
	}

	function appendHandlersToDeleteImageButtons() {
		$('.delete-image').click(function (ev) {
			ev.stopPropagation();
			var $target = $(ev.target);
			$target.next().fadeIn(1000);
		});

		$('.delete-image-cancel').click(function (ev) {
			var $target = $(ev.target);
			$target.parent().fadeOut(500);
		});

		$('.delete-image-yes').click(function (ev) {
			var $target = $(ev.target);
			var imageId = $target.parent().next().attr('objectId');

			var Image = Parse.Object.extend("Image");
			var query = new Parse.Query(Image);
			query.select("objectId", imageId);
			query.find().then(function (results) {
				var imageToDelete = results[0];

				imageToDelete.destroy({
					success: function () {
						q.fcall(function () {
							var relation = album.relation("images");
							relation.remove(imageToDelete);
							album.save();
						}).then(function () {
							getImages(album);
						}).done();


					},
					error: function (err) {
						throw new Error('Could not delete image');
					}
				});


			});
		});
	}
}

module.exports.loader = loader;