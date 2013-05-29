(function(window,$){

	// functions

	$.fn.ajaxify = function(){
		// Prepare
		var $this = $(this);

		// Ajaxify
		$this.find('a:internal:not(.no-ajaxy)').click(function(event){
			// Prepare
			var
				$this = $(this),
				url = $this.attr('href'),
				title = $this.attr('title')||null;

			// Continue as normal for cmd clicks etc
			if ( event.which == 2 || event.metaKey ) { return true; }

			herdingpixels.nav.select(url);

			// Ajaxify this link
			History.pushState(null,title,url);
			event.preventDefault();
			return false;
		});

		// Chain
		return $this;
	};



	// HTML Helper
	var documentHtml = function(html){
		// Prepare
		var result = String(html)
			.replace(/<\!DOCTYPE[^>]*>/i, '')
			.replace(/<(html|head|body|title|meta|script)([\s\>])/gi,'<div class="document-$1"$2')
			.replace(/<\/(html|head|body|title|meta|script)\>/gi,'</div>')
		;

		// Return
		return $.trim(result);
	};







	// Init
	var
		History = window.History,
		$ = window.jQuery,
		document = window.document;

	// Check to see if History.js is enabled for our Browser
	if ( !History.enabled ) {
		return false;
	}





	// Wait for Document
	$(function(){
		herdingpixels.ajaxify = function() {

				// Prepare Variables
				var
					/* Application Specific Variables */

					$content = $('#content').filter(':first'),
					contentNode = $content.get(0),
					completedEventName = 'statechangecomplete',
					/* Application Generic Variables */
					$window = $(window),
					$body = $(document.body),
					rootUrl = History.getRootUrl(),
					scrollOptions = {
						duration: 800,
						easing:'swing'
					};


				// Internal Helper
				$.expr[':'].internal = function(obj, index, meta, stack){
					// Prepare
					var
						$this = $(obj),
						url = $this.attr('href')||'',
						isInternalLink;

					// Check link
					isInternalLink = url.substring(0,rootUrl.length) === rootUrl || url.indexOf(':') === -1;

					// Ignore or Keep
					return isInternalLink;
				};







				var loadContent = function(url) {
					if (herdingpixels.transitions.ready() && data) {



						var
							$data = $(documentHtml(data)),

							$dataBody = $data.find('.document-body'),
							$dataContent = $dataBody.find('#content').filter(':first'),
							contentHtml;//, $scripts;


						data = null;
						// Fetch the content
						contentHtml = $dataContent.html()||$data.html();





						if ( !contentHtml ) {
							document.location.href = url;
							return false;
						}


						herdingpixels.transitions.load(contentHtml);


						// Update the title
						document.title = $data.find('.document-title:first').text();
						try {
							document.getElementsByTagName('title')[0].innerHTML = document.title.replace('<','&lt;').replace('>','&gt;').replace(' & ',' &amp; ');
						}
						catch ( Exception ) { }



						//if ( $body.ScrollTo||false ) { $body.ScrollTo(scrollOptions); } /* http://balupton.com/projects/jquery-scrollto */

						$window.trigger(completedEventName);

						// Inform Google Analytics of the change
						if ( typeof window._gaq !== 'undefined' ) {
							var relativeUrl = url.replace(rootUrl,'');
							window._gaq.push(['_trackPageview', relativeUrl]);
						}

						// Inform ReInvigorate of a state change
						if ( typeof window.reinvigorate !== 'undefined' && typeof window.reinvigorate.ajax_track !== 'undefined' ) {
							reinvigorate.ajax_track(url);
							// ^ we use the full url here as that is what reinvigorate supports
						}
					}

				};




















				// Ajaxify our Internal Links
				$body.ajaxify();


				// Hook into State Changes
				var xhr;




				var data = null;

				$window.bind('statechange',function(){

					if(xhr && xhr.readystate != 4){
			            xhr.abort();
			        }
					// Prepare Variables
					var
						State = History.getState(),
						url = State.url,
						relativeUrl = url.replace(rootUrl,'');



					herdingpixels.nav.select(url);
					herdingpixels.transitions.loadOut(url);


					// Ajax Request the Traditional Page
					xhr = $.ajax({
						url: url,
						success: function(receivedData, textStatus, jqXHR){
							data = receivedData;
							loadContent(url);

						},
						error: function(jqXHR, textStatus, errorThrown){
							document.location.href = url;
							return false;
						}
					}); // end ajax

				}); // end onStateChange
			return {
				loadContent : loadContent
			}

		}();

	}); // end onDomLoad

})(window,jQuery); // end closure