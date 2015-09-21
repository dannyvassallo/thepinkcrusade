// $(function(){
// 	$('#the-wrap').css('height', window.innerHeight);
// });

// $(window).resize(function(){
// 	if(window.height() )
// 	$('#the-wrap').css('min-height', window.innerHeight);
// });
function iOS() {

  var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
  ];

  while (iDevices.length) {
    if (navigator.platform === iDevices.pop()){ return true; }
  }

  return false;
}


$(function(){	
	if ( $('.datepicker').prop('type') != 'date' ) {
	    $('.datepicker').datepicker();
	};
	$('#info').on('shown', function () {
		// alert('open')
		if (iOS()){
			$('.datepicker').css('background-color','#ccc !important');
			// alert('true');
		} else {
			// alert('false');
		}
	});
});