const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://vgugan16:gugan2004@cluster0.qyh1fuo.mongodb.net/user_db?retryWrites=true&w=majority&appName=Cluster0', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
    process.exit(1); // Exit if connection fails
  });

// Store Schema
const storeSchema = new mongoose.Schema(
  {
    storeName: String,
    contactNumber: String,
    email: String,
    password: String,
    location: {
      latitude: mongoose.Schema.Types.Decimal128, // Latitude as Decimal128
      longitude: mongoose.Schema.Types.Decimal128, // Longitude as Decimal128
    },
  },
  { collection: "store" } // Ensure the collection is named "store"
);

const Store = mongoose.model("Store", storeSchema);

// Bookings Schema
const bookingSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true
  },
  storeEmail: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  }
});

// Create the Booking model
const Booking = mongoose.model('Booking', bookingSchema);

// Endpoint to fetch all store records
// Fetch all stores
app.get('/api/stores', async (req, res) => {
  try {
    const stores = await Store.find(); 
    console.log(stores);// Fetch all stores from the database
    res.json(stores); // Send the stores as JSON response
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Error fetching stores from the database.' });
  }
});
app.delete('/api/deleteBooking/:id', async (req, res) => {
  try {
      const bookingId = req.params.id;
      await BookingModel.findByIdAndDelete(bookingId); // Adjust based on your MongoDB schema
      res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
      console.error('Error deleting booking:', error);
      res.status(500).json({ message: 'Error deleting booking' });
  }
});

app.get('/api/stores/:id', async (req, res) => {
  const storeId = req.params.id;

  try {
    const store = await Store.findById(storeId);

    if (!store) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // Convert Decimal128 to a number
    const latitude = store.location.latitude.toString();
    const longitude = store.location.longitude.toString();

    // Send back store details with latitude and longitude as strings or numbers
    res.json({
      storeName: store.storeName,
      email: store.email,
      contactNumber: store.contactNumber,
      location: {
        latitude: latitude,
        longitude: longitude
      }
    });
  } catch (error) {
    console.log('Error fetching store details:', error);
    res.status(500).json({ message: 'Error fetching store details' });
  }
});


  // Fetch a specific store by ID
  app.get('/api/stores/:id', async (req, res) => {
    try {
      const store = await Store.findById(req.params.id);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.status(200).json(store);
    } catch (error) {
      res.status(500).json({ message: "Error fetching store", error: error.message });
    }
  });

// Endpoint to fetch all booking records
app.get("/bookings", async (req, res) => {
  try {
    console.log("Fetching all booking records...");

    const bookings = await Booking.find({}); // Fetch all documents
    console.log("Fetched bookings:", bookings); // Log the fetched documents

    if (bookings.length === 0) {
      console.log("No bookings found in the database.");
      return res.status(404).json({ message: "No bookings found" });
    }

    res.json(bookings); // Return the fetched documents
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});