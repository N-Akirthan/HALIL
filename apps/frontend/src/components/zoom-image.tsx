import { useState } from "react";

export default function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const [isHovering, setIsHovering] = useState(false);
  const [backgroundPosition, setBackgroundPosition] = useState("center");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setBackgroundPosition(`${x}% ${y}%`);
  };

  return (
    <div
      className="cursor-pointer rounded-lg shadow-lg"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      style={
        isHovering
          ? {
              backgroundImage: `url(${src})`,
              backgroundSize: "100%",
              backgroundPosition,
            }
          : {}
      }
    >
      <img
        src={src}
        alt={alt}
        className={`w-full max-h-[300px] min-h-[300px] object-contain rounded-lg shadow-lg transition-opacity duration-300 ${
          isHovering ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
