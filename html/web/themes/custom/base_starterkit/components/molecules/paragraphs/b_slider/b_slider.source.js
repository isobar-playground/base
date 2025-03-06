import Swiper from "swiper";
import { Navigation, FreeMode, Pagination, Scrollbar } from "swiper/modules";

(function (Drupal, Swiper) {
  Drupal.behaviors.sliderSwiper = {
    attach: function (context, settings) {
      // Ensure the Swiper is initialized only once per .swiper element.

      once("swiperInit", ".b_slider.swiper", context).forEach(function (
        swiperElement
      ) {
        new Swiper(swiperElement, {
          modules: [Navigation, FreeMode, Navigation, Pagination, Scrollbar],
          loop: false,
          autoHeight: true,
          spaceBetween: 24,
          slidesPerView: 1,
          grabCursor: true,
          centeredSlides: false,
          touchReleaseOnEdges: true,
          navigation: {
            nextEl: swiperElement.querySelector(".swiper-button-next"),
            prevEl: swiperElement.querySelector(".swiper-button-prev"),
          },
          pagination: {
            el: swiperElement.querySelector(".swiper-pagination"),
            clickable: true,
          },
          scrollbar: {
            el: swiperElement.querySelector(".swiper-scrollbar"),
            clickable: true,
          },
        });
      });
    },
  };
})(Drupal, Swiper);
