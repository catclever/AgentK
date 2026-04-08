import React from 'react';

export const UserCard = ({ data, actions, style }: any) => {
  if (!data) return <div className="p-4 bg-gray-100 rounded">Loading User...</div>;

  return (
    <div 
      className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-4 border border-gray-200"
      style={{ ...style, width: '100%', height: '100%' }}
    >
      <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
        {data.name?.charAt(0) || '?'}
      </div>
      <div className="text-center">
        <h3 className="font-bold text-lg text-gray-800">{data.name || 'No Name'}</h3>
        <p className="text-sm text-gray-500">{data.role || 'No Role'}</p>
        <p className="text-xs text-gray-400 mt-1">{data.email || 'No Email'}</p>
        <div className="text-xs text-left bg-gray-100 mt-2 p-2 rounded overflow-auto max-h-24">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
      <button 
        className="mt-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        onClick={() => actions.update({ role: 'Promoted ' + data.role })}
      >
        Promote
      </button>
    </div>
  );
};
