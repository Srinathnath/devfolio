$(function() {
	$('.avatar-container').hover(function() {
		$('.edit-avatar').fadeIn({ duration: 100 });
	});

	$('.avatar-container').mouseleave(function() {
		$('.edit-avatar').fadeOut({ duration: 100 });
	});

	$('.edit-avatar').click(function() {
		
	});
});