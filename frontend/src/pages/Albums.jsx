import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { normalizeImagePath } from '../utils/imageHelper';
import { getAlbums } from '../api/albums';
import AlbumCard from '../components/AlbumCard.jsx';
import AlbumModal from '../components/AlbumModal.jsx';

export default function Albums({ cart, setCart, searchTerm = '' }) {
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [justAddedId, setJustAddedId] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getAlbums()
            .then((data) => {
                // Calculate price for each album
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

            <div className='max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {filtered.map((album) => (
                    <div key={album.id} onClick={() => setSelectedAlbum(album)}>
                        <AlbumCard key={album.id} album={album} addToCart={addToCart} justAddedId={justAddedId} />
                    </div>
                ))}
            </div>

            <div className='flex justify-center mt-12 mb-8'>
                <button onClick={() => navigate('/cart')} className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'>
                    Go to Cart ({cart.length})
                </button>
            </div>

            <AlbumModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
        </div>
    );
}
