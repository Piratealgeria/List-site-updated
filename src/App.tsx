/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MusicPlayer } from './components/MusicPlayer';
import { Home } from './pages/Home';
import { PostDetail } from './pages/PostDetail';

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen font-sans bg-[#030303] text-white selection:bg-emerald-500/30">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
        </Routes>
        <MusicPlayer />
      </div>
    </Router>
  );
}
