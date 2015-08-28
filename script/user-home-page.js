var constants = require('script/constants').constants();
var startPage = require('script/start-page');

var loader = function(){
	$.ajax('../html/user-home-page.html', {
		type: 'GET',
		timeout: 5000,
		contentType: 'text/html',
		success: function(response){
			$('#wrapper').empty();
			$('#wrapper').append(response);
			$('#user-home-page').hide();
			$('#user-home-page').fadeIn(constants.FADEIN_TIME);
		},
		error: function(error){
			console.log(error.message);
		}
	})
}

module.exports.loader = loader;