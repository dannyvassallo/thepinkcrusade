// $(function(){
// 	$('#the-wrap').css('height', window.innerHeight);
// });

// $(window).resize(function(){
// 	if(window.height() )
// 	$('#the-wrap').css('min-height', window.innerHeight);
// });

$(function(){
	if ( $('.datepicker').prop('type') != 'date' ) {
	    $('.datepicker').datepicker();
	}
});