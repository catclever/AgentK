import React, { useEffect, useState } from 'react';

export const UserCard = ({ data, actions, style }: any) => {
  const [promoteStatus, setPromoteStatus] = useState('');

  useEffect(() => {
    // 组件作为“自治实体”，在这里通过 actions.on() 监听来自其他组件传来的动作
    const unsubscribe = actions.on('do_promote', (payload: any) => {
      console.log('Received do_promote action via One-Hop network!', payload);
      setPromoteStatus(`(Promoted via ${payload.source})`);
    });
    return () => unsubscribe();
  }, [actions]);

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
        <h3 className="font-bold text-lg text-gray-800">{data.name || 'No Name'} {promoteStatus}</h3>
        <p className="text-sm text-gray-500">{data.role || 'No Role'}</p>
        <p className="text-xs text-gray-400 mt-1">{data.email || 'No Email'}</p>
        <div className="text-xs text-left bg-gray-100 mt-2 p-2 rounded overflow-auto max-h-24">
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
      <button 
        className="mt-auto px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
        onClick={() => {
           // 纯粹地 emit 出一个事件，抛给相连的触须网络
           actions.emit('promote_clicked', { userId: data.id });
        }}
      >
        Promote
      </button>
    </div>
  );
};
