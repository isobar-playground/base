import Swiper from "swiper";
import { Navigation, FreeMode, Pagination, Scrollbar } from "swiper/modules";

(function (Drupal, Swiper) {
  Drupal.behaviors.sliderSwiper = {
    attach: function (context, settings) {
      // Ensure the Swiper is initialized only once per .swiper element.

      once("swiperInit", ".swiper", context).forEach(function (swiperElement) {
        new Swiper(swiperElement, {
          modules: [Navigation, FreeMode, Navigation, Pagination, Scrollbar],
          loop: false,
          autoHeight: true,
          spaceBetween: 24,
          slidesPerView: 1.2,
          grabCursor: true,
          centeredSlides: false,
          touchReleaseOnEdges: true,
        });
      });
    },
  };
})(Drupal, Swiper);
