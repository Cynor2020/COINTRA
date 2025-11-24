import React from 'react';

const SkeletonLoader = ({ className = '', type = 'default' }) => {
  if (type === 'table') {
    return (
      <tr className="animate-pulse">
        <td className="px-4 py-3">
          <div className="rounded bg-[#19191c] h-4 w-6" />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <div className="rounded-full bg-[#19191c] h-8 w-8" />
            <div>
              <div className="rounded bg-[#19191c] h-4 w-24 mb-2" />
              <div className="rounded bg-[#19191c] h-3 w-16" />
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-right">
          <div className="rounded bg-[#19191c] h-4 w-20 ml-auto" />
        </td>
        <td className="px-4 py-3 text-right">
          <div className="rounded bg-[#19191c] h-4 w-16 ml-auto" />
        </td>
        <td className="px-4 py-3 text-right">
          <div className="rounded bg-[#19191c] h-4 w-16 ml-auto" />
        </td>
        <td className="px-4 py-3 text-right">
          <div className="rounded bg-[#19191c] h-4 w-16 ml-auto" />
        </td>
        <td className="px-4 py-3 text-right">
          <div className="rounded bg-[#19191c] h-4 w-24 ml-auto" />
        </td>
        <td className="px-4 py-3 text-right">
          <div className="rounded bg-[#19191c] h-4 w-24 ml-auto" />
        </td>
        <td className="px-4 py-3 text-right">
          <div className="rounded bg-[#19191c] h-4 w-32 ml-auto" />
        </td>
        <td className="px-4 py-3">
          <div className="h-10 w-24 bg-[#19191c] rounded" />
        </td>
        <td className="px-4 py-3 text-right">
          <div className="rounded-full bg-[#19191c] h-8 w-8 ml-auto" />
        </td>
      </tr>
    );
  }
  
  if (type === 'card') {
    return (
      <div className={`animate-pulse rounded-xl bg-[#19191c] ${className}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-[#19191c] h-10 w-10" />
              <div>
                <div className="rounded bg-[#19191c] h-4 w-24 mb-2" />
                <div className="rounded bg-[#19191c] h-3 w-16" />
              </div>
            </div>
            <div className="rounded-full bg-[#19191c] h-6 w-6" />
          </div>
          <div className="flex justify-between items-center mb-3">
            <div className="rounded bg-[#19191c] h-6 w-32" />
            <div className="flex items-center space-x-1">
              <div className="rounded bg-[#19191c] h-4 w-4" />
              <div className="rounded bg-[#19191c] h-4 w-16" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div className="rounded bg-[#19191c] h-3 w-12 mb-1" />
              <div className="rounded bg-[#19191c] h-4 w-16" />
            </div>
            <div>
              <div className="rounded bg-[#19191c] h-3 w-12 mb-1" />
              <div className="rounded bg-[#19191c] h-4 w-16" />
            </div>
            <div>
              <div className="rounded bg-[#19191c] h-3 w-20 mb-1" />
              <div className="rounded bg-[#19191c] h-4 w-24" />
            </div>
            <div>
              <div className="rounded bg-[#19191c] h-3 w-16 mb-1" />
              <div className="rounded bg-[#19191c] h-4 w-20" />
            </div>
          </div>
          <div className="h-12 bg-[#19191c] rounded" />
        </div>
      </div>
    );
  }
  
  return <div className={`animate-pulse rounded-xl bg-[#19191c] ${className}`} />;
};

export default SkeletonLoader;