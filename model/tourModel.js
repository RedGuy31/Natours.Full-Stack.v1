const mongoose = require("mongoose");
const slugify = require("slugify");

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, `A Tour must have name`],
      unique: true,
      trim: true,
      maxlength: [40, `A tour name must have les or equal 40 characters`],
      minlength: [10, `A tour must have more or equal then 10`],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, `A tour must have a duration`],
    },
    maxGroupSize: {
      type: Number,
      required: [true, `A Tour must have a group size`],
    },
    difficulty: {
      type: String,
      required: [true, `A tour must have difficulty`],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficult is eather:easy,medium,difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, `minim rating must be above 1.0`],
      max: [5, `max rating must be less or equal 5`],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, `A tour must have price`],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below to regular price",
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, `A tour must have a description`],
    },
    imageCover: {
      type: String,
      required: [true, `A tour must have a IMG`],
    },
    description: {
      type: String,
      trim: true,
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ sulg: 1 });
tourSchema.index({ startLocation: "2dsphere" });
// Virtual Properties

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});
// virtual populate
tourSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "tour",
  localField: "_id",
});

// mongoose middleware

// Document middleware runs before save() or create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });

  next();
});

// QUERY middleware
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v -passwordChangedAt",
  });
  next();
});
// tourSchema.post(/^find/, function (docs, next) {
//   console.log(`Query Took ${Date.now() - this.start}`);
//   next();
// });

// Aggregation middleware
// tourSchema.pre("aggregate", function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   next();
// });

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
