import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Albums from './pages/Albums';
import Artists from './pages/Artists';
import ArtistDetail from './pages/ArtistDetail';
import Genres from './pages/Genres';
import ArtistAlbums from './pages/ArtistAlbums';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Account from './pages/Account';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
    const [userLoggedIn, setUserLoggedIn] = useState(localStorage.getItem('userLoggedIn') === 'true');
    const [user, setUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);

    if (!userLoggedIn) {
        return (
            <Routes>
                <Route path='/login' element={<Login setUserLoggedIn={setUserLoggedIn} setUser={setUser} />} />
                <Route path='/register' element={<Register />} />
                <Route path='*' element={<Navigate to='/login' replace />} />
            </Routes>
        );
    }

    return (
        <div className='flex flex-col h-screen'>
            {/* Navbar */}
            <header className='h-[7%] bg-gray-800 text-white flex items-center px-4'>
                <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} cart={cart} />
            </header>

            {/* Sidebar + Main */}
            <div className='flex flex-1 overflow-hidden'>
                <aside className='w-60 border-r overflow-auto'>
                    <Sidebar cart={cart} setCart={setCart} user={user} setUserLoggedIn={setUserLoggedIn} />
                </aside>

                <main className='flex-1 p-6 bg-gray-100 overflow-auto'>
                    <Routes>
                        <Route path='/' element={<Navigate to='/home' replace />} />
                        <Route path='/home' element={<Home searchTerm={searchTerm} />} />
                        <Route path='/albums' element={<Albums cart={cart} setCart={setCart} searchTerm={searchTerm} />} />
                        <Route path='/genres' element={<Genres searchTerm={searchTerm} />} />
                        <Route path='/genres/:genreLink' element={<Artists searchTerm={searchTerm} />} />
                        <Route path='/artists' element={<Artists searchTerm={searchTerm} />} />
                        <Route path='/artists/:artistId' element={<ArtistDetail searchTerm={searchTerm} cart={cart} setCart={setCart} />} />
                        <Route path='/cart' element={<Cart cart={cart} setCart={setCart} searchTerm={searchTerm} />} />
                        <Route path='/orders' element={<Orders searchTerm={searchTerm} />} />
                        <Route path='/account' element={<Account searchTerm={searchTerm} user={user} />} />
                    </Routes>
                </main>
            </div>

            {/* Footer */}
            <footer className='h-[8%]'>
                <Footer />
            </footer>
        </div>
    );
}
