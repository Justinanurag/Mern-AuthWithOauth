import React,{useContext} from "react";
import { assets } from "../assets/assets";
import { AppContest } from "../context/appContest";

export const Header = () => {
  const {userData}=useContext(AppContest)
  

  return (
    <header className="flex flex-col items-center mt-16 px-4 sm:px-6 lg:px-8 text-center text-gray-900">
      <img
        src={assets.header_img}
        alt="Application logo"
        loading="lazy"
        className="w-32 h-32 sm:w-36 sm:h-36 rounded-full mb-6 object-cover"
      />

      <h1 className="flex items-center gap-2 text-xl sm:text-2xl md:text-3xl font-semibold mb-3 animate-fade-in">
        Hello, {userData?userData.name: "Devloper"}!
        <img
          src={assets.hand_wave}
          alt="Waving hand emoji"
          className="w-7 h-7 sm:w-8 sm:h-8"
        />
      </h1>

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
        Welcome to Our Application
      </h2>
      <p className="max-w-xl text-base sm:text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
        Discover a seamless experience with our innovative app. Connect, explore,
        and achieve your goals effortlessly.
      </p>
      <button
        type="button"
        className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-3 text-white font-medium
          hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500
          focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
        aria-label="Start using the application"
      >
        Get Started
      </button>
    </header>
  );
};
