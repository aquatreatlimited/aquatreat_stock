import React from 'react';

const OfflinePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">You are offline</h1>
      <p>Please check your internet connection and try again.</p>
    </div>
  );
};

export default OfflinePage;
