/*
	AI for Good Hub - Main JavaScript
	Enhanced functionality for modern web experience
*/

(function($) {
	'use strict';

	var $window = $(window),
		$body = $('body'),
		$header = $('#header');

	// Breakpoints
	breakpoints({
		xlarge:  [ '1281px',  '1680px' ],
		large:   [ '981px',   '1280px' ],
		medium:  [ '737px',   '980px'  ],
		small:   [ null,      '736px'  ]
	});

	// Page Load Animations
	$window.on('load', function() {
		window.setTimeout(function() {
			$body.removeClass('is-preload');
			initScrollAnimations();
		}, 100);
	});

	// Header Scroll Effect
	$window.on('scroll', function() {
		var scrollTop = $window.scrollTop();
		
		if (scrollTop > 100) {
			$header.addClass('scrolled');
		} else {
			$header.removeClass('scrolled');
		}
	});

	// Smooth Scrolling for Anchor Links
	$('a[href^="#"]').on('click', function(e) {
		var href = this.getAttribute('href');
		var target = $(href);
		
		// Skip if it's just a hash without target or if target doesn't exist
		if (href === '#' || !target.length) {
			return;
		}
		
		e.preventDefault();
		
		// Calculate offset position
		var offsetTop = target.offset().top - 90;
		
		// Smooth scroll animation
		$('html, body').animate({
			scrollTop: offsetTop
		}, 800, 'swing', function() {
			// Update URL hash after animation completes
			if (history.pushState) {
				history.pushState(null, null, href);
			} else {
				location.hash = href;
			}
		});
	});

	// Mobile Menu Toggle
	$('.mobile-menu-toggle').on('click', function() {
		$(this).toggleClass('active');
		$('#nav').toggleClass('active');
		$body.toggleClass('nav-open');
	});

	// Close mobile menu when clicking outside
	$(document).on('click', function(e) {
		if (!$(e.target).closest('#nav, .mobile-menu-toggle').length) {
			$('.mobile-menu-toggle').removeClass('active');
			$('#nav').removeClass('active');
			$('.dropdown').removeClass('active');
			$body.removeClass('nav-open');
		}
	});
	
	// Close mobile menu when clicking on a non-dropdown link
	$('#nav a').not('.dropdown > a').on('click', function() {
		$('.mobile-menu-toggle').removeClass('active');
		$('#nav').removeClass('active');
		$('.dropdown').removeClass('active');
		$body.removeClass('nav-open');
	});

	// Dropdown Menu Functionality
	if (window.innerWidth > 768) {
		// Desktop hover behavior
		$('.dropdown').on('mouseenter', function() {
			$(this).addClass('active');
		}).on('mouseleave', function() {
			$(this).removeClass('active');
		});
	} else {
		// Mobile click behavior
		$('.dropdown > a').on('click', function(e) {
			e.preventDefault();
			$(this).parent().toggleClass('active');
		});
	}
	
	// Handle dropdown behavior on window resize
	$(window).on('resize', function() {
		if (window.innerWidth > 768) {
			// Remove mobile click handlers and add desktop hover
			$('.dropdown').off('click').on('mouseenter', function() {
				$(this).addClass('active');
			}).on('mouseleave', function() {
				$(this).removeClass('active');
			});
		} else {
			// Remove desktop hover handlers and add mobile click
			$('.dropdown').off('mouseenter mouseleave').find('> a').on('click', function(e) {
				e.preventDefault();
				$(this).parent().toggleClass('active');
			});
		}
	});

	// Stats Counter Animation
	function animateStats() {
		$('.stat-number').each(function() {
			var $this = $(this);
			var target = parseInt($this.text().replace(/[^\d]/g, ''));
			var suffix = $this.text().replace(/[\d]/g, '');
			
			$({ counter: 0 }).animate({ counter: target }, {
				duration: 2000,
				easing: 'swing',
				step: function() {
					$this.text(Math.ceil(this.counter) + suffix);
				},
				complete: function() {
					$this.text(target + suffix);
				}
			});
		});
	}

	// Scroll Animations
	function initScrollAnimations() {
		var $animateElements = $('.animate-on-scroll');
		
		if ($animateElements.length) {
			var observer = new IntersectionObserver(function(entries) {
				entries.forEach(function(entry) {
					if (entry.isIntersecting) {
						$(entry.target).addClass('animated');
					}
				});
			}, {
				threshold: 0.1,
				rootMargin: '0px 0px -50px 0px'
			});

			$animateElements.each(function() {
				observer.observe(this);
			});
		}

		// Trigger stats animation when stats section is visible
		var statsObserver = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				if (entry.isIntersecting) {
					animateStats();
					statsObserver.unobserve(entry.target);
				}
			});
		}, {
			threshold: 0.5
		});

		var $statsSection = $('.stats-section');
		if ($statsSection.length) {
			statsObserver.observe($statsSection[0]);
		}
	}

	// Form Handling
	$('form').on('submit', function(e) {
		var $form = $(this);
		var $submitBtn = $form.find('button[type="submit"], input[type="submit"]');
		
		// Add loading state
		$submitBtn.addClass('loading').prop('disabled', true);
		
		// Remove loading state after 3 seconds (adjust based on your needs)
		setTimeout(function() {
			$submitBtn.removeClass('loading').prop('disabled', false);
		}, 3000);
	});

	// Video Background Handling
	function handleVideoBackground() {
		var $video = $('.hero-video');
		
		if ($video.length) {
			// Pause video on mobile to save bandwidth
			if (window.innerWidth < 768) {
				$video[0].pause();
				$video.hide();
			} else {
				$video.show();
				$video[0].play();
			}
		}
	}

	// Handle video on resize
	$window.on('resize', function() {
		handleVideoBackground();
	});

	// Initialize video handling
	handleVideoBackground();

	// Lazy Loading for Images
	function initLazyLoading() {
		if ('IntersectionObserver' in window) {
			var imageObserver = new IntersectionObserver(function(entries, observer) {
				entries.forEach(function(entry) {
					if (entry.isIntersecting) {
						var img = entry.target;
						img.src = img.dataset.src;
						img.classList.remove('lazy');
						imageObserver.unobserve(img);
					}
				});
			});

			document.querySelectorAll('img[data-src]').forEach(function(img) {
				imageObserver.observe(img);
			});
		}
	}

	// Initialize lazy loading
	initLazyLoading();

	// Accessibility Improvements
	function initAccessibility() {
		// Add keyboard navigation for dropdowns
		$('.dropdown > a').on('keydown', function(e) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				$(this).parent().toggleClass('active');
			}
		});

		// Add ARIA attributes
		$('.dropdown').attr('aria-haspopup', 'true');
		$('.dropdown-menu').attr('role', 'menu');
		$('.dropdown-menu a').attr('role', 'menuitem');

		// Focus management for mobile menu
		$('.mobile-menu-toggle').on('click', function() {
			if ($('#nav').hasClass('active')) {
				$('#nav a:first').focus();
			}
		});
	}

	// Initialize accessibility features
	initAccessibility();

	// Performance Optimization
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	// Debounced scroll handler
	var debouncedScrollHandler = debounce(function() {
		var scrollTop = $window.scrollTop();
		
		// Header scroll effect
		if (scrollTop > 100) {
			$header.addClass('scrolled');
		} else {
			$header.removeClass('scrolled');
		}

		// Parallax effect for hero section (optional)
		var $hero = $('#hero');
		if ($hero.length && scrollTop < $hero.height()) {
			$hero.css('transform', 'translateY(' + scrollTop * 0.5 + 'px)');
		}
	}, 10);

	$window.on('scroll', debouncedScrollHandler);

	// Error Handling
	window.addEventListener('error', function(e) {
		console.error('JavaScript error:', e.error);
		// You can add error reporting here
	});

	// Service Worker Registration (for PWA features)
	if ('serviceWorker' in navigator) {
		window.addEventListener('load', function() {
			navigator.serviceWorker.register('/sw.js')
				.then(function(registration) {
					console.log('SW registered: ', registration);
				})
				.catch(function(registrationError) {
					console.log('SW registration failed: ', registrationError);
				});
		});
	}

	// Analytics Event Tracking
	function trackEvent(category, action, label) {
		if (typeof gtag !== 'undefined') {
			gtag('event', action, {
				event_category: category,
				event_label: label
			});
		}
	}

	// Track button clicks
	$('.btn').on('click', function() {
		var buttonText = $(this).text().trim();
		trackEvent('Button', 'Click', buttonText);
	});

	// Track form submissions
	$('form').on('submit', function() {
		var formId = $(this).attr('id') || 'Unknown Form';
		trackEvent('Form', 'Submit', formId);
	});

	// Track external link clicks
	$('a[href^="http"]').on('click', function() {
		var url = $(this).attr('href');
		trackEvent('External Link', 'Click', url);
	});

	// Initialize everything when DOM is ready
	$(document).ready(function() {
		// Add any additional initialization here
		console.log('AI for Good Hub website initialized');
	});

})(jQuery);

// Additional utility functions
function showNotification(message, type = 'info') {
	var notification = $('<div class="notification notification-' + type + '">' + message + '</div>');
	$('body').append(notification);
	
	setTimeout(function() {
		notification.addClass('show');
	}, 100);
	
	setTimeout(function() {
		notification.removeClass('show');
		setTimeout(function() {
			notification.remove();
		}, 300);
	}, 3000);
}

// Expose utility functions globally
window.AIForGoodHub = {
	showNotification: showNotification
};