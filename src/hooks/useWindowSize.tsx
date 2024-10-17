"use client";

import { useState, useEffect } from "react";

export default function useWindowsize() {
  const [width, setWidth] = useState<number>(1920);

  useEffect(() => {
    const updateWidth = () => {
      setWidth(window.innerWidth);
    };

    updateWidth();

    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  return width;
}
