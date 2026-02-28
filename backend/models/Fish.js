import mongoose from "mongoose";

const fishSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller ID is required"],
    },
    name: {
      type: String,
      required: [true, "Please provide fish name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide fish description"],
    },
    category: {
      type: String,
      enum: ["Premium Fish", "Premium Shrimp & Prawns", "Premium Crabs", "Exotic &  Luxury Seafood","Local Fish"],
      required: [true, "Please select a category"],
    },
    price: {
      type: Number,
      required: [true, "Please provide price"],
      min: 0,
    },
    quantity: {
      type: Number,
      required: [true, "Please provide quantity"],
      min: 0,
    },
    harvestDate: {
      type: Date,
      required: [true, "Please provide catch date"],
    },
    image: {
      type: String,
      default: null,
    },
    origin: {
      type: String,
      trim: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    recipeVideos: [
      {
        id: Number,
        title: String,
        description: String,
        searchQuery: String,
        url: String,
        videoId: String,
        thumbnail: String,
        thumbnailHQ: String,
        thumbnailMax: String,
        channel: String,
        duration: String,
      }
    ],
    mlAnalysis: {
      freshnessScore: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
      },
      isCertified: {
        type: Boolean,
        default: false,
      },
      analysisDetails: {
        colorScore: Number,
        textureScore: Number,
        transparencyScore: Number,
        eyesCondition: String,
        smellIndicator: String,
        overallQuality: String,
        recommendations: String,
        analyzedAt: Date,
      },
      mlModel: {
        type: String,
        default: "gemini-3.1-pro-preview",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Fish", fishSchema);
