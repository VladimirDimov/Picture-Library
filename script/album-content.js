var handlebars = require('node_modules/handlebars/dist/handlebars.js');
var q = require('node_modules/q/q.js');

function loader(album) {	
	$.ajax('../html/album-content.html', {
		type: 'GET',
		timeout: 5000,
		contentType: 'text/html',
		success: function (response) {
			$('#album-container').empty();

			$('#album-container').append(response);
			$('h1').html(album.get('title'));

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

				var Image = Parse.Object.extend('Image');
				var newImage = new Image();
				newImage.set('album', album);

				var newFile = new Parse.File(fileName, file);
				newFile.save({
					success: function () {
						console.log('File successfully uploaded!');
					},
					error: function (err) {
						console.log(err.message);
					}
				}).then(function (uploadedFile) {
					newImage.set('file', uploadedFile);
					newImage.save({
						success: function () {
							console.log('File successfully uploaded!');
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
			return modifiedItem;
		});
		var data = {};
		data.images = images;
		$('#thumbnails-container').append(template(data));
	}
}

module.exports.loader = loader;