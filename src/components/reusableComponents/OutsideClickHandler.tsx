import React, { useRef, useEffect } from "react";
import { OutsideClickHandlerProps } from "../../services/interfaces";

const OutsideClickHandler: React.FC<OutsideClickHandlerProps> = ({
  children,
  onOutsideClick,
  isPressed,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        ref.current &&
        !ref.current.contains(event.target as Node) &&
        isPressed
      ) {
        onOutsideClick();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
  }, [onOutsideClick]);

  return <div ref={ref}>{children}</div>;
};

export default OutsideClickHandler;
