$(function() {
	// Edit avatar
	$('.avatar-container').hover(function() {
		$('.edit-avatar').fadeIn({ duration: 100 });
	});

	$('.avatar-container').mouseleave(function() {
		$('.edit-avatar').fadeOut({ duration: 100 });
	});

	$('.edit-avatar').click(function() {
		//TODO Implement
		return false;
	});

	// Edit profile description
	$('.profile-description-container').hover(function() {
		$('.edit-profile-description').fadeIn({ duration: 100 });
	});

	$('.profile-description-container').mouseleave(function() {
		$('.edit-profile-description').fadeOut({ duration: 100 });
	});

	$('.edit-profile-description').click(function() {
		$('#edit-profile-description-modal').modal({ 
			backdrop: true,
			keyboard: true,
			show: true 
		});
	});

	$('.submit-profile-description').click(function() {
		var url = $('.edit-profile-description-form').attr('action');
		var desc = $('.edit-profile-description-form textarea').val();
		var data = { description: desc };
		$.post(url, data, function(user) {
			$('.profile-description-container p').html(user.description);
			$('#edit-profile-description-modal').modal('hide');
		}, 'json');
	});

	// Edit social
	$('.social-container').hover(function() {
		$('.edit-social').fadeIn({ duration: 100 });
	});

	$('.social-container').mouseleave(function() {
		$('.edit-social').fadeOut({ duration: 100 });
	});

	$('.edit-social').click(function() {
		// TODO Implement
		return false;
	})

	$('.project-list').sortable({items: ".project"});

	$('.new-project-link').click(function() {
		//TODO Implement
		return false;
	});

});