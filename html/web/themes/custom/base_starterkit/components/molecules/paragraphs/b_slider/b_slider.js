(function (Drupal, Swiper) {
  Drupal.behaviors.sliderSwiper = {
    attach: function (context, settings) {
      // Ensure the Swiper is initialized only once per .swiper element.
      once('swiperInit', '.swiper', context).forEach(function (swiperElement) {
        new Swiper(swiperElement, {
          // Optional parameters
          loop: true,
          centeredSlides: true,

          // Autoplay
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          },

          // Pagination
          pagination: {
            el: '.swiper-pagination',
            clickable: true,
          },

          // Navigation arrows
          navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
          },

          // Scrollbar
          scrollbar: {
            el: '.swiper-scrollbar',
          },
        });
      });
    },
  };
})(Drupal, Swiper);
