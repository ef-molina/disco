import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { normalizeImagePath } from '../utils/imageHelper';

export default function ArtistAlbums({ cart, setCart, searchTerm = '' }) {
  const { name } = useParams()  // URL encoded artist name
  const [albums, setAlbums] = useState([])
  const [loading, setLoading] = useState(true)
  const [justAddedId, setJustAddedId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Define all genre JSON files to load
    const genreFiles = [
      '/hip_hop.json',
      '/rock.json',
      '/country.json',
      '/jazz.json',
      '/reggae.json',
      '/metal.json'
    ];

    // Use Promise.all to fetch all genre data in parallel
    Promise.all(genreFiles.map(file => 
      fetch(file)
        .then(res => res.json())
        .catch(err => {
          console.error(`Error loading ${file}:`, err);
          return []; // Return empty array for failed requests
        })
    ))
    .then(allGenreData => {
      // Find the artist across all genre data
      let foundArtist = null;
      
      // Look through all genre data to find the artist
      for (const genreData of allGenreData) {
        foundArtist = genreData.find(a => a.name === decodeURIComponent(name));
        if (foundArtist) break;
      }

      if (!foundArtist?.discography) {
        setAlbums([]);
        setLoading(false);
        return;
      }

      const list = foundArtist.discography.map((alb, i) => {
        // Generate more varied pricing based on multiple factors
        const releaseYear = alb.release_date ? new Date(alb.release_date).getFullYear() : 2000;
        const currentYear = new Date().getFullYear();
        const age = currentYear - releaseYear;
        
        // Base price calculation
        let basePrice;
        if (age < 2) basePrice = 18.99;
        else if (age < 5) basePrice = 16.99;
        else if (age < 10) basePrice = 14.99;
        else if (age < 20) basePrice = 11.99;
        else basePrice = 8.99;
        
        // Add variation factors
        // 1. Album index factor (earlier albums might be more valuable)
        const indexFactor = Math.max(0, 3 - (i * 0.5));
        
        // 2. Album-specific random factor
        const randomFactor = Math.floor(Math.random() * 7) - 3; // -3 to +3 dollars
        
        // 3. Special editions cost more (randomly assign)
        const isSpecialEdition = i % 5 === 0;
        const specialEditionBonus = isSpecialEdition ? 4.99 : 0;
        
        // 4. Track count factor (more tracks = higher price)
        const trackCountFactor = alb.tracks ? Math.min(alb.tracks.length * 0.1, 3) : 0;
        
        // Combine all factors (ensuring price doesn't go below $5.99)
        let finalPrice = basePrice + indexFactor + randomFactor + specialEditionBonus + trackCountFactor;
        finalPrice = Math.max(finalPrice, 5.99);
        finalPrice = Math.min(finalPrice, 29.99); // Cap at $29.99
        
        return {
          id: alb.id ?? `${foundArtist.name}-${alb.title}-${i}`,
          title: alb.title,
          img: normalizeImagePath(alb.img),
          release_date: alb.release_date,
          price: finalPrice.toFixed(2),
          isSpecialEdition: isSpecialEdition,
          trackCount: alb.tracks ? alb.tracks.length : 0
        }
      })
      setAlbums(list)
      setLoading(false)
    })
    .catch(err => {
      console.error('Error loading album data:', err);
      setLoading(false);
    });
  }, [name])

  const addToCart = (album) => {
    setCart((c) => [...c, { ...album, artistName: decodeURIComponent(name) }])
    setJustAddedId(album.id)
    setTimeout(() => setJustAddedId(null), 1500)
  }
  
  // Filter albums based on search term
  const term = searchTerm.toLowerCase()
  const filtered = albums.filter(album => 
    (album.title || '').toLowerCase().includes(term)
  )

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">{decodeURIComponent(name)}'s Albums</h1>
      </header>

      {loading ? (
        <p className="text-center text-gray-500">Loading albums...</p>
      ) : albums.length === 0 ? (
        <p className="text-center text-gray-500">No albums found.</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No albums match "{searchTerm}"</p>
      ) : (
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((album) => (
            <div
              key={album.id}
              className="bg-white rounded-md shadow-lg p-6 flex flex-col h-full"
            >
              <div className="w-full h-52 overflow-hidden rounded-md mb-4">
                <img
                  src={album.img}
                  alt={album.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold mb-1">{album.title}</h3>
                  <span className="text-green-600 font-bold">${album.price}</span>
                </div>
                {album.release_date && (
                  <p className="text-gray-400 text-sm mb-2">
                    Released: {album.release_date}
                  </p>
                )}
                {album.trackCount > 0 && (
                  <p className="text-gray-500 text-sm mb-2">
                    {album.trackCount} tracks
                  </p>
                )}
                {album.isSpecialEdition && (
                  <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded mb-3 inline-block">
                    Special Edition
                  </div>
                )}
                <div className="mt-auto pt-4">
                  <button
                    onClick={() => addToCart(album)}
                    className={`w-full px-4 py-2 rounded transition duration-200 ${
                      justAddedId === album.id
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {justAddedId === album.id ? '✅ Added!' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center mt-12">
        <button
          onClick={() => navigate('/cart')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          View Cart ({cart.length})
        </button>
      </div>
    </div>
  )
}
