import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { normalizeImagePath } from '../utils/imageHelper';
import { getArtists } from '../api/artists'; // new util

const Artists = ({ searchTerm = '' }) => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { genreLink } = useParams(); // <-- grabs 'hip-hop' or undefined

    useEffect(() => {
        setLoading(true);
        // fetch either all or by genre
        getArtists(genreLink)
            .then((data) =>
                setArtists(
                    data.map((a) => ({
                        ...a,
                        img: normalizeImagePath(a.img_url || a.img),
                    }))
                )
            )
            .catch((err) => console.error('Error loading artists:', err))
            .finally(() => setLoading(false));
    }, [genreLink]);

    const term = searchTerm.toLowerCase();
    const filtered = artists.filter((a) => a.name.toLowerCase().includes(term) || (a.bio_summary || a.bio || '').toLowerCase().includes(term));

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <header className='text-center mb-10'>
                <h1 className='text-3xl font-bold'>{genreLink ? genreLink.replace('-', ' ') : 'All'} Artists</h1>
                <p className='text-gray-600 mt-2'>
                    Showing {filtered.length} of {artists.length} artists
                </p>
            </header>

            {loading ? (
                <p className='text-center text-gray-500'>Loading artists…</p>
            ) : filtered.length === 0 ? (
                <p className='text-center text-gray-500'>No artists match "{searchTerm}"</p>
            ) : (
                <div className='max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8'>
                    {filtered.map((artist) => (
                        <div key={artist._id} className='bg-white rounded-md shadow-lg overflow-hidden flex flex-col h-full'>
                            <div className='w-full h-56 overflow-hidden'>
                                <img src={artist.img} alt={artist.name} className='w-full h-full object-cover object-center' />
                            </div>
                            <div className='p-5 flex-1 flex flex-col'>
                                <h3 className='text-xl font-semibold mb-2'>{artist.name}</h3>
                                {artist.bio_summary && <p className='text-gray-600 mb-3 line-clamp-3'>{artist.bio_summary}</p>}
                                <div className='mt-auto pt-4'>
                                    <button onClick={() => navigate(`/artists/${artist._id}`)} className='w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-200'>
                                        View Artist
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Artists;
