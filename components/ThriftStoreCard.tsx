
import React from 'react';
import { ThriftStore } from '../types';
import { SparklesIcon } from './IconComponents';

interface ThriftStoreCardProps {
  store: ThriftStore;
}

const ThriftStoreCard: React.FC<ThriftStoreCardProps> = ({ store }) => {
  return (
    <div className="bg-white/70 backdrop-blur-sm border border-amber-200 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden p-6 mb-6">
      <div className="flex flex-col h-full">
        <h3 className="text-2xl font-bold text-amber-900 mb-2">{store.storeName}</h3>
        <p className="text-gray-700 mb-4 flex-grow">{store.summary}</p>
        
        <div>
          <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
            <SparklesIcon />
            Review Highlights
          </h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600 mb-4">
            {store.keyThemes.map((theme, index) => (
              <li key={index}>{theme}</li>
            ))}
          </ul>
        </div>
        
        {store.mapsUrl && (
          <a
            href={store.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto inline-block bg-amber-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors duration-300 text-center"
          >
            View on Google Maps
          </a>
        )}
      </div>
    </div>
  );
};

export default ThriftStoreCard;
