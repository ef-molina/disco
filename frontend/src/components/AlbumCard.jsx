import React from 'react';

const AlbumCard = ({ album, addToCart, justAddedId }) => {
    return (
        <div key={album.id} className='bg-white rounded-md shadow-lg p-6 flex flex-col h-full'>
            <div className='w-full h-52 overflow-hidden'>
                <img src={album.img} alt={album.title} className='w-full h-full object-cover object-center rounded-md mb-4 cursor-pointer' />
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
                        onClick={(e) => {
                            e.stopPropagation();
                            addToCart(album);
                        }}
                        className={`w-full px-4 py-2 rounded text-white transition duration-200 cursor-pointer ${justAddedId === album.id ? 'bg-green-500' : 'bg-blue-500 hover:bg-blue-600'}`}>
                        {justAddedId === album.id ? '✅ Added!' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AlbumCard;
