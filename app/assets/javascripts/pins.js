// $(function(){
// 	$('#the-wrap').css('height', window.innerHeight);
// });

// $(window).resize(function(){
// 	if(window.height() )
// 	$('#the-wrap').css('min-height', window.innerHeight);
// });

if (datefield.type!="date"){ //if browser doesn't support input type="date", initialize date picker widget:
   jQuery(function($){ //on document.ready
       $('.datepicker').datepicker();
   })
}