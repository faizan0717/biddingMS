import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get('http://localhost:5000/auctions');
      setItems(res.data);
    };
    fetchItems();
  }, []);

  return (
    <div>
      <h2>Auction Dashboard</h2>
      <Link to="/post-auction">
        <button>Post New Auction</button>
      </Link>
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            <Link to={`/auction/${item._id}`}>
              {item.itemName} - Current Bid: ${item.currentBid} {item.isClosed ? '(Closed)' : ''}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;

