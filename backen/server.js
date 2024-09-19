const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://v01d:puiQNMy3fUkvJra7@test-db.dxurd.mongodb.net/?retryWrites=true&w=majority&appName=test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

// Auction item schema
const auctionItemSchema = new mongoose.Schema({
  itemName: String,
  description: String,
  currentBid: Number,
  highestBidder: String,
  closingTime: Date,
  isClosed: { type: Boolean, default: false },
});

const AuctionItem = mongoose.model('AuctionItem', auctionItemSchema);

// Signup route
app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.status(201).json({ message: 'User registered' });
});

// Signin route
app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (user) {
    res.json({ message: 'Signin successful', username });
  } else {
    res.status(400).json({ message: 'Invalid credentials' });
  }
});

// Create Auction Item route
app.post('/auction', async (req, res) => {
  const { itemName, description, startingBid, closingTime } = req.body;
  const newItem = new AuctionItem({
    itemName,
    description,
    currentBid: startingBid,
    highestBidder: '',
    closingTime,
  });
  await newItem.save();
  res.status(201).json({ message: 'Auction item created', item: newItem });
});

// Auction Dashboard (list of items)
app.get('/auctions', async (req, res) => {
  const auctions = await AuctionItem.find();
  res.json(auctions);
});

// Get a single Auction Item by ID
app.get('/auctions/:id', async (req, res) => {
  const auctionId = req.params.id;
  const auctionItem = await AuctionItem.findById(auctionId);

  if (!auctionItem) {
    return res.status(404).json({ message: 'Auction not found' });
  }

  res.json(auctionItem);
});

// Bidding on an item
app.post('/bid/:id', async (req, res) => {
  const { id } = req.params;
  const { bid, username } = req.body;
  const item = await AuctionItem.findById(id);

  if (item.isClosed) {
    return res.status(400).json({ message: 'Auction is closed' });
  }

  if (new Date() > item.closingTime) {
    item.isClosed = true;
    item.highestBidder = item.highestBidder || username;
    await item.save();
    return res.json({ message: 'Auction closed', winner: item.highestBidder });
  }

  if (bid > item.currentBid) {
    item.currentBid = bid;
    item.highestBidder = username;
    await item.save();
    res.json({ message: 'Bid successful', item });
  } else {
    res.status(400).json({ message: 'Bid too low' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
