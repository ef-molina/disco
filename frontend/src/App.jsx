import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import Albums from './pages/Albums';
import Artists from './pages/Artists';
import ArtistDetail from './pages/ArtistDetail';
import Genres from './pages/Genres';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
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
        <div className='max-w-screen-2xl flex flex-col h-screen p-4 mx-auto'>
            {/* Navbar */}

            <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} cart={cart} />

            {/* Sidebar + Main */}
            <div className='flex flex-1 bg-gray-100  overflow-y-auto'>
                <aside className='border overflow-auto p-3'>
                    <Sidebar cart={cart} setCart={setCart} user={user} setUserLoggedIn={setUserLoggedIn} />
                </aside>

                {/* Main Content */}
                <main className='flex-1 p-6 bg-gray-100 border overflow-auto p-4'>
                    <Routes>
                        <Route path='/' element={<Navigate to='/genres' replace />} />
                        <Route path='/albums' element={<Albums cart={cart} setCart={setCart} searchTerm={searchTerm} />} />
                        <Route path='/genres' element={<Genres searchTerm={searchTerm} />} />
                        <Route path='/genres/:genreLink' element={<Artists searchTerm={searchTerm} />} />
                        <Route path='/artists' element={<Artists searchTerm={searchTerm} />} />
                        <Route path='/artists/:artistId' element={<ArtistDetail searchTerm={searchTerm} cart={cart} setCart={setCart} />} />
                        <Route path='/cart' element={<Cart cart={cart} setCart={setCart} searchTerm={searchTerm} />} />
                        <Route path='/checkout' element={<Checkout cart={cart} setCart={setCart} searchTerm={searchTerm} user={user} />} />
                        <Route path='/orders' element={<Orders user={user} searchTerm={searchTerm} />} />
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
