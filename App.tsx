
import React, { useState, useCallback } from 'react';
import { ThriftStore } from './types';
import { findThriftStores } from './services/geminiService';
import ThriftStoreCard from './components/ThriftStoreCard';
import Loader from './components/Loader';
import { SearchIcon, MapPinIcon, TagIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [location, setLocation] = useState<string>('');
  const [item, setItem] = useState<string>('');
  const [results, setResults] = useState<ThriftStore[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location || !item) {
      setError('Please enter both a location and an item to search for.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const storeResults = await findThriftStores(location, item);
      setResults(storeResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [location, item]);

  return (
    <div className="min-h-screen bg-amber-50 font-sans text-gray-800">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-2">Thrift Store Treasure Map</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Uncover hidden gems. Enter a location and what you're looking for, and we'll find the best thrift stores for you.
          </p>
        </header>

        <div className="max-w-2xl mx-auto bg-white/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-lg border border-amber-200">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MapPinIcon />
                  </div>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., San Francisco, CA"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="item" className="block text-sm font-medium text-gray-700 mb-1">Item to find</label>
                 <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <TagIcon />
                  </div>
                  <input
                    id="item"
                    type="text"
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    placeholder="e.g., vintage denim jacket"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 bg-amber-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <SearchIcon />
              {isLoading ? 'Searching...' : 'Find Stores'}
            </button>
          </form>
        </div>

        <div className="mt-12">
          {isLoading && <Loader />}
          {error && <div className="text-center p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg max-w-2xl mx-auto">{error}</div>}
          
          {!isLoading && results && results.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((store) => (
                <ThriftStoreCard key={store.storeName} store={store} />
              ))}
            </div>
          )}

          {!isLoading && results && results.length === 0 && (
             <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-gray-700">No results found</h3>
                <p className="text-gray-500 mt-2">We couldn't find any specific recommendations for that item in that location. Try a broader search!</p>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
