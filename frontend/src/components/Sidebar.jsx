import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { MdHome, MdAlbum, MdLibraryMusic, MdLogout, MdShoppingCart, MdPerson } from 'react-icons/md';
import { FaUser, FaHeart, FaReceipt } from 'react-icons/fa';

/**
 *
 * Sidebar component for navigation links in the application.
 *
 * This component provides navigation links to various sections of the application,
 * including Home, Albums, Artists, Genres, Cart, Orders, Wishlist, and Account.
 * It also includes a logout button that clears the user's login state and redirects to the login page.
 */
const Sidebar = ({ setUserLoggedIn }) => {
    const navigate = useNavigate();

    // handle logout
    const handleLogout = () => {
        localStorage.removeItem('userLoggedIn');
        setUserLoggedIn(false);
        navigate('/login');
    };

    // higlight the active link
    const linkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg text-bold font-large transition-colors ${isActive ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-200'}`;

    return (
        <div className='flex flex-col h-full justify-between'>
            <div className='flex flex-col space-y-4'>
                {/* Navigation Side bar Top Section */}
                <div className='space-y-1'>
                    <NavLink to='/genres' className={linkClasses}>
                        <MdLibraryMusic className='text-xl' />
                        <span className='hidden sm:inline'>Genres</span>
                    </NavLink>

                    <NavLink to='/albums' className={linkClasses}>
                        <MdAlbum className='text-xl' />
                        <span className='hidden sm:inline'>Albums</span>
                    </NavLink>
                    <NavLink to='/artists' className={linkClasses}>
                        <MdPerson className='text-xl' />
                        <span className='hidden sm:inline'>Artists</span>
                    </NavLink>
                </div>
            </div>

            {/* Navigation Side bar Bottom Section */}
            <div>
                <NavLink to='/cart' className={linkClasses}>
                    <MdShoppingCart className='text-xl' />
                    <span className='hidden sm:inline'>Cart</span>
                </NavLink>
                <NavLink to='/orders' className={linkClasses}>
                    <FaReceipt className='text-xl' />
                    <span className='hidden sm:inline'>Orders</span>
                </NavLink>

                <button onClick={handleLogout} className='w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-100'>
                    <MdLogout className='text-xl' />
                    <span className='hidden sm:inline'>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
