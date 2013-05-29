 var herdingpixels = {};

(function($){
    herdingpixels = function() {
        var device;
        var ready = function(callback) {
            if (callback) {
                $(document).ready(function(){
                    callback($);
                });
            }
        }
        var getDevice = function() {
            return device;
        };
        var setDevice = function(device_string) {
            device = device_string;
        }
        var findDevice = function() {
            var w = Math.max($(window).width(), $(window).height());
            //var _h = Math.min($(window).width(), $(window).height());
            if (w <= 480) {
                setDevice('phone');
            } else if (w <= 1024) {
                setDevice('tablet');
            } else {
                setDevice('desktop');
            }
        }


        $(window).resize(findDevice);
        findDevice();
        $(document).ready(function(){
            $('.header').addClass('show');
            $(window).unbind('scroll').scroll(function(){
                var scroll_distance = $(window).scrollTop() - $('#content').height() + $(window).height() - $('#page-footer').height();
                if (scroll_distance > 0) { scroll_distance = 0; }
                $('#page-footer').css('bottom',scroll_distance/3);
            });
        });

        return {
            getDevice : getDevice,
            ready : ready
        }
    }();

})(jQuery);
