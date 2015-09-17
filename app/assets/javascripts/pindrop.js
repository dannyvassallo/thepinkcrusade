/*
Mark Allen
2013
**/


(function($,doc){
  var promo_objects = [];
  var myfangate_url = "/"; // "//myfangate.com/ci/";
  // console.log(myfangate_url);
  var PinPromo = {
    'oops'    : function(msg){
      msg = msg ? msg : 'Something went wrong.. Try again in a little while.';
      alert("Oops! " + msg);
    },
    'create'  : function(o, element){
      var self;
      self  = {
        'opts'      : o,
        'element'   : element,
        'pins'      : [],
        'debug'     : function(){
          if(
            //typeof self['opts']['debug'] !== "undefined" && self['opts']['debug'] &&
            typeof window.console !== "undefined"
          ){
            for(var i=0, l=arguments.length; i < l; i++){
              window.console.log(arguments[i]);
            }
          }else{
            var l = function(){};
            window.console  = {
              log   : l,
              info  : l,
              debug : l,
              warn  : l,
              error : l
            }
          }
        },
        'track_event' : function(action, label, value, noninteraction){
          self.debug(action, label);
          if(!window._gaq)  return false;
          value           = value             || 1;
          noninteraction  = noninteraction    || false;
          window._gaq.push(["_trackEvent", o.ga_category, action, label, value, noninteraction]);
          return true;
        },
        'track_error' : function(action, label){
          action  = "ERROR#" + action;
          return self.track_event(action, label);
        },
        'close_tooltips'  : function(){
          $('.pin.state-pinned').tooltipster('hide');
        },
        'generate_tooltip': function(pin, pin_dom){
          var tooltip_container = $('<div class="tooltip-container"/>');
          var twitter_btn       = "<a href='#' class='social-link'><img src='img/twitter.png' /></a>";
          var facebook_btn      = "<a href='#' class='social-link'><img src='img/facebook.png' /></a>";
          var floater           = $('<span class="tooltip-right"/>');
          floater.append(twitter_btn).append(facebook_btn);
          tooltip_container.append(floater);

          var header            = $('<h2/>');
          header.append(pin.pin_first_name + " " + pin.pin_last_name);
          tooltip_container.append(header);
          tooltip_container.append($('<p>' + pin.pin_comment + '</p>'));

          return tooltip_container;
        },
        'new_pin_dom' : function(){
          var pin_dom = jQuery('<a class="pin state-pinned" title="" style="background-image:url(' + self.opts.pin_img + ');" ></a>');
          //pin_dom.append('<img src="' + self.opts.pin_img + '"/>');
          return pin_dom;
        },
        'new_pin'       : function(pin){
          var d = {
            pin_pin_promo_fk  : self['opts'].promo_id,
            pin_x             : 0,
            pin_y             : 0,
            pin_zip           : null,
            pin_email         : null,
            pin_last_name     : null,
            pin_first_name    : null,
            pin_comment       : null,
            pin_event_code    : null,
            pin_app_name    : null,
          }
          return $.extend(d,pin);
        },
        'create_pin'    : function(pin, callback, error){
          pin = self.new_pin(pin);
          $.post(myfangate_url + "api/v1/pins/", {pin:pin}, function(d){
            self.debug("create_pin", d);
            if(d && !d.error){
              self.pins.push(d);
              self.track_event("create_pin","success");
              return $.isFunction(callback) && callback(d);
            }
            self.track_event("create_pin", "fail#" + d.error + "#text=" + d.text);
            $.isFunction(error) && error(d);
            return PinPromo.oops(d.error);
          },"JSON").error(function(d){
            self.debug('create_pin', d);
            self.track_error("create_pin", d.status + "#" + d.statusText);
            $.isFunction(error) && error(d);
            return PinPromo.oops();
          });
        },
        'place_pin' : function(pin){
          var pin_dom       = self.new_pin_dom();
          pin_dom.attr("title",pin.pin_first_name + " " + pin.pin_last_name + "\n" + pin.pin_comment);
          var public_attrs  = ["id", "pin_first_name", "pin_last_name", "pin_comment"];
          var searchable    = '';

          for(var i=0,l=public_attrs.length; i<l; i++){
            var field = public_attrs[i].toLowerCase();
            console.log(field);
            var val   = (pin[field] + "").toLowerCase();
            pin_dom.attr("data-" + field, val);
            searchable += val + ' ';
          }
          pin_dom.attr("data-searchable", searchable);

          self.element.append(pin_dom);

          // self.debug("place pin: pin_x", pin.pin_x);

          pin_dom.css({
            "left"    : parseInt(pin.pin_x) + parseInt(self.opts.drop_offset_x),
            "top"     : parseInt(pin.pin_y) + parseInt(self.opts.drop_offset_y)
          });

          var content;
          if(self.opts.generate_tooltip){
            content = $.isFunction(self.opts.generate_tooltip) ? self.opts.generate_tooltip(pin) : self.opts.generate_tooltip;
          }else{
            content = self.generate_tooltip(pin);
          }

          pin_dom
            .tooltipster({
              'content'       : content,
              'interactive'   : true,
              'functionReady' : function(origin,tooltip) {},
              'functionAfter' : function(origin) {
                pin_dom.attr("data-user-initiated-hover", false);
              }
            });
          pin_dom.Touchable();
          // pin_dom.bind("longTap",function() {
          //   self.destroy_by_id(pin.id, prompt("Permenantly delete " + pin.pin_first_name + " " + pin.pin_last_name + "'s comment?\n\"" + pin.pin_comment + "\""));
          // });
          pin_dom.bind("mouseover", function() {
            pin_dom.attr("data-user-initiated-hover", true);
            self.track_event("pin_hover", "pin#" + pin.id);
          });
          pin_dom.bind("tap",function(){});
        },
        'reload'  : function(callback){
          $.get(myfangate_url + "api/v1/pins/", function(d){
            self.debug("RELOAD PINS", d);
            self.pins = d;
            $.isFunction(callback) && callback(d);
            self.opts.on_reload(self.pins);
          },"JSON").error(function(d){
            self.track_error("reload_pins", d.status + "#" + d.statusText);
            return PinPromo.oops();
          });
        },
        'place_batch' : function(pins){
          self.debug("placing batch...");
          if(window.async){
            self.debug("using async");
            async.each(pins,
              function(p){
                setTimeout(function(){
                  self.place_pin(p);
                },1);
              },
              function(error){
                self.track_event("place_pin","error#" + error);
              });
          } else {
            self.debug("not using async");
            for(var i=0, l=pins.length; i<l; i++){
              self.place_pin(pins[i]);
            }
          }
        },
        // 'destroy_by_id'   : function(id, password, callback){
        //   if(!password) { return false; }
        //   callback  = callback || $.noop;
        //   $.post('api/v1/pins/' + id, {destroy_code : password}, function(d){
        //     if(d && d.success){
        //       self.track_event("destroy_pin","success");
        //       alert("The comment has been permenantly deleted");
        //       $(".pin.state-pinned[data-id=" + id + "]").fadeOut(function(){
        //         $(this).remove();
        //         callback();
        //       });
        //     }else{
        //       self.track_error("destroy_pin", "fail#" + d.error);
        //       PinPromo.oops(d.error ? d.error : "Something went wrong.. ");
        //     }
        //   },"JSON").error(function(d){
        //     self.track_error("destroy_pin", d.status + "#" + d.statusText);
        //     self.debug("destroy error", d);
        //   });
        // },
        'find_by_id'      : function(id){
          /* fade out any pins that don't match the q string */
          for(var i=0, l=self.pins.length; i<l; i++){
            if(self.pins[i].id == id) return self.pins[i];
          }
          return null;
        },
        'filter'    : function(q){
          /* fade out any pins that don't match the q string */
          q = $.trim(q).toLowerCase();
          self.debug("filter",q);
          var all_searchable  = self.element.find("[data-searchable]");

          var stay, hide;
          if(q){
            stay  = all_searchable.filter('[data-searchable*="' + q + '"]');
            hide  = all_searchable.not(stay);
            hide.fadeOut();
          }else{
            stay  = all_searchable;
          }
          stay.fadeIn();
        }
      };
      return self;
    }
  }

  $.fn.pinDrop  = function(){
    var o={
      "promo_id"      : null,
      "pins"          : null,
      "pin_img"       : "https://s3.amazonaws.com/myfangate.com/pinkcrusade/img/ribbon-small.png",
      "start_open"    : null,
      "debug"         : true,
      "ga_category"   : "pindrop",
      "on_drag"       : $.noop,
      "on_drop"       : $.noop,
      "on_reload"     : $.noop,
      "on_destroy"    : $.noop,
      "drop_offset_x" : 0,
      "drop_offset_y" : 0,
      "auto_hover"    : false
    };
    var pins, promo_id  = null;
    for(var i=0, l=arguments.length; i<l; i++){
      var arg = arguments[i];
      switch(typeof arg){
        case "string":
          // none
          break;
        case "number":
          promo_id = arg;
          break;
        case "object":
          if($.isPlainObject(arg)){
            // is hash
            s = $.extend(o, arg);
          }else{
            // is jQuery Object
            pins  = arg;
          }
          break;
      }
    }

    if(pins)
      o["pins"] = pins;
    o["pins"] = $(o["pins"]);

    if(promo_id)
      o["promo_id"]   = promo_id;

    var promo = PinPromo.create(o,this);
    promo_objects.push(promo);

    /* do it */

    /* THIS IS REQUIRED TO MAKE JQ PUNCH REGISTER TAP-OFF EVENTS */
    //$("body > *").mouseover(promo.close_tooltips).click(promo.close_tooltips);
    $("body > *").mouseover($.noop).click($.noop);

    this.each(function(){
      var self = $(this);

      promo.reload(function(pins){
        promo.place_batch(pins);
        // if start_opened is set, open it instantly
        /*if(o["start_opened"]){
          var found = promo.find_by_id(o["start_opened"]);
          if(found){
            $(".pin[data-id]").tooltipsy();
          }
        }*/
      });

      promo.debug("o['pins']",o['pins']);

      if(
        false
        //|| (!self.droppable)
        //typeof o['pins']['draggable'] === "undefined" ||
        //!o['pins']['draggable'] ||
        //!$.isFunction(o['pins']['draggable'])
        //(typeof o['pins'].draggable === "null") ||
        //(typeof o['pins'].draggable === "undefined")
      ){
        promo.debug("EXITING: no droppable");
        PinPromo.oops("Your browser must be ancient.. Please upgrade to use this app!");
        return false;
      }

      o['pins'].draggable({
        'scroll'    : true,
        'revert'    : "invalid",
        //'helper'    : 'original',
        'helper'    : "clone",
        'start'     : function(){
          promo.close_tooltips();
          // highlight droppable
        },
        'stop'      : function(){
          // un-highlight droppable
        }

      });

      var sample_pin = function(position){
        return new_pin({
          pin_x           : position.left,
          pin_y           : position.top,
          pin_zip         : "07121",
          pin_email       : "sample@email.com",
          pin_last_name   : "Magee",
          pin_first_name  : "Mitch",
          pin_comment     : "My dad... was so strong",
          pin_event_code  : "Luncheon"
        });
      }

      self.append($('<div class="droppable-inner"/>'));

      self.droppable({
        'accept'      : o['pins'],
        'tolerance'   : "fit",
        'activeClass' : "state-active",
        'hoverClass'  : "state-hover",
        'drop'        : function(event,ui){
          var dropped   = $(this);
          var offset    = dropped.offset();
          var drop_pos  = ui.offset;

          var position  = {
            'left'  : drop_pos.left - offset.left,
            'top'   : drop_pos.top  - offset.top
          }

          var pin = promo.new_pin({
            pin_x : position.left,
            pin_y : position.top
          });

          o.on_drop(pin);

          /*
          promo.create_pin(sample_pin(position), function(pin){
            //promo.place_pin(pin);'
            promo.debug("the new pin", pin);
          });
          */
        }

      });

      if(o.auto_hover) {
        var t = setInterval(function(){
          promo.debug("autohovering");
          if($("[data-user-initiated-hover=true]").length == 0) {
            promo.debug("pins",pins);
            $(".pin.state-pinned").random().tooltipster("show");
          }
        },4000);
      }
    });
    return promo;
  }
  /* end $.fn.pinDrop */

  /* serialize */
  $.fn.mySerialize  = function(prefix, defaults){
    // nest
    prefix      = prefix ? prefix : '';

    var self    = $(this);
    var serial  = self.serializeArray();

    /* window.console && console.log("mySerialize",serial); */

    var ret     = {};
    for(var i=0, l=serial.length; i < l; i++){
      var name  = serial[i].name;
      var value = serial[i].value;
      var field = self.find("input[name=" + name + "]");
      if(value  == field.attr("placeholder")) value = '';
      if(field.is("[type=checkbox]")){
        if(value === "on") value  = true;
      }
      ret[prefix + name]  = value;
    }

    if(defaults)  ret = $.extend(defaults, ret);

    return ret;
  }
  /* .. serialize .. */

  $.fn.setValue   = function(value){
    var self  = $(this);
    if(self.is("[type=checkbox]")){
      if(value && value !== "no" && value !== "false"){
        self.attr("checked","checked");
      }else{
        self.attr("checked","");
        self.removeAttr("checked");
      }
    }else if(self.is("input, textarea, [type=submit]")){
      self.val(value);
    }
    return self;
  }
  $.fn.resetForm  = function(defaults){
    var self  = $(this);
    self.find("input[type=email],input[type=text],input[type=checkbox],input[type=radio],textarea").each(function(index, element){
      var el  = $(element);
      var val = '';
      if (el.attr("data-default") != "") {
        val = el.attr("data-default");
      } else if (typeof defaults[el.attr("name")] !== "undefined") {
        val = defaults[el.attr("name")];
      } else if (typeof defaults[el.attr("id")] !== "undefined") {
        val = defaults[el.attr("id")];
      }
      el.setValue(val);
    });
    return self;
  }
  // http://stackoverflow.com/a/3614980/2696867
  $.fn.random = function() {
    var randomIndex = Math.floor(Math.random() * this.length);
    return jQuery(this[randomIndex]);
  };

}(jQuery,window.document));
