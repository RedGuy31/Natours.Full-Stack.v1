const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsync = require("../utils/catchAsync");
const Tour = require("../model/tourModel");
const Booking = require("../model/bookingModel");
const AppError = require("../utils/appError");
const factory = require("../controllers/handlerFactory");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.tourId);

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          product_data: { name: `${tour.name} Tour` },
          unit_amount: tour.price * 100,
          currency: "usd",
        },
        quantity: 1,
      },
    ],
    invoice_creation: {
      enabled: false,
      invoice_data: {
        description: tour.summary,
      },
    },
  });

  res.status(200).json({
    status: "Success",
    session,
  });
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  // Security note this is for test use only withour protect url so please dont use in public apps
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split("?")[0]);
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
