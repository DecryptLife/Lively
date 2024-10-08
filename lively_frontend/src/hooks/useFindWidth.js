import { useEffect, useRef, useState } from "react";

const useMeasureWidth = () => {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setWidth(ref.current.offsetWidth);
    }
  }, []);

  return [ref, width];
};

export default useMeasureWidth;
