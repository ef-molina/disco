import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeImagePath } from '../utils/imageHelper';
import { getAlbums } from '../api/albums';

export default function Albums({ cart, setCart, searchTerm = '' }) {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [justAddedId, setJustAddedId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getAlbums()
            .then((data) => {
                // Calculate price for each album similar to old logic
                const processed = data.map((alb, idx) => {
                    const releaseYear = alb.release_date ? new Date(alb.release_date).getFullYear() : new Date().getFullYear();
                    const age = new Date().getFullYear() - releaseYear;
                    let basePrice;
                    if (age < 2) basePrice = 18.99;
                    else if (age < 5) basePrice = 16.99;
                    else if (age < 10) basePrice = 14.99;
                    else if (age < 20) basePrice = 11.99;
                    else basePrice = 8.99;
                    // Random and edition factors
                    const randomFactor = Math.floor(Math.random() * 7) - 3;
                    const isSpecial = idx % 7 === 0;
                    const specialBonus = isSpecial ? 4.99 : 0;
                    let price = basePrice + randomFactor + specialBonus;
                    price = Math.max(price, 5.99);
                    price = Math.min(price, 29.99);
                    return {
                        ...alb,
                        img: normalizeImagePath(alb.img_url || alb.img || ''),
                        price: price.toFixed(2),
                        isSpecialEdition: isSpecial,
                        trackCount: alb.tracks?.length || 0,
                    };
                });
                setAlbums(processed);
            })
            .catch((err) => console.error('Error loading albums:', err))
            .finally(() => setLoading(false));
    }, []);

    const addToCart = (album) => {
        setJustAddedId(album.id);
        setTimeout(() => setJustAddedId(null), 2000);
        setCart((prev) => [...prev, album]);
    };

    const term = searchTerm.toLowerCase();
    const filtered = albums.filter((album) => (album.title || '').toLowerCase().includes(term) || (album.artistName || '').toLowerCase().includes(term));

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-100'>
                <p className='text-gray-500'>Loading albums…</p>
            </div>
        );
    }

    if (albums.length === 0) {
        return (
            <div className='min-h-screen p-6 bg-gray-100'>
                <p className='text-center text-gray-500'>No albums found.</p>
            </div>
        );
    }

    if (filtered.length === 0) {
        return (
            <div className='min-h-screen p-6 bg-gray-100'>
                <p className='text-center text-gray-500'>No albums match “{searchTerm}.”</p>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <header className='text-center mb-10'>
                <h1 className='text-3xl font-bold'>Browse Albums</h1>
                <p className='text-gray-600 mt-2'>
                    Showing {filtered.length} of {albums.length} albums
                </p>
            </header>

            <div className='max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8'>
                {filtered.map((album) => (
                    <div key={album.id} className='bg-white rounded-md shadow-lg p-6 flex flex-col h-full'>
                        <div className='w-full h-52 overflow-hidden'>
                            <img src={album.img} alt={album.title} className='w-full h-full object-cover object-center rounded-md mb-4' />
                        </div>
                        <div className='flex-1 flex flex-col'>
                            <div className='flex justify-between items-start'>
                                <h3 className='text-lg font-semibold mb-1 mt-2'>{album.title}</h3>
                                <span className='text-green-600 font-bold'>${album.price}</span>
                            </div>
                            <p className='text-sky-500'>{album.artistName}</p>
                            {album.release_date && <p className='text-gray-400 text-sm mb-2'>Released: {album.release_date}</p>}
                            {album.trackCount > 0 && <p className='text-gray-500 text-sm mb-2'>{album.trackCount} tracks</p>}
                            {album.isSpecialEdition && <div className='bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded mb-3 inline-block'>Special Edition</div>}
                            <div className='mt-auto pt-4'>
                                <button
                                    onClick={() => addToCart(album)}
                                    className={`w-full px-4 py-2 rounded text-white transition duration-200 ${justAddedId === album.id ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}>
                                    {justAddedId === album.id ? '✅ Added!' : 'Add to Cart'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className='flex justify-center mt-12 mb-8'>
                <button onClick={() => navigate('/cart')} className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'>
                    Go to Cart ({cart.length})
                </button>
            </div>
        </div>
    );
}
