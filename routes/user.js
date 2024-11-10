const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { Admin, User, Course } = require("../db");
const mongoose = require("mongoose");

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  const username = req.body.username;
  const password = req.body.password;
  User.create({
    username,
    password,
  });
  res.json({
    message: "User created successfully",
  });
});

router.get("/courses", async (req, res) => {
  // Implement listing all courses logic
  const courses = await Course.find({});
  res.json({
    message: "List of all courses retrieved successfully",
    courses,
  });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  const courseId = req.params.courseId;
  const username = req.headers.username;

  try {
    // Validate courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ message: "Invalid course ID" });
    }

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update user's purchased courses
    const updateResult = await User.updateOne(
      { username },
      { $push: { purchasedCourses: courseId } }
    );

    if (updateResult.acknowledged) {
      res.status(200).json({ message: "Purchase complete!" });
    } else {
      res.status(500).json({ message: "Failed to update purchased courses" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/purchasedCourses", userMiddleware, (req, res) => {
  // Implement fetching purchased courses logic
  const user = User.find({
    username: req.header.username,
  });
  const courses = Course.find({
    _id: {
      $in: user.purchasedCourses,
    },
  });
  res.json({
    courses,
  });
});

module.exports = router;
