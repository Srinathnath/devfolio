function updatePreview(coords) {
	
}

$(function() {

	// Edit avatar
	$('.avatar-container').hover(function() {
		$('.edit-avatar').fadeIn({ duration: 100 });
	});

	$('.avatar-container').mouseleave(function() {
		$('.edit-avatar').fadeOut({ duration: 100 });
	});

	$('.edit-avatar').click(function() {
		event.preventDefault();
		$('#edit-avatar-modal').modal();
	});

	$('.submit-avatar').click(function() {
		if (!$('.submit-avatar-form input[name="tmpUrl"]').val().length)
			$('#edit-avatar-modal').modal('hide');
		else {
			$('.submit-avatar-form').submit();
		}
	});

	var boundx,
		boundy;

	$('.avatar-upload').fileupload({
		dataType: 'json',
		add: function(e, data) {
			data.context = $('<p/>').text('Uploading').appendTo(this);
			data.submit();
		},
		done: function(e, data) {
			var actualwidth = data.result.width;
			var actualheight = data.result.height;
			var crop = document.createElement('img');
			crop.src = data.result.path;
			crop.id = 'avatar-to-crop';
			$('.submit-avatar-form input[name="tmpUrl"]').val(data.result.path);
		
			$('.avatar-upload-container').html(crop);
			$('.avatar-upload-container').prepend('<h3>Click and Drag to Crop Your Image');
			$('#preview-container').html('<img src="'+crop.src+'" class="avatar-preview">');
			$('.avatar-preview').attr('class', 'avatar-previewing');

			$('#avatar-to-crop').Jcrop({
				onChange: updatePreview,
				onSelect: updatePreview,
				aspectRatio: 1
			}, function() {
				var bounds = this.getBounds();
				boundx = bounds[0];
				boundy = bounds[1];
				$('.submit-avatar-form input[name="currwidth"]').val(boundx);
				$('.submit-avatar-form input[name="currheight"]').val(boundy);
			});
		}
	});

	function updatePreview(c) {
		if (parseInt(c.w) > 0) {
			$('.submit-avatar-form input[name="xoffset"]').val(c.x);
			$('.submit-avatar-form input[name="yoffset"]').val(c.y);
			$('.submit-avatar-form input[name="newwidth"]').val(c.w);
			$('.submit-avatar-form input[name="newheight"]').val(c.h);

			var rx = $('#preview-container').width() / c.w;
			var ry = $('#preview-container').height() / c.h;

			$('.avatar-previewing').css({
				width: Math.round(rx * boundx) + 'px',
				height: Math.round(ry * boundy) + 'px',
				marginLeft: '-' + Math.round(rx * c.x) + 'px',
				marginTop: '-' + Math.round(ry * c.y) + 'px'
			});
		}
	}

	// Edit profile description
	$('.profile-description-container').hover(function() {
		$('.edit-profile-description').fadeIn({ duration: 100 });
	});

	$('.profile-description-container').mouseleave(function() {
		$('.edit-profile-description').fadeOut({ duration: 100 });
	});

	$('.edit-profile-description, .no-description').click(function(event) {
		event.preventDefault();
		$('#edit-profile-description-modal').modal();
	});

	$('.submit-profile-description').click(function() {
		var url = $('.edit-profile-description-form').attr('action');
		var data = { description: $('.edit-profile-description-form textarea').val() };
		$.post(url, data, function(user) {
			$('#edit-profile-description-modal').modal('hide');
			window.location.reload();
		}, 'json');
	});

	// Edit social
	$('.social-container').hover(function() {
		$('.edit-social').fadeIn({ duration: 100 });
	});

	$('.social-container').mouseleave(function() {
		$('.edit-social').fadeOut({ duration: 100 });
	});

	$('.edit-social, .no-social').click(function() {
		event.preventDefault();
		$('#edit-social-modal').modal();
	});

	$('.submit-social').click(function() {
		var url = $('.edit-social-form').attr('action');
		var data = {
			social: {
				email: {
					display: $('#social-email-switch').bootstrapSwitch('status')
				},
				github: {
					display: $('#social-github-switch').bootstrapSwitch('status'),
					url: $('#social-github-url').val()
				},
				twitter: {
					display: $('#social-twitter-switch').bootstrapSwitch('status'),
					url: $('#social-twitter-url').val()
				},
				linkedin: {
					display: $('#social-linkedin-switch').bootstrapSwitch('status'),
					url: $('#social-linkedin-url').val()
				}
			}
		};

		$.post(url, data, function(user) {
			$('#edit-profile-description-modal').modal('hide');
			window.location.reload();
		}, 'json');
	});

	$('.project-list').sortable({items: ".project"});

	$('.new-project-link').click(function() {
		//TODO Implement
		return false;
	});

});