const express = require(`express`);
const viewController = require("../controllers/viewsController");
const authConreoller = require("../controllers/authController");
const bookingController = require("../controllers/bookingController");

const router = express.Router();

router.get(
  "/",
  bookingController.createBookingCheckout,
  authConreoller.isLoggedIn,
  viewController.getOverview
);
router.get("/tour/:slug", authConreoller.isLoggedIn, viewController.getTour);
router.get("/login", authConreoller.isLoggedIn, viewController.getLoginForm);
router.get("/me", authConreoller.protect, viewController.getAccount);
router.get("/my-tours", authConreoller.protect, viewController.getMyTours);

router.post(
  "/submit-user-data",
  authConreoller.protect,
  viewController.updateUserData
);

module.exports = router;
