import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MdShoppingCart } from 'react-icons/md';
import logo from '../assets/logo.svg';

/**
 *
 * Navbar component for the application.
 * This component includes a logo, search bar, and cart icon.
 * It allows users to search for albums, artists, or genres,
 * and view the number of items in their cart.
 */
const Navbar = ({ searchTerm, setSearchTerm, cart = [] }) => {
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Search term:', searchTerm);
        // The searchTerm state is already being updated in onChange
    };

    return (
        <div className='w-full bg-gray-800 text-white py-4 px-4'>
            <div className='max-w-screen-2xl mx-auto flex sm:flex-row items-center justify-between gap-4'>
                {/* Logo + App Name */}
                <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate('/home')}>
                    <img src={logo} alt='Logo' className='w-10 h-10' />
                    <span className='text-2xl font-bold hidden sm:inline'>Disco</span>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className='relative w-full sm:w-[50%] md:w-[60%] lg:w-[40%]'>
                    <input
                        type='text'
                        placeholder='Search albums, artists, or genres...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full pl-10 pr-4 py-2 rounded-md text-black bg-white focus:outline-none border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500'
                    />
                    <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>🔍</div>
                </form>

                {/* Cart */}
                <div className='relative cursor-pointer text-2xl' onClick={() => navigate('/cart')}>
                    <MdShoppingCart className='w-8 h-8' />
                    {cart.length > 0 && <span className='absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full'>{cart.length}</span>}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
