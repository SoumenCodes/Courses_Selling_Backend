const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic

  const username = req.body.username;
  const password = req.body.password;

  Admin.findOne({ username: username, password: password }).then((value) => {
    if (value) {
      res.status(403).json({
        message: "This Admin is Already Present",
      });
    }
  });

  await Admin.create({ username, password });
  res.json({ message: 'Admin Created Successful!"' });
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  const title = req.body.title;
  const description = req.body.description;
  const imageLink = req.body.imageLink;
  const price = req.body.price;

  const newCourse = await Course.create({
    title,
    description,
    imageLink,
    price,
  });
  console.log(newCourse);

  res.json({ message: "Course Created Successful!", courseId: newCourse._id });
});

router.get("/courses", adminMiddleware, (req, res) => {
  // Implement fetching all courses logic
});

module.exports = router;
