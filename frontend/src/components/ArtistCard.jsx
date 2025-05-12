import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArtistCard = ({ artist }) => {
    const navigate = useNavigate();

    return (
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
    );
};

export default ArtistCard;
