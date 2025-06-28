(function ($) {
    "use strict";

    // Enhanced Analytics Tracking
    function trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
    }

    // Track page views and user engagement
    function trackPageEngagement() {
        // Track time on page
        let startTime = Date.now();
        $(window).on('beforeunload', function() {
            let timeOnPage = Math.round((Date.now() - startTime) / 1000);
            trackEvent('Engagement', 'time_on_page', timeOnPage + ' seconds');
        });

        // Track scroll depth
        let maxScroll = 0;
        $(window).scroll(function() {
            let scrollPercent = Math.round(($(window).scrollTop() / ($(document).height() - $(window).height())) * 100);
            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if (maxScroll % 25 === 0) { // Track every 25% scroll
                    trackEvent('Engagement', 'scroll_depth', maxScroll + '%');
                }
            }
        });
    }

    // Track button clicks and interactions
    function trackUserInteractions() {
        // Track WhatsApp button clicks
        $('.whatsapp-float').click(function() {
            trackEvent('Contact', 'whatsapp_click', 'floating_button');
        });

        // Track package booking buttons
        $('a[href*="wa.me"]').click(function() {
            let packageName = $(this).closest('.package-item').find('h3').text() || 'Unknown Package';
            trackEvent('Booking', 'package_inquiry', packageName);
        });

        // Track navigation clicks
        $('.navbar-nav .nav-link').click(function() {
            let section = $(this).text();
            trackEvent('Navigation', 'menu_click', section);
        });

        // Track contact form interactions
        $('.form-control').focus(function() {
            trackEvent('Form', 'field_focus', $(this).attr('id') || 'unknown_field');
        });

        // Track phone number clicks
        $('a[href^="tel:"]').click(function() {
            trackEvent('Contact', 'phone_click', 'phone_number');
        });

        // Track email clicks
        $('a[href^="mailto:"]').click(function() {
            trackEvent('Contact', 'email_click', 'email_address');
        });

        // Track map clicks
        $('iframe[src*="google.com/maps"]').parent().click(function() {
            trackEvent('Contact', 'map_click', 'google_maps');
        });
    }

    // Track user source and device information
    function trackUserSource() {
        let source = 'direct';
        let medium = 'none';
        
        // Check UTM parameters
        let urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('utm_source')) {
            source = urlParams.get('utm_source');
            medium = urlParams.get('utm_medium') || 'referral';
        } else if (document.referrer) {
            let referrer = new URL(document.referrer);
            source = referrer.hostname;
            medium = 'referral';
        }

        // Track user source
        trackEvent('Traffic', 'user_source', source + ' - ' + medium);
        
        // Track device type
        let device = 'desktop';
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            device = 'mobile';
        }
        trackEvent('Device', 'device_type', device);
    }

    // Initialize tracking
    trackPageEngagement();
    trackUserInteractions();
    trackUserSource();

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 45) {
            $('.navbar').addClass('sticky-top shadow-sm');
        } else {
            $('.navbar').removeClass('sticky-top shadow-sm');
        }
    });
    
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        trackEvent('Navigation', 'back_to_top', 'scroll_to_top');
        return false;
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        center: true,
        margin: 24,
        dots: true,
        loop: true,
        nav : false,
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            },
            992:{
                items:3
            }
        }
    });
    

    // Fade in videos when ready
    $(document).ready(function() {
        $('video').each(function() {
            var video = this;
            video.addEventListener('canplay', function() {
                $(video).addClass('loaded');
                // Hide poster image if present
                var $poster = $(video).siblings('.about-poster-img, .hero-poster-img');
                if ($poster.length) {
                    $poster.addClass('hide');
                }
            });
            // For browsers that fire 'playing' instead
            video.addEventListener('playing', function() {
                $(video).addClass('loaded');
                var $poster = $(video).siblings('.about-poster-img, .hero-poster-img');
                if ($poster.length) {
                    $poster.addClass('hide');
                }
            });
        });
    });

})(jQuery);

