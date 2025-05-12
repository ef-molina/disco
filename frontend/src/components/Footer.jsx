import React from 'react';

/* *
 *  Footer component for the AlbumStore application.
 *  Displays app info and links to terms, privacy, and contact pages.
 */
const Footer = () => {
    return (
        <footer className='w-full bg-gray-900 text-white py-6 mt-auto'>
            <div className='max-w-screen-2xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm'>
                {/* Left: App Info */}
                <div className='text-center sm:text-left'>
                    <p className='font-semibold'>© {new Date().getFullYear()} AlbumStore</p>
                    <p className='text-gray-400'>Built for music lovers everywhere 🎶</p>
                </div>

                {/* Right: Links */}
                <div className='flex space-x-6'>
                    <a href='' className='hover:underline text-gray-300'>
                        Terms
                    </a>
                    <a href='' className='hover:underline text-gray-300'>
                        Privacy
                    </a>
                    <a href='' className='hover:underline text-gray-300'>
                        Contact
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
