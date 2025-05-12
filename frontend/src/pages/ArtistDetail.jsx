// src/pages/ArtistDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { normalizeImagePath } from '../utils/imageHelper';
import { getArtistById } from '../api/artists';
import AlbumCard from '../components/AlbumCard.jsx';
import AlbumModal from '../components/AlbumModal.jsx';

export default function ArtistDetail({ cart, setCart, searchTerm = '' }) {
    const { artistId } = useParams();
    const navigate = useNavigate();

    const [artist, setArtist] = useState(null);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [justAddedId, setJustAddedId] = useState(null);
    const [selectedAlbum, setSelectedAlbum] = useState(null);

    useEffect(() => {
        if (!artistId) return;
        setLoading(true);

        getArtistById(artistId)
            .then((data) => {
                setArtist({
                    ...data,
                    img: normalizeImagePath(data.img_url || data.img || ''),
                });

                const disc = Array.isArray(data.discography) ? data.discography : [];
                const now = new Date().getFullYear();

                const mapped = disc.map((alb, idx) => {
                    const year = alb.release_date ? new Date(alb.release_date).getFullYear() : now;
                    let basePrice = year > now - 2 ? 18.99 : year > now - 5 ? 16.99 : year > now - 10 ? 14.99 : year > now - 20 ? 11.99 : 8.99;
                    const randomFactor = Math.floor(Math.random() * 7) - 3;
                    const isSpecialEdition = idx % 5 === 0;
                    const specialBonus = isSpecialEdition ? 4.99 : 0;
                    let price = basePrice + randomFactor + specialBonus;
                    price = Math.max(price, 5.99);
                    price = Math.min(price, 29.99);

                    return {
                        id: `${artistId}-${idx}`,
                        title: alb.title,
                        img: normalizeImagePath(alb.img_url || alb.img || ''),
                        release_date: alb.release_date,
                        price: price.toFixed(2),
                        trackCount: alb.tracks?.length || 0,
                        isSpecialEdition,
                        tracks: alb.tracks || [],
                    };
                });

                setAlbums(mapped);
            })
            .catch((err) => {
                console.error('Error fetching artist:', err);
                setArtist(null);
            })
            .finally(() => setLoading(false));
    }, [artistId]);

    const addToCart = (album) => {
        setJustAddedId(album.id);
        setTimeout(() => setJustAddedId(null), 2000);
        setCart((prev) => [...prev, album]);
    };

    const term = searchTerm.toLowerCase();
    const filtered = albums.filter((a) => a.title.toLowerCase().includes(term));

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-100'>
                <p className='text-gray-500'>Loading artist details...</p>
            </div>
        );
    }

    if (!artist) {
        return (
            <div className='min-h-screen p-6 bg-gray-100 flex flex-col items-center justify-center'>
                <h1 className='text-3xl font-bold mb-4'>Artist Not Found</h1>
                <button onClick={() => navigate('/artists')} className='px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600'>
                    Back to Artists
                </button>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            {/* Artist Header */}
            <div className='bg-white rounded-lg shadow p-6 mb-8 flex flex-col md:flex-row gap-8'>
                <img src={artist.img} alt={artist.name} className='w-full md:w-1/3 rounded-lg shadow' />
                <div className='flex-1'>
                    <h1 className='text-3xl font-bold mb-4'>{artist.name}</h1>
                    {artist.bio_summary && <p className='text-gray-700 mb-4'>{artist.bio_summary}</p>}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {artist.bio_birthdate && (
                            <div className='bg-gray-50 p-3 rounded'>
                                <span className='text-gray-500 text-sm'>Born</span>
                                <div className='font-medium'>{artist.bio_birthdate}</div>
                            </div>
                        )}
                        <div className='bg-gray-50 p-3 rounded'>
                            <span className='text-gray-500 text-sm'>Albums</span>
                            <div className='font-medium'>{albums.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Albums Grid */}
            <h2 className='text-2xl font-bold mb-6'>Albums</h2>
            {filtered.length === 0 ? (
                <p className='text-center text-gray-500'>No albums match “{searchTerm}”.</p>
            ) : (
                <div className='max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filtered.map((album) => (
                        <div key={album.id} onClick={() => setSelectedAlbum(album)}>
                            <AlbumCard key={album.id} album={album} addToCart={addToCart} justAddedId={justAddedId} />
                        </div>
                    ))}
                </div>
            )}

            <div className='flex justify-center mt-10'>
                <button onClick={() => navigate('/cart')} className='px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700'>
                    View Cart ({cart.length})
                </button>
            </div>

            <AlbumModal album={selectedAlbum} onClose={() => setSelectedAlbum(null)} />
        </div>
    );
}
