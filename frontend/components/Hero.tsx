import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// import { Send } from "lucide-react";

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="w-full h-full flex justify-center items-start mt-6">
      <div className="bg-black flex items-center justify-center p-4">
        <div className="w-full">
          {/* Logo and Title Container */}
          <div className="flex items-center justify-center gap-x-14 mb-6 w-[70%] mx-auto">
            <Image
              src="/logo.png"
              alt="Memecoin Maverick"
              className="object-cover rounded-full"
              width={270}
              height={270}
            />

            {/* Product Name with Typewriting Effect */}
            <div>
              <span className="text-6xl font-extrabold h-16 bg-gradient-to-r from-white via-gray-200 to-gray-500 text-transparent bg-clip-text">
                Memecoin Maverick
              </span>
              <p className="text-lg text-gray-400 m-0 mt-2.5 w-[85%]">
                An AI agent that trades memecoins for you. It makes buy/sell moves based on your preferences and
                insights from top traders.
              </p>

              <p className="text-lg font-bold mt-4">Why Choose MemeCoin Maverick?</p>
              <ul className="list-disc text-gray-400 mt-4 ml-6 space-y-1">
                <li>
                  <span className="font-bold text-gray-300">Smart Trades, Your Way:</span> Automates trading based on
                  your preferences.
                </li>
                <li>
                  <span className="font-bold text-gray-300">Always On:</span> Trades 24/7 to seize every opportunity.
                </li>
                <li>
                  <span className="font-bold text-gray-300">Inspired by the Best:</span> Learns strategies from top
                  traders to optimize performance
                </li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => router.push("/create")}
            className="mx-auto mt-20 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-bold py-2 px-6 rounded-full transition duration-300 ease-in-out border border-blue-500/30 hover:border-blue-500/50 flex items-center space-x-2 text-xl pulsating-button"
          >
            Get your Maverick
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
