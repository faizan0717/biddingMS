import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PostAuction() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [startingBid, setStartingBid] = useState(0);
  const [closingTime, setClosingTime] = useState('');
  const navigate = useNavigate();

  const handlePostAuction = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:5000/auction', { itemName, description, startingBid, closingTime });
    alert('Auction item posted!');
    navigate('/dashboard');
  };

  return (
    <div className="form-container">
      <h2>Post New Auction</h2>
      <form onSubmit={handlePostAuction}>
        <input
          type="text"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />
        <textarea
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <input
          type="number"
          placeholder="Starting Bid"
          value={startingBid}
          onChange={(e) => setStartingBid(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={closingTime}
          onChange={(e) => setClosingTime(e.target.value)}
          required
        />
        <button type="submit">Post Auction</button>
      </form>
    </div>
  );
}

export default PostAuction;

