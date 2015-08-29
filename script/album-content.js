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
			
			getImages(album);

		},
		error: function (error) {
			throw new Error('Unable to find html file: album-content.html');
		}
	});

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
		images = images.map(function(item){
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