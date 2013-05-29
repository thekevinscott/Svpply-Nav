(function($){


	herdingpixels.nav = function() {
		// vars
		var content, sidebar, all_category, categories, nav_button, category_links, base_link;

		// internal vars
		var nav_open, li_top_zindex, li_bottom_zindex, sidebar_height;

		// functions
		var select, resize, getOpenContentWidth, getFullContentWidth, getCurrentContentWidth;
		var openTheAll, closeTheAll;
		var setBaseLink;

		var options = {
			animate_speed : {
				menu : 300,
				nav : 150
			},
			measurements : {
				li : {
					height: 54
				},
				left_margin : {
					hide : 0,
					show : 203
				},
				z_index : {
					top: 102,
					bottom: 101 // the children are at 100
				}
			}
		};




		var hideNav = function() {
			content.animate({

				width: getFullContentWidth()
			}, options.animate_speed.nav );
		}
		var showNav = function() {
			content.animate({

				width: getOpenContentWidth()
			}, options.animate_speed.nav );
		}



		getOpenContentWidth = function() {
			return $(window).width() - options.measurements.left_margin.show;
		}
		getFullContentWidth = function() {
			return $(window).width();
		}
		getCurrentContentWidth = function() {
			if (nav_open) {
				return getOpenContentWidth();
			} else {
				return getFullContentWidth();
			}
		}

		resize = function() {
			if (herdingpixels.getDevice() == 'desktop') {
				content.width(getOpenContentWidth());
			} else {
				content.width(getCurrentContentWidth());
			}
		}

		openTheAll = function() {
			all_category.css({top: 0});
			sidebar.animate({height: options.measurements.li.height*2}, options.animate_speed.menu);

		}
		closeTheAll = function(e) {
			e.preventDefault();
			sidebar.animate({height: '100%'}, options.animate_speed.menu);
			//all_category.slideUp(options.animate_speed.menu);

			$.each(categories,function(i,cat){
				var category = cat.data('navItem');
				if (category.isOpen()) { category.closeChildren(); }
				category.show();
			});

			all_category.animate({top: (options.measurements.li.height*-1)+'px'},options.animate_speed.menu);
			//all_category.parent().addClass('open');

		}
		select = function(slug) {

			var slug = slug.split('/');
			var selected = false;
			while (slug.length > 0 && ! selected) {
				var p = slug.pop();
				if (p) {
					selected = true;
					slug = p;
				}
			}


			// console.log(slug);
			var menuitem, category, categoryitem;

			if (slug && slug.length && slug != 'dev') {
				slug = slug.replace('%20',' ');
				$.each(categories,function(i,cat){
					var category = cat.data('navItem');
					if (category.isOpen()) { category.closeChildren(); }
					category.show();
				});

				menuitem = $('#menuitem-'+slug+':first');
				// console.log(menuitem);
				if (menuitem.length) {
					var ul = $(menuitem).parents('ul');
					var id = ul.attr('id').split('-');
					id.shift();
					id = id.join('-');
					slug = id;
					$('.selected').removeClass('selected');
					menuitem.find('a').addClass('selected');

				}

				categoryitem = $('#category-'+slug+':first');
				// console.log(categoryitem);
				category = categoryitem.find('a');
				if (category.length) {

					var item = $(category[0]).data('navItem');

					if (item) {

						item.click();
					}
				} else {
					$('.sidebar-hide-scroll ul').css('height','100%');
				}



			} else {

				$('.sidebar-hide-scroll ul').css('height','100%');
			}

		}
		setBaseLink = function(base) {

			base_link = base;
		}


		var navItem = function(el, index) {
			el = $(el);
			// vars
			var li, submenu, is_visible, is_open, children, top, height, id;
			// functions
			var equals, click, show, hide, closeChildren, openChildren, isOpen, isVisible, setZIndex;

			// an li can collapse into another li: close
			// an li can revive out of the other lis: open
			// an li can open its children: openChildren
			// an li can collapse its children: closeChildren

			setZIndex = function(zIndex) {
				li.css('zIndex',zIndex);
			}
			click = function(e){
				if (! isOpen()) {
					if (e) { e.preventDefault(); }
					setZIndex(options.measurements.z_index.top);

					show(height);

					submenu.show();

					setTimeout(openChildren,1);

					// it should set z indexs descending from itself

					$.each(categories,function(i,category){
						category = category.data('navItem');
						if (! category.equals(el)) {
							// category index = 8
							// my index = 4
							// abs(index-myindex) = 4
							//
							category.hide(options.measurements.z_index.top-Math.abs(category.index - index));
						}
					});


					openTheAll();
				}

			};
			equals = function(target_el) {
				return (el[0] === target_el[0]);
			};
			hide = function(val) {
				if (isVisible()) {
					if (! val) { val = options.measurements.z_index.top - index}
					is_open = false;
					is_visible = false;
					//li.removeClass('open');
					//visible = false;
					//menu.slideUp(options.animate_speed.menu);]
					setZIndex(val);
					li.stop().animate({opacity: 1, top: height}, options.animate_speed.menu);

					//menu_li.animate({opacity : 0, height: '0', marginTop: 0}, options.animate_speed.menu);
				}

			};
			// an open ONLY refers to the li
			show = function(val) {

				//console.log('show!');
				//console.log(li);
				if (! val) { val = top; }
				//console.log('val: ' + val);
				is_visible = true;

				li.stop().animate({opacity: 1, top: val, height: height}, options.animate_speed.menu);



				//openChildren();
				//li.addClass('open');
				//visible = true;
				//menu.slideDown(options.animate_speed.menu);


				//menu_li.animate({opacity : 1, height: '54px', marginTop: 0}, options.animate_speed.menu);

				// close all other menus

			}

			// so what happens is the children 'menu' is the height of the top level menu, then when they appear they animate to their height
			closeChildren = function() {

				is_open = false;

				//children.animate({opacity : 1, height: sidebar_height/children.length, marginTop: '0'}, options.animate_speed.menu);
				var close_height = sidebar_height/(children.length);


				submenu.stop().animate({top: 0},options.animate_speed.menu, function() {
					submenu.hide();
				});
				submenu.css('zIndex',options.measurements.z_index.bottom);
				children.stop().animate({opacity : 1, height: close_height, lineHeight: close_height+'px'}, options.animate_speed.menu);
			};
			openChildren = function() {
				if (! is_open) {
					submenu.show();
					is_open = true;

					// THESE SHOULD BE EASED OUT
					children.stop().animate({opacity : 1, height: height, lineHeight: height +'px'}, options.animate_speed.menu);
					submenu.stop().animate({top: (height*2)+'px'},options.animate_speed.menu, function() {
						submenu.css('zIndex',options.measurements.z_index.top);
					});
				}

			}
			isVisible = function() {
				return is_visible;
			}
			isOpen = function() {
				return is_open;
			}

			// set elements
			li = el.parent();
			id = $(li).attr('id').split('-');
			id.shift();
			id = id.join('-');
			//console.log(id);
			submenu = $('#submenu-'+id);

			children = submenu.find('li');
			is_visible = true;
			is_open = false;

			top = parseInt(li.css('top'));

			height = parseInt(li.height() - 2); // 2 for border height
			closeChildren();
			submenu.hide();

			// attach

			el.click(click);

			return {
				click : click,
				index : index,
				equals : equals,
				hide : hide,
				show : show,
				openChildren : openChildren,
				closeChildren : closeChildren,
				isVisible : isVisible,
				isOpen : isOpen
			}
		}
		nav_open = true;

		content = $('.body');
		sidebar = $('.sidebar .mainMenuWrap');
		all_category = sidebar.find('#category-all');

		category_links = sidebar.find('> li:not(#category-all) > a');
		options.measurements.z_index.top = 101 + category_links.length;

		sidebar_height = category_links.length * options.measurements.li.height;


		categories = [];
		var i = 0;
		category_links.each(function(){
			categories.push($(this).data('navItem',navItem(this, category_links.length-i)));
			i--;
		});
		nav_button = $('.nav-button')

		nav_button.click(function(e){
			if (nav_open) {
				hideNav();
				nav_open = false;
			} else {
				showNav();
				nav_open = true;
			}

			return false;
		});


		$(window).resize(resize);
		resize();



		all_category.click(closeTheAll);


		$(document).ready(function(){

			$('a').click(function(e){
				$('.selected').removeClass('selected');
				$(this).addClass('selected');

			});
			select(window.location.pathname);
		});

		// $.get($(this).attr('href'),{},function(data){
		// 	$('.content .container').html(data);
		// });


		return {
			select : select,
			categories : categories,
			setBaseLink : setBaseLink
		}
	}();


/*
	catAll.click(function(e){
		var _this = $(this);
		e.preventDefault();
		_this.slideUp(menu_animate_speed);
		_this.parent().removeClass('open');
	});
*/

})(jQuery);



