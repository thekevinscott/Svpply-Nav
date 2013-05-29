if (! herdingpixels) { herdingpixels = {}; }

(function($){
	$.expr[':'].external = function(obj){
	    return !obj.href.match(/^mailto\:/)
	            && (obj.hostname != location.hostname);
	};

	herdingpixels.transitions = function() {
		var options = {
			animations : {
				loadOut : 420,
				cssWait : 10
			}
		}


		var $body, $window, content;


		var anim_time = 120;
		var timeout_time = 4;


		var fadeout = false;
		var content;



		var loadOut, loadIn, getContent;


		getContent = function() {
			if (! content) { content = $($('#content').filter(':first')); }
			return content;
		}
		ready = function() {
			return fadeout;
		}
		loadOut = function(url) {

			$('html, body').animate({
		    	scrollTop: 0
		    }, 1200);

			// Set Loading
			$body.addClass('loading');


			if (! $('#content-outgoing').length) {
				var clone;

				clone = getContent().clone();
				clone.attr('id','content-outgoing');
				clone.after('<div id="placeholder" />');

				//$('#page-footer').fadeOut();

				getContent().hide();//.addClass('incoming');
				getContent().before(clone);
				setTimeout(function(){
					// clone.css({opacity: 0},options.animations.loadOut,function(){
					// 	clone.remove();
					// 	fadeout = true;
					// 	herdingpixels.ajaxify.loadContent();
					// });

					if (clone.find('.banner').length) {

						clone.find('.banner').css({opacity: 0, marginTop: -300});
						clone.find('.post').css({opacity: 0, marginTop: $(window).scrollTop()+$(window).height()});

					} else if (clone.find('.list').length || 1) {

						clone.css('opacity',0);
						// clone.find('.header-wrap').css({opacity: -1, marginTop: -400},options.animations.loadOut);
						// clone.find('.category-content').css({opacity: 0, marginTop: $(window).scrollTop()+$(window).height()},options.animations.loadOut);

						//clone.animate({opacity: 0}, options.animations.loadOut);
					}

					setTimeout(function(){

						fadeout = true;
						herdingpixels.ajaxify.loadContent(url);
					},options.animations.loadOut*1.2);

				},options.animations.cssWait);


				/*


*/
				// clone.fadeOut(function(){
				// 	clone.remove();
				// });
			}



			// // we wrap this so our css3 selectors have a chance to fire.
			// var timeout = setTimeout(function(){

			// 	fadeout = true;
			// 	herdingpixels.ajaxify.loadContent();

			// },anim_time+timeout_time);

		}

		handlers = function() {

			$('.play').each(function(){
				if ($(this).attr('rel')) {
					var snd = new Audio($(this).attr('rel'));
					$(this).unbind('click').click(function(e){
						e.preventDefault();
						snd.play();
					});
				}
			});

			$('video').unbind('mouseover').mouseover(function(){
			 	$(this)[0].play();
			}).unbind('mouseout').mouseout(function(){
				$(this)[0].pause();
			});

			$('a.gray').unbind('mouseover').mouseover(function(){
				$(this).removeClass('gray');
			}).mouseout(function(){
				$(this).addClass('gray');
			});


			$('a:external').attr('target','_blank');


		}

		// our content is already loaded
		loadIn = function(type) {
			$('#placeholder, #content-outgoing').remove();
			if (fadeout && content) {

				switch(type) {
					case 'list' :
						content.find('.attributes').css('width','auto');
						content.show();
						content.removeClass('incoming');
						var category_container = content.find('.category-container');



						var overlay = $('<div class="overlay" ></div>');
						category_container.prepend(overlay);

						var h1 = content.find('h1');
						if (h1.length) {
							var h1_width = h1.width();
							h1.show().css({fontSize:'0em'}).animate({fontSize: '3.5em'},600,'easeOutBounce');

							var line = $('<div class="line"></div>');

							line.width(($('.header-wrap').width()-h1_width)/2);
							var line_before = line.clone();
							var line_after = line;
							h1.before(line_before);
							h1.after(line_after);

							var options = {
								duration: 1500,
								color: '#999',
								lineWidth : 1.0,
								callback:function(el){

									// $(el).fadeOut(function(){
									// 	$(this).remove()
									// })
								}
							};
							$(line_before).spiral($.extend({direction: 'left'},options));
							$(line_after).spiral(options);
							$('.line').css({opacity: 0}).animate({opacity:1},700);
						}


						if (category_container.height()) {
							var category_container_height = category_container.height();

							overlay.animate({top: category_container_height },category_container_height/1.5,'linear',function(){

								overlay.animate({opacity: 0},1000,'linear',function(){

									overlay.hide();
								});

							});
						} else {
							overlay.hide();
						}
					break;
					default :

						var attb_width = content.find('.attributes').width();


						content.find('.banner').css({left: '100%'});
						//content.find('.attributes .section').css({opacity: 0});

						content.find('.attributes').css({'width' : 0, 'opacity' : 0});


						content.show();

						var overlay = $('<div class="overlay" ></div>');
						var post_container = content.find('.post-container');
						post_container.prepend(overlay);
						overlay.css('top', 200);

						setTimeout(function(){

							content.removeClass('incoming');

							content.find('.banner').find('*').css({top: '100%'});
							setTimeout(function(){
								content.find('.banner').animate({left: '0%'},200,'easeOutCubic');
								setTimeout(function(){
									content.find('.banner').find('*').animate({top: '0%'},300);
								},1000);
							},300);

							setTimeout(function(){
								content.find('.attributes').animate({width: attb_width},300,'easeOutCubic');
								content.find('.attributes').animate({opacity: 1},700,'easeOutCubic');
							},700);



						},timeout_time);

						if (post_container.height()) {
							var post_container_height = post_container.height();

							setTimeout(function(){
								overlay.animate({top: post_container_height },post_container_height/1.5,'linear',function(){

									overlay.animate({opacity: 0},1000,'linear',function(){

										overlay.hide();
									});

								});
							},200);

						} else {
							overlay.hide();
						}
					break;
				}
				$body.removeClass('loading');
				handlers();
			}
		};
		load = function(html) {

			content.html(html).ajaxify();


			var type  = '';
			if (content.find('.list').length) {
				type = 'list';
			}
			loadIn(type);

		}

		$window = $(window);
		$body = $(document.body);

		handlers();

		return {
			loadIn : loadIn,
			loadOut: loadOut,
			load : load,
			ready : ready
		}
	}();
})(jQuery);
