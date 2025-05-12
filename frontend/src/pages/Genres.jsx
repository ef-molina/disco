import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGenres } from '../api/genres';

/**
 * Genres component: fetches and displays all genres,
 * with optional filtering via a `searchTerm` prop.
 */
export default function Genres({ searchTerm = '' }) {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getGenres()
            .then((data) => setGenres(data))
            .catch((err) => console.error('Error loading genres:', err))
            .finally(() => setLoading(false));
    }, []);

    const term = searchTerm.toLowerCase();
    const filtered = genres.filter((genre) => {
        const name = genre.name?.toLowerCase() ?? '';
        const desc = genre.description?.toLowerCase() ?? '';
        return name.includes(term) || desc.includes(term);
    });

    if (loading) {
        return (
            <div className='flex items-center justify-center h-screen'>
                <p className='text-gray-500'>Loading genres…</p>
            </div>
        );
    }

    return (
        <div className='py-8 bg-gray-100 min-h-screen'>
            <div className='max-w-screen-xl mx-auto px-4'>
                <h2 className='text-3xl font-bold mb-6 text-center'>Genres</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
                    {filtered.map((genre) => (
                        <div
                            key={genre.link}
                            className='cursor-pointer rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105'
                            onClick={() => navigate(`/genres/${genre.link}`)}>
                            <svg className='w-full h-44' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid slice' role='img' aria-label={genre.name}>
                                <rect width='100%' height='100%' fill={genre.color} />
                                <text x='50%' y='50%' dy='.35em' textAnchor='middle' fontSize='8' fontWeight='bold' fill='#FFFFFF'>
                                    {genre.name}
                                </text>
                            </svg>
                        </div>
                    ))}
                    {filtered.length === 0 && <p className='col-span-full text-center text-gray-500'>No genres match “{searchTerm}.”</p>}
                </div>
            </div>
        </div>
    );
}
