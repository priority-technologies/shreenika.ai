const express = require("express");
const User = require("../models/user");
const Product = require("../models/product");
const router = express.Router();

// Get all users with pagination and search
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;

    // Create a case-insensitive search condition
    const searchCondition = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { username: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find({
      role: { $ne: "Admin" },
      ...searchCondition,
    })
      .select("-password -resetToken")
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    const totalUsers = await User.countDocuments({
      role: { $ne: "Admin" },
      ...searchCondition,
    });

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get single user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password -resetToken");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create new user
router.post("/", async (req, res) => {
  try {
    const { name, email, contact, role, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    // Create new user (username will be generated automatically by the pre-save hook)
    const newUser = new User({
      name,
      email,
      contact,
      role,
      password,
      isVerified: role === "User" ? true : false,
    });

    await newUser.save();
    
    // Return user data without password
    const userWithoutPassword = await User.findById(newUser._id).select("-password");
    res.status(201).json({ message: "User created successfully!", user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user
router.put("/:id", async (req, res) => {
  try {
    const { name, email, contact, role, isVerified } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, contact, role, isVerified },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    res.status(200).json({ message: "User updated successfully!", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete user
router.delete("/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found!" });
    }
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Verify user
router.post("/verify/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { isVerified } = req.body;

    // Check if the provided isVerified value is boolean
    if (typeof isVerified !== "boolean") {
      return res.status(400).json({ message: "Invalid verification status" });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = isVerified;
    await user.save();

    // Return user data without password
    const userWithoutPassword = await User.findById(userId).select("-password");
    res.json({
      message: "User verification status updated successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Unified route to handle add/remove wishlist
router.post('/:userid/wishlist/:productId', async (req, res) => {
  try {
    const { userid, productId } = req.params;
    const { action } = req.query; // Use ?action=add or ?action=remove

    const user = await User.findById(userid);

    if (!user || !["User", "Agent"].includes(user.role)) {
      return res.status(403).json({ message: 'Not allowed to modify wishlist' });
    }

    if (!Array.isArray(user.wishlist)) {
      user.wishlist = [];
    }

    if (action === 'add') {
      const isAlreadyInWishlist = user.wishlist.some(
        id => id.toString() === productId
      );

      if (isAlreadyInWishlist) {
        return res.status(200).json({ message: 'Product already in wishlist', wishlist: user.wishlist });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      user.wishlist.push(product._id);
    }

    else if (action === 'remove') {
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    }

    else {
      return res.status(400).json({ message: 'Invalid action. Use "add" or "remove".' });
    }

    await user.save();
    await user.populate('wishlist');

    res.status(200).json({
      message: `Product ${action === 'add' ? 'added to' : 'removed from'} wishlist`,
      wishlist: user.wishlist,
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/users/:userid/wishlist
router.get('/:userid/wishlist', async (req, res) => {
  try {
    const user = await User.findById(req.params.userid)
      .select('wishlist role')
      .populate({
        path: 'wishlist.product',
        model: 'Product'
      });

    if (!user || !["User", "Agent"].includes(user.role)) {
      return res.status(403).json({ message: 'Not allowed to view wishlist' });
    }
    res.status(200).json({ wishlist: user.wishlist });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update profile
router.put("/:userid/profile", async (req, res) => {
  
  try {
    const { userid } = req.params;
    const { name, username, contact, address1, address2, countryId, stateId, cityId, countryName, stateName, cityName } = req.body;

    if (!userid) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Find the user by ID
    const user = await User.findById(userid);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    console.log("req.body:", req.body);
    // Update user details
    user.name= name || user.name;
    user.username= username || user.username;
    user.contact = contact || user.contact;
    user.address1 = address1 || user.address1;
    user.address2 = address2 || user.address2;
    user.countryId = countryId || user.countryId;
    user.countryName = countryName || user.countryName;
    user.stateId = stateId || user.stateId;
    user.stateName = stateName || user.stateName;
    user.cityId = cityId || user.cityId;
    user.cityName = cityName || user.cityName;
    
    await user.save();

    // Return updated user data without password
    const updatedUser = await User.findById(userid).select("-password");
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;