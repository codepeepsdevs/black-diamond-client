import { useState, useEffect } from "react";

const useScrolledAway = () => {
  const [scrolledAway, setScrolledAway] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the scroll position is greater than 0
      if (window.scrollY > 0) {
        setScrolledAway(true);
      } else {
        setScrolledAway(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return scrolledAway;
};

export default useScrolledAway;
