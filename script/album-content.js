

function loader(album) {
	$.ajax('../html/album-content.html', {
		type: 'GET',
		timeout: 5000,
		contentType: 'text/html',
		success: function (response) {
			$('#album-container').empty();
			$('#album-container').append(response);
		},
		error: function (error) {
			throw new Error('Unable to find html file: album-content.html');
		}
	});

	function loadImages(album) {
		var relation = album.relation("images");
		var query = relation.query();
		
		query.find({
			success: function (list) {
				// list contains all images of the current album
				debugger;
			}
		});
	}
}

module.exports.loader = loader;