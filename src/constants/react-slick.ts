import Slider from "react-slick";

export const settings: React.ComponentProps<typeof Slider> = {
  dots: false,
  infinite: true,
  speed: 3000,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
  pauseOnHover: false,
  cssEase: "linear",
  draggable: false,
};
