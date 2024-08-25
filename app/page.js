"use client";
import getFilteredCases from "@/Backend/Data/GetDataBasesOn";
import getFilteredGPUs from "@/Backend/Data/GetGpu";
import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [cases, setCases] = useState([]);
  const [length, setLength] = useState(285);
  const [height, setHeight] = useState(112);
  const [thickness, setThickness] = useState(2);
  const [searchText, setSearchText] = useState("");
  const [gpus, setGpus] = useState([]);
  const [selectedGpu, setSelectedGpu] = useState(null); // State to hold the selected GPU
  const [visibleCount, setVisibleCount] = useState(8);

  const buttonContainerRef = useRef(null); // Create a ref for the button container

  const loadMore = () => {
    setVisibleCount((prevCount) => prevCount + 4);
  };

  useEffect(() => {
    async function getData() {
      const filteredCases = await getFilteredCases(length, height, thickness);
      setCases(filteredCases);
    }
    getData();
  }, [length, height, thickness]);

  useEffect(() => {
    // Append the "Buy Me a Coffee" script to the button container
    const script = document.createElement("script");
    script.src = "https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js";
    script.setAttribute("data-name", "bmc-button");
    script.setAttribute("data-slug", "DanielOliveira");
    script.setAttribute("data-color", "#FFDD00");
    script.setAttribute("data-font", "Inter");
    script.setAttribute("data-text", "Buy me a coffee?");
    script.setAttribute("data-outline-color", "#000000");
    script.setAttribute("data-font-color", "#000000");
    script.setAttribute("data-coffee-color", "#ffffff");
    script.async = true;
    buttonContainerRef.current.appendChild(script);
  }, []); // Empty dependency array to run only on mount

  const handleLengthChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) setLength(value);
  };

  const handleHeightChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) setHeight(value);
  };

  const handleThicknessChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0) setThickness(value);
  };

  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (value) {
      const filteredGpus = await getFilteredGPUs(value);
      setGpus(filteredGpus);
    } else {
      setGpus([]); // Clear results if the search input is empty
    }
  };

  const handleGpuSelection = (gpuItem) => {
    // Set the selected GPU and update dimensions
    setSearchText(gpuItem.title);
    setSelectedGpu(gpuItem);
    setLength(gpuItem.length); // Assuming `length` is a property of the GPU
    setHeight(gpuItem.height); // Assuming `height` is a property of the GPU
    setThickness(gpuItem.thickness); // Assuming `thickness` is a property of the GPU
  };

  const gpuimagelocation = `/images-gpu/${selectedGpu?.image_id}.jpg`;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 relative">
      {/* Your existing JSX code... */}
      
      {/* Display cases and load more button */}
      <div className="flex flex-col justify-center items-center gap-10">
        <div className="w-8/12">
          {/* Search and GPU selection... */}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {cases.slice(0, visibleCount).map((caseItem, index) => {
            const imagelocation1 = `/images/${caseItem.image_id}/1.jpg`;
            return (
              <div
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <a href={caseItem.url}>
                  <img
                    src={imagelocation1}
                    alt={`Case Image ${index + 1}`}
                    className="w-full h-48 object-cover bg-slate-200"
                  />
                </a>
                <p className="flex justify-center items-center text-sm">
                  {caseItem.product_name}
                </p>
              </div>
            );
          })}
        </div>
        {visibleCount < cases.length && (
          <div className="flex justify-center mt-5">
            <button
              onClick={loadMore}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Button container for the "Buy Me a Coffee" button */}
      <div ref={buttonContainerRef} className="mt-8"></div>
    </div>
  );
}
