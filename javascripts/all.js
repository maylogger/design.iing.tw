var is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// open menu
$('.menu-btn, .off-canvas-mask, .close-btn, .menu-list-item-title, .menu-sub-list-item > a').on('click', function () {
  $('body').toggleClass('is-open-menu');
  $('.menu-btn').toggleClass('is-open-menu');
});

// smooth scroll
$('.smooth-scroll-link').smoothScroll();

// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = 120;
// var offset_top = $('#guideline-summary').offset().top;
var window_height = $(window).height();
$(window).resize(function(){
  // offset_top = $('#guideline-summary .demo-block-title').offset().top;
  window_height = $(window).height();
  detectTouchTop();
})

$(window).scroll(function(event){
  detectTouchTop();
  didScroll = true;
});

setInterval(function() {
  if (didScroll) {
    hasScrolled();
    didScroll = false;
  }
}, 250);

function hasScrolled() {
  var st = $(this).scrollTop();
  var touch_bottom = $(document).height() - window_height - 120;

  // Make sure they scroll more than delta
  if(Math.abs(lastScrollTop - st) <= delta)
    return;

  // If they scrolled down and are past the navbar, add class .nav-up.
  // This is necessary so you never see what is "behind" the navbar.
  if (st > lastScrollTop && st > window_height){
    // Scroll Down
    $('.header-top, .back-to-top').removeClass('is-active').addClass('is-hide');
    $('body').removeClass('is-open-menu');

    // 當頁面接近底部的動作
    if ( st > touch_bottom ) {
      $('.header-top, .back-to-top').removeClass('is-hide').addClass('is-active');
      $('body').removeClass('is-open-menu');
    }
  } else {
    // Scroll Up

    // 當滾到底部
    if(st + window_height < $(document).height()) {
      $('.header-top, .back-to-top').removeClass('is-hide').addClass('is-active');
      $('body').removeClass('is-open-menu');
    }
  }
  // 當捲動還沒超出一個畫面的高度的時候
  if (st < window_height) {
    $('.back-to-top').removeClass('is-active');
  }

  lastScrollTop = st;
}

// 偵測是否在頂部
function detectTouchTop(st) {
  var st = $(this).scrollTop();
  // 目前無法自動偵測觸發點，rwd 時可能會失效
  if (st > 78) {
    $('.header-top').removeClass('is-top');
  } else {
    $('.header-top').addClass('is-top');
  }
}
detectTouchTop();

// 桌面版 menu sticky
// if (!Modernizr.touchevents && !is_mobile) {
//   $('.header-inner').hcSticky({
//       top: 24,
//       bottomEnd: 100,
//       noContainer: true,
//       responsive: true,
//       offResolutions: -960,
//       stickTo: '.page',
//   });
// }

// 手機版 menu sticky
// if (Modernizr.touchevents && is_mobile) {

//   var menu_height = $('.header-inner').outerHeight();
//   var touch_top = 36;
//   var touch_buttom = 120;
//   var menu_offset_top = menu_height - $(window).height();
//   var touch_bottom = $(document).height() - $(window).height() - touch_buttom;

//   $(window).resize(function(){
//     menu_height = $('.header-inner').outerHeight();
//     touch_top = 36;
//     touch_buttom = 120;
//     menu_offset_top = menu_height - $(window).height();
//     touch_bottom = $(document).height() - $(window).height() - touch_buttom;
//     mobileMenuSticky();
//   })

//   $(window).on('scroll', function(){
//     mobileMenuSticky();
//   })

//   function mobileMenuSticky() {

//     if ( $(window).width() > 960 ) {
//       $('.header').css({
//         'height': menu_height
//       })
//       var st = $(this).scrollTop();
//       if ( menu_offset_top < 0 ) {
//         $('.header-inner').css({
//           'position': 'fixed',
//           'top': touch_top
//         })
//       } else if ( st >= menu_offset_top + touch_top ) {
//         $('.header-inner').css({
//           'position': 'fixed',
//           'top': -menu_offset_top
//         })
//         if (st >= touch_bottom ){
//           $('.header-inner').css({
//             'position': 'absolute',
//             'top': touch_bottom - menu_offset_top
//           })
//         }
//       } else if (st < menu_offset_top + touch_top) {
//         $('.header-inner').css({
//           'position': 'static',
//           'top': 'auto',
//         })
//       }
//     } else {
//       $('.header').css({
//         'height': 'auto'
//       })
//       $('.header-inner').css({
//         'position': 'static',
//         'top': 'auto'
//       })
//     }
//   }

// }


// scrollfix
var ScrollFix = function(elem) {
  // Variables to track inputs
  var startY, startTopScroll;

  elem = elem || document.querySelector(elem);

  // If there is no element, then do nothing
  if(!elem)
    return;

  // Handle the start of interactions
  elem.addEventListener('touchstart', function(event){
    startY = event.touches[0].pageY;
    startTopScroll = elem.scrollTop;

    if(startTopScroll <= 0)
      elem.scrollTop = 1;

    if(startTopScroll + elem.offsetHeight >= elem.scrollHeight)
      elem.scrollTop = elem.scrollHeight - elem.offsetHeight - 1;
  }, false);
};
var scrollable = document.getElementById("scrollable");
new ScrollFix(scrollable);
