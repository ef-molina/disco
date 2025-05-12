import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { normalizeImagePath } from '../utils/imageHelper';
import { getArtists } from '../api/artists'; // new util
import ArtistCard from '../components/ArtistCard.jsx';

const Artists = ({ searchTerm = '' }) => {
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { genreLink } = useParams();

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
                <div className='max-w-screen-lg mx-auto grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {filtered.map((artist) => (
                        <ArtistCard key={artist._id} artist={artist} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Artists;
