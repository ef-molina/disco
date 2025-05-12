import React from 'react';

export default function AlbumModal({ album, onClose }) {
    if (!album) return null;

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white rounded-lg shadow-xl w-11/12 max-w-xl max-h-[80vh] overflow-auto p-6' onClick={(e) => e.stopPropagation()}>
                <header className='flex justify-between items-center mb-4'>
                    <h2 className='text-xl font-semibold'>{album.title}</h2>
                    <button onClick={onClose} className='text-gray-500 hover:text-gray-700'>
                        ✕
                    </button>
                </header>

                <ul className='space-y-2 max-h-60 overflow-auto'>
                    {album.tracks.map((track, i) => (
                        <li key={i} className='flex justify-between'>
                            <span>
                                {i + 1}. {track.title}
                            </span>
                            {track.featured_artists?.length > 0 && <em className='text-gray-500 text-sm'>(feat. {track.featured_artists.join(', ')})</em>}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
