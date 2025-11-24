import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './organisms/Navbar';
import Sidebar from './organisms/Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}