// fix modal
$('#info').appendTo("body");
$('#share').appendTo("body");

// INIT UNOBTRUSIVE FLASH

flashHandler = function(e, params) {
  alert(params.message);
};

$(window).bind('rails:flash', flashHandler);


// BEGIN DRIVER
/*
Mark Allen
2013
**/

(function($,doc){
  /* scroll down to bottom */
  window.scroll_down  = function(){
    $(document).scrollTop(999);
  }

  window.in_editor  = typeof window.tab_properties === "undefined";
  if(in_editor) return;

  window.tab_properties                     = window.tab_properties || {};
  window.tab_properties.app_data            = window.tab_properties.app_data || {};
  window.tab_properties.signed_request      = window.tab_properties.signed_request || {};
  window.tab_properties.signed_request.page = window.tab_properties.signed_request.page || {liked:true};
  window.tab_properties.signed_request.user = window.tab_properties.signed_request.user || {};

  $(function(){

    window._gaq = window._gaq || {push:function(){}};

    /* test delete */
    // window.pin_delete = function(id, pw){
    //   promo.destroy_by_id(id, pw, function(){
    //     promo.close_tooltips();
    //   });
    // }


    /* trackers */
    var track_ui  = function(label, listener){
      promo.track_event("UI#" + label, listener);
    }
    var track         = function(el, label, listener, callback){
      el.bind(listener + ".tracking", function(){
        if(callback && !callback()){
          return false;
        }
        track_ui(label, listener);
      });
    }

    var once_tracked  = {};
    var track_once    = function(el, label, listener, callback){
      track(el, label, listener, function(){
        var full  = label + "_" + listener;
        if(once_tracked[full]){
          return false;
        }
        return once_tracked[full] = true;
      });
    }

    var promo_link    = page_promo_link;

    var share_args    = {
      'utm_campaign': "TPC",
      'utm_medium'  : "share",
      'utm_content' : "",
      'utm_source'  : ""
    };

    var ribbon        = null;
    var info_form     = $(".info");
    var info_modal    = $("#info");
    var thanks_modal  = $("#share");
    var drop_here     = $(".drag");
    var search_bar    = $(".searchbar");
    var search_form   = $(".searchform");
    var search_field  = search_form.find(".searchfield");
    var ribbonbar     = $(".ribbonbar");
    var drag          = $(".ribbon");

    /* focus and type in search bar */
    track       (search_field, "search_field", "focus");
    track       (search_field, "search_field", "keydown");

    /* drag and drop ribbon */
    track       (drag,      "drag_ribbon", "dragstart");
    track       (drop_here, "drag_ribbon", "drop");

    /* external links */
    track       ($(".banner-link"), "link_rotr",    "click");
    track       ($(".donate"),      "link_donate",  "click");


    var promo;

    // which, if any, pin should open on page load
    var start_opened  = window.tab_properties.app_data.pin ? window.tab_properties.app_data.pin : 0;

    var mine  = false;

    /* track event on successful share */
    var track_social  = function(social){
      promo.track_event("social_share#" + (mine ? "own" : "other"), "post#" + social);
    }

    if (typeof twttr === "undefined"){
      // do nothing
    } else {
      twttr.events.bind('tweet', function(event){
        track_social('twitter');
      });
    }

    var popup_share = function(clicked, pin, e){
      var social  = clicked.attr("data-social");
      mine        = clicked.attr("data-mine") === "true";

      promo.track_event("social_share#" + (mine ? "own" : "other"), "popup#" + social);

      var args    = $.extend(share_args,{
        utm_source  : social,
        utm_content : mine ? "own" : "other",
        pin         : pin.id
      });
      var share_link  = promo_link + $.concatArgs(args);

      promo.close_tooltips();

      switch(social){
        case "facebook":
          e.preventDefault();
          FB.ui({
            method      : "feed",
            link        : share_link,
            //display     : "popup",
            caption     : "Barnabas Health",
            description : "To raise breast cancer awareness, The Pink Crusade is giving people an opportunity to dedicate and post ribbons.  Dedicate your ribbon today!"
          },function(d){
            if(d && d['post_id'])
              track_social('facebook');
          });
          break;

        case "twitter":
          // e.preventDefault();
          clicked.twitterBtn({
            url     : share_link,
            text    : mine ?  "I just dedicated my ribbon to help raise breast cancer awareness via @Barnabas_health #ThePinkCrusade" :
                              "I just shared a ribbon to help raise breast cancer awareness via @Barnabas_health #ThePinkCrusade",
            related : {
              "ThePinkCrusade"  : "Follow us!",
              "barnabas_health" : "Follow Barnbas Health"
            }
          });
          break;
      }
    }

    promo = drop_here.pinDrop($(".ribbon"),{
      pins          : ".ribbon",
      promo_id      : window.pin_promo_id ? window.pin_promo_id : 1,
      debug         : true,
      start_opened  : start_opened,
      ga_category   : "pindrop",
      start_opened  : start_opened,

      /* return the element to place inside the tooltip  */
      generate_tooltip  : function(pin){
        var tooltip_container = $('<div class="tooltip-container" data-id="' + pin.id + '"/>');
        var twitter_btn       = $("<a href='#' class='social-link social-twitter' data-social='twitter'><div class='social-img'></div></a>");
        var facebook_btn      = $("<a href='#' class='social-link social-facebook' data-social='facebook'><div class='social-img'></div></a>");
        var floater           = $('<span class="tooltip-right"/>');
        floater.append(twitter_btn).append(facebook_btn);
        tooltip_container.append(floater);

        var header            = $('<h2/>');
        header.append(pin.pin_first_name + " " + pin.pin_last_name);
        tooltip_container.append(header);
        tooltip_container.append($('<p>' + pin.pin_comment + '</p>'));

        var click_social  = function(e){
          popup_share($(this), pin, e);
        };

        $(twitter_btn).click(click_social);
        $(facebook_btn).click(click_social);

        return tooltip_container;
      },

      /* callback after pins are loaded */
      on_reload     : function(pins){
        if(start_opened){
          var found = promo.find_by_id(start_opened);
          if(found){
            $(".pin.state-pinned[data-id=" + found.id + "]").tooltipster('show');
          }
        }
      },
      on_drop       : function(pin){
        ribbon  = pin;
        info_modal.modal();
        info_form.find("input:first").focus();
      }
    });

    /* track start opened */
    start_opened && promo.track_event("autoload_pin", start_opened);

    /*    submit    */
    var submitting  = false;
    info_form.submit(function(e){
      e.preventDefault();
      if(submitting)  return false;
      submitting  = true;
      var formArray = info_form.mySerialize("pin_",{
        'pin_can_email' : false
      });
      var new_ribbon  = $.extend(ribbon, formArray);

      promo.debug("formArray",new_ribbon);

      promo.create_pin(new_ribbon, function(pin){
        submitting  = false;
        promo.debug("the new pin", pin);
        promo.place_pin(pin);
        info_form.resetForm();
        info_modal.modal('hide');
        thanks_modal.modal();
        thanks_modal.find(".social-btn").click(function(e){
          popup_share($(this), pin, e);
        });
        promo.track_event("collected_data", pin.pin_can_email != 0 ? "can_email" : "no_email");
      });
    });
    /* .. submit .. */

    /*    search    */
    search_field.keyup(function(){
      promo.filter($(this).val());
    });
    search_form.submit(function(e){
      e.preventDefault();
      search_field.blur();
      scroll_down();
    });
    /* .. search .. */


    // /* search_bar fixed */
    // window.$window  = $(window);
    // var searchbar_scrolltop   = search_bar.offset().top;
    // var ribbonbar_scrolltop   = ribbonbar.offset().top;
    // $window.scroll(function(e){
    //   if ($window.scrollTop() > searchbar_scrolltop) {
    //     search_bar.css({
    //       position: 'fixed',
    //       top: 0
    //     });
    //   }else{
    //     search_bar.css({
    //       position: 'absolute',
    //       top: searchbar_scrolltop
    //     });
    //   }
    //   //promo.debug(searchbar_scrolltop);
    // });




    var hide_search_bar = function(){
      search_bar.slideUp();
    }
    var show_search_bar = function(){
      search_bar.slideDown();
    }

    info_modal.on('show',hide_search_bar);
    info_modal.on('hide',show_search_bar);
    thanks_modal.on('show',hide_search_bar);
    thanks_modal.on('hide',show_search_bar);


    /* start scrolled down to bottom */
    setTimeout(scroll_down,2);

    var user_likes  = function(){
      $("#gate").hide();
    }
    /*window.tab_properties = {
      signed_request  : {
        page  : {
          liked : "true"
        }
      }
    }*/
    if(
      !window.tab_properties ||
      !window.tab_properties.signed_request ||
      !window.tab_properties.signed_request.page ||
      typeof window.tab_properties.signed_request.page.liked === "undefined" ||
      window.tab_properties.signed_request.page.liked != false
    ){
      user_likes();
    }


  });


  $(document).ready(function(){
    $('.tooltip').click(function(e){e.preventDefault();}).tooltipster({
      interactive           : true,
      interactiveTolerance  : 350
    });
    var chars_remaining_el  = $("#comment-chars-remaining");
    var comment_field       = $("#comment");
    comment_field.keyup(function(){
      var max_len = 60;
      chars_remaining_el.html(max_len - comment_field.val().length);
    });
  });

}(window.jQuery,window.document));
