import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postOrder } from '../api/orders';

export default function Checkout({ user, cart = [], setCart }) {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        fullName: '',
        cardNumber: '',
        expiry: '',
        cvv: '',
        address: '',
    });

    const subtotal = cart.reduce((sum, item) => sum + parseFloat(item.price || 0), 0).toFixed(2);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            userId: user.id,
            items: cart,
            total: parseFloat(subtotal),
        };

        console.log('Order payload:', payload);

        try {
            await postOrder(payload);
            alert('Order placed successfully!');
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
            return;
        }

        setCart([]);
        navigate('/orders', { state: { items: cart, total: subtotal } });
    };

    return (
        <div className='min-h-screen bg-gray-100 p-6'>
            <header className='text-center mb-10'>
                <h1 className='text-3xl font-bold'>Checkout</h1>
            </header>
            <div className='max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8'>
                {/* Payment Form */}
                <form onSubmit={handleSubmit} className='bg-white p-6 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-bold mb-4'>Payment Information</h2>
                    <div className='space-y-4'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Full Name</label>
                            <input name='fullName' value={form.fullName} onChange={handleChange} required className='mt-1 block w-full p-2 border border-gray-300 rounded' />
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Card Number</label>
                            <input
                                name='cardNumber'
                                type='text'
                                value={form.cardNumber}
                                onChange={handleChange}
                                required
                                maxLength={19}
                                placeholder='1234 5678 9012 3456'
                                className='mt-1 block w-full p-2 border border-gray-300 rounded'
                            />
                        </div>
                        <div className='flex space-x-4'>
                            <div className='flex-1'>
                                <label className='block text-sm font-medium text-gray-700'>Expiry (MM/YY)</label>
                                <input
                                    name='expiry'
                                    type='text'
                                    value={form.expiry}
                                    onChange={handleChange}
                                    required
                                    placeholder='MM/YY'
                                    className='mt-1 block w-full p-2 border border-gray-300 rounded'
                                />
                            </div>
                            <div className='w-24'>
                                <label className='block text-sm font-medium text-gray-700'>CVV</label>
                                <input
                                    name='cvv'
                                    type='password'
                                    value={form.cvv}
                                    onChange={handleChange}
                                    required
                                    maxLength={4}
                                    placeholder='123'
                                    className='mt-1 block w-full p-2 border border-gray-300 rounded'
                                />
                            </div>
                        </div>
                        <div>
                            <label className='block text-sm font-medium text-gray-700'>Billing Address</label>
                            <textarea name='address' value={form.address} onChange={handleChange} required rows={3} className='mt-1 block w-full p-2 border border-gray-300 rounded' />
                        </div>
                    </div>
                    <button type='submit' className='mt-6 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition'>
                        Place Order (${subtotal})
                    </button>
                </form>

                {/* Order Summary */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <h2 className='text-2xl font-bold mb-4'>Order Summary</h2>
                    <ul className='divide-y divide-gray-200'>
                        {cart.map((item, idx) => (
                            <li key={idx} className='py-4 flex'>
                                <img src={item.img || '/444.svg'} alt={item.title} className='w-16 h-16 rounded-md object-cover' />
                                <div className='ml-4 flex-1'>
                                    <h3 className='text-lg font-medium'>{item.title}</h3>
                                    <p className='text-gray-500 text-sm'>{item.artistName}</p>
                                    <p className='text-gray-900 font-semibold'>${item.price}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className='mt-6 flex justify-between font-medium'>
                        <span>Total</span>
                        <span>${subtotal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
