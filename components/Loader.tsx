
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-full animate-spin border-4 border-solid border-amber-600 border-t-transparent"></div>
      <p className="mt-4 text-lg text-amber-800 font-semibold">Finding the best spots...</p>
      <p className="text-sm text-gray-600">Analyzing reviews and comments now!</p>
    </div>
  );
};

export default Loader;
