import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrders } from '../api/orders';

export default function Orders({ user, searchTerm = '' }) {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null); // Track expanded order

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        setLoading(true);
        getOrders(user.id)
            .then((data) => setOrders(data))
            .catch((err) => console.error('Error loading orders:', err))
            .finally(() => setLoading(false));
    }, [user]);

    const toggleOrder = (orderId) => {
        setExpandedOrder((prev) => (prev === orderId ? null : orderId));
    };

    if (loading) {
        return (
            <div className='min-h-screen flex items-center justify-center bg-gray-100'>
                <p className='text-gray-500'>Loading orders…</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className='min-h-screen bg-gray-100 p-6 text-center'>
                <p className='text-gray-500 mb-6'>You have no past orders.</p>
                <button onClick={() => navigate('/albums')} className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'>
                    Browse Albums
                </button>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <header className='text-center mb-10'>
                <h1 className='text-3xl font-bold'>Your Orders</h1>
            </header>

            <div className='max-w-4xl mx-auto space-y-8'>
                {orders.map((order) => (
                    <div key={order._id} className='bg-white rounded-lg shadow p-6 space-y-4'>
                        <div className='flex justify-between items-center'>
                            <h2 className='text-xl font-semibold'>Order placed on {new Date(order.createdAt).toLocaleString()}</h2>
                            <span className='text-lg font-medium text-gray-700'>${order.total.toFixed(2)}</span>
                            <button onClick={() => toggleOrder(order._id)} className='px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400'>
                                {expandedOrder === order._id ? 'Collapse' : 'Expand'}
                            </button>
                        </div>

                        {expandedOrder === order._id && (
                            <ul className='divide-y divide-gray-200'>
                                {order.items.map((it, idx) => (
                                    <li key={idx} className='py-4 flex items-center'>
                                        <div className='ml-4 flex-1'>
                                            <h3 className='text-lg font-medium'>{it.title}</h3>
                                            <p className='text-gray-500 text-sm'>{it.artistName}</p>
                                        </div>
                                        <span className='text-gray-900 font-semibold'>${it.price.toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
            <div className='min-h-screen bg-gray-100 p-6 text-center'>
                <button onClick={() => navigate('/albums')} className='px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition'>
                    Continue Shopping
                </button>
            </div>
        </div>
    );
}
