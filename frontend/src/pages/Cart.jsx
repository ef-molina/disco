import React from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = ({ cart = [], setCart, searchTerm = '' }) => {
    const navigate = useNavigate();

    const removeFromCart = (index) => {
        setCart(cart.filter((_, i) => i !== index));
    };

    // Filter cart items based on search term
    const term = searchTerm.toLowerCase();
    const filtered = cart.filter(
        (item) =>
            (item.title?.toLowerCase() || '').includes(term) ||
            (item.artistName?.toLowerCase() || '').includes(term)
    );

    const totalItems = cart.length;
    // Calculate subtotal based on actual album prices
    const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price || 14.99), 0).toFixed(2);

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <header className="text-center mb-10">
                <h1 className="text-3xl font-bold">Your Cart</h1>
            </header>

            {totalItems === 0 ? (
                <div className="text-center">
                    <p className="text-gray-500 mb-6">Your cart is empty.</p>
                    <button 
                        onClick={() => navigate('/albums')} 
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                        Browse Albums
                    </button>
                </div>
            ) : filtered.length === 0 ? (
                <p className="text-center text-gray-500">No items match "{searchTerm}"</p>
            ) : (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="p-6">
                            <div className="flow-root">
                                <ul className="-my-6 divide-y divide-gray-200">
                                    {filtered.map((item, index) => (
                                        <li key={index} className="py-6 flex">
                                            <div className="flex-shrink-0 w-24 h-24 overflow-hidden rounded-md border border-gray-200">
                                                <img
                                                    src={item.img || '/444.svg'}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="ml-4 flex-1 flex flex-col">
                                                <div>
                                                    <div className="flex justify-between text-base font-medium text-gray-900">
                                                        <h3>{item.title}</h3>
                                                        <p className="ml-4">${item.price || '14.99'}</p>
                                                    </div>
                                                    <p className="mt-1 text-sm text-gray-500">{item.artistName}</p>
                                                    {item.isSpecialEdition && (
                                                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                            Special Edition
                                                        </span>
                                                    )}
                                                    {item.trackCount > 0 && (
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {item.trackCount} tracks
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex items-end justify-between text-sm">
                                                    <p className="text-gray-500">Qty 1</p>
                                                    <div className="flex">
                                                        <button
                                                            type="button"
                                                            className="font-medium text-red-600 hover:text-red-500"
                                                            onClick={() => removeFromCart(index)}
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-200 py-6 px-4 sm:px-6">
                            <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                                <p>Subtotal</p>
                                <p>${subtotal}</p>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    onClick={() => navigate('/albums')}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                >
                                    Continue Shopping
                                </button>
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                                >
                                    Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
