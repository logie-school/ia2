"use client";

import { useRef, useState, useEffect } from "react";

export default function Map() {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, width: 533, height: 480 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Disable scrolling on the page
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = ""; // Re-enable scrolling when component unmounts
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    setIsPanning(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    if (!isPanning) return;

    const dx = (e.clientX - startPoint.x) * (viewBox.width / window.innerWidth);
    const dy = (e.clientY - startPoint.y) * (viewBox.height / window.innerHeight);

    setViewBox((prev) => ({
      ...prev,
      x: prev.x - dx,
      y: prev.y - dy,
    }));

    setStartPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();

    const zoomFactor = 1.1;
    const scale = e.deltaY > 0 ? zoomFactor : 1 / zoomFactor;

    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate mouse position relative to the SVG's viewBox
    const mouseX = (e.clientX - rect.left) / rect.width;
    const mouseY = (e.clientY - rect.top) / rect.height;

    setViewBox((prev) => {
      const newWidth = prev.width * scale;
      const newHeight = prev.height * scale;

      const dx = (mouseX * prev.width) * (1 - scale);
      const dy = (mouseY * prev.height) * (1 - scale);

      return {
        x: prev.x + dx,
        y: prev.y + dy,
        width: newWidth,
        height: newHeight,
      };
    });
  };

  return (
    <div
      className="w-screen h-screen absolute top-0 right-0 box-border bg-[#F9F9F9]"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="h-full box-border relative">
        <div
          className="bg-white/80 z-[2147483647] w-[250px] inset-0 m-4 p-4 absolute box-border ml-auto right-0 border-1 border-[#e4e4e455] rounded-xl shadow"
          style={{ backdropFilter: "blur(20px)" }}
        >
          <div className="flex flex-col justify-between h-full">
            <h1 className="text-2xl font-bold">B Block</h1>
            <div>
              <button className="btn w-full">Back to map</button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-0">
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}
          xmlns="http://www.w3.org/2000/svg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onWheel={handleWheel}
        >
          <path
            d="M153.592 285.989L47.9843 296.504C45.233 296.778 43.2263 299.233 43.5052 301.983L60.9911 474.48C61.2714 477.245 63.7529 479.251 66.5154 478.945L174.017 467.051C176.767 466.747 178.747 464.268 178.436 461.519L159.055 290.401C158.747 287.684 156.313 285.718 153.592 285.989Z"
            fill="#E8E8E8"
            stroke="#D9D9D9"
            strokeWidth="2"
          />
          <path
            d="M171.539 133.419C177.284 167.558 173.031 200.011 161.562 224.874C150.091 249.742 131.458 266.921 108.461 270.791C85.4634 274.661 62.2341 264.527 43.2555 244.783C24.2811 225.044 9.64083 195.77 3.89578 161.63C-1.84927 127.491 2.40334 95.0377 13.8719 70.175C25.343 45.3067 43.976 28.1279 66.9735 24.2578C89.9709 20.3877 113.2 30.5218 132.179 50.2659C151.153 70.0056 165.794 99.2796 171.539 133.419Z"
            fill="#E8E8E8"
            stroke="#D9D9D9"
            strokeWidth="2"
          />
          {/* Add more paths as needed */}
        </svg>
      </div>
    </div>
  );
}