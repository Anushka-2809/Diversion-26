import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Leaf,
  Truck,
  Shield,
  Clock,
  MapPin,
  User,
  Check,
  Loader,
  Loader2,
  Play,
  ExternalLink,
  AlertCircle,
  Tag,
  Package,
} from "lucide-react";
import { motion } from "framer-motion";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

const API_URL = import.meta.env.VITE_API_URL || "https://aqua-delight-backend.vercel.app/api";

// Helper function to extract YouTube video ID
const getYoutubeVideoId = (url) => {
  if (!url) return null;

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/results\?search_query=/,
  ];

  for (let pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }

  return null;
};

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [videoLoading, setVideoLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/fish/${id}`);
        const data = await response.json();

        console.log("📦 Product Data Received:", data);
        console.log("🖼️  Image:", data.fish?.image || data.image);
        console.log(
          "🎥 Recipe Videos:",
          data.fish?.recipeVideos || data.recipeVideos
        );

        if (!response.ok) {
          throw new Error(data.message || "Product not found");
        }

        const productData = data.fish || data;
        // Normalize _id to id for CartContext compatibility
        productData.id = productData._id || productData.id;
        setProduct(productData);
        setError("");

        // If no recipe videos yet, set it as loading and refetch after 5 seconds
        if (
          !productData.recipeVideos ||
          productData.recipeVideos.length === 0
        ) {
          console.log("⏳ Recipe videos are being generated in background...");
          setVideoLoading(true);

          setTimeout(async () => {
            try {
              const refreshResponse = await fetch(`${API_URL}/fish/${id}`);
              const refreshData = await refreshResponse.json();
              const refreshedProduct = refreshData.fish || refreshData;
              refreshedProduct.id = refreshedProduct._id || refreshedProduct.id;

              console.log("🔄 Refreshed Product:", refreshedProduct);
              console.log(
                "🎥 Updated Recipe Videos:",
                refreshedProduct.recipeVideos
              );

              if (
                refreshedProduct.recipeVideos &&
                refreshedProduct.recipeVideos.length > 0
              ) {
                setProduct(refreshedProduct);
                console.log("✅ Recipe videos loaded!");
              }
            } catch (err) {
              console.error("Error refreshing product:", err);
            } finally {
              setVideoLoading(false);
            }
          }, 5000);
        }
      } catch (err) {
        console.error("❌ Error fetching product:", err);
        setError(err.message || "Failed to load product details");
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!token || !user) {
      console.log("🚫 User not authenticated. Redirecting to login...");
      navigate("/login", {
        state: { from: "cart", message: "Please login to add items to cart" },
      });
      return;
    }

    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50/50 to-slate-50 pt-20">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <ArrowLeft className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-3">
            Product Not Found
          </h1>
          <p className="text-slate-500 mb-8">
            {error || "This product doesn't exist"}
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-sky-500 hover:bg-sky-600 transition-all duration-300 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 sm:pt-8 sm:pb-12">
        {/* Back Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/explore")}
          className="mb-6 gap-2 text-sky-600 border-sky-200 hover:bg-sky-50 hover:text-sky-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

          {/* ── LEFT: Product Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative group lg:sticky lg:top-8 lg:self-start"
          >
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-xl overflow-hidden aspect-square max-h-[450px]">
              {product.image &&
              product.image !== "https://via.placeholder.com/300x200?text=Fish" ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-100">
                  <div className="w-24 h-24 rounded-2xl bg-slate-200/60 flex items-center justify-center mb-4">
                    <Leaf className="w-12 h-12 text-slate-300" />
                  </div>
                  <p className="font-medium text-slate-400">No image available</p>
                </div>
              )}
            </div>

            {/* Floating badges */}
            {product.mlAnalysis && product.mlAnalysis.isCertified && (
              <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <Check className="w-3.5 h-3.5" />
                AI Certified Fresh
              </div>
            )}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-white/50 shadow-lg hover:scale-110 transition-all"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "text-red-500 fill-red-500" : "text-slate-400"}`}
              />
            </button>
          </motion.div>

          {/* ── RIGHT: Product Details ── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col gap-5"
          >

            {/* Title & Rating */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <span className="text-sm text-slate-500">4.8 (240 reviews)</span>
              </div>
            </div>

            {/* Price & Stock Card */}
            <div className="bg-gradient-to-r from-sky-50 via-blue-50 to-indigo-50 rounded-2xl border border-sky-100 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-sky-600">₹{product.price}</span>
                    <span className=" text-base font-medium">/kg</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-0.5">Available</p>
                  <p className="text-lg font-bold text-slate-800">
                    {product.quantity} <span className="text-sm font-normal text-slate-500">units</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Info Row */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
                <Tag className="w-4 h-4 text-sky-500 mx-auto mb-1.5" />
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">Category</p>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">{product.category}</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
                <Clock className="w-4 h-4 text-emerald-500 mx-auto mb-1.5" />
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">Catch Date</p>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">
                  {new Date(product.harvestDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-3 text-center">
                <MapPin className="w-4 h-4 text-purple-500 mx-auto mb-1.5" />
                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wide">Origin</p>
                <p className="font-semibold text-slate-900 text-sm mt-0.5">{product.origin || "Local"}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-2">About This Product</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {product.description ||
                  "High-quality fresh fish sourced directly from certified suppliers. Perfect for family meals and special occasions."}
              </p>
            </div>

            {/* ML Freshness Analysis (full-width, outside grid) */}
            {product.mlAnalysis && product.mlAnalysis.freshnessScore !== null && (
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`rounded-2xl p-5 border-2 ${
                    product.mlAnalysis.isCertified
                      ? "bg-green-50 border-green-200"
                      : "bg-amber-50 border-amber-200"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg shrink-0 ${
                        product.mlAnalysis.isCertified
                          ? "bg-green-200 text-green-900"
                          : "bg-amber-200 text-amber-900"
                      }`}
                    >
                      {product.mlAnalysis.freshnessScore}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                        ML Freshness Certificate
                      </p>
                      <p className="font-semibold text-slate-900 text-sm mt-0.5">
                        {product.mlAnalysis.analysisDetails?.overallQuality || "Verified Fresh"}
                      </p>
                      {product.mlAnalysis.isCertified && (
                        <p className="text-xs text-green-700 font-semibold mt-1"> Certified Fresh by AI Model</p>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 shrink-0 self-start">
                      {product.mlAnalysis.mlModel}
                    </p>
                  </div>
                </motion.div>

                {/* AI Analysis Breakdown */}
                {product.mlAnalysis.analysisDetails && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 space-y-4"
                  >
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">
                      AI Freshness Analysis
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Eyes Condition */}
                      {product.mlAnalysis.analysisDetails.eyesCondition && (
                        <div className="flex items-start gap-2.5">
                          <div>
                            <p className="text-xs text-slate-500 font-bold">Eyes Condition</p>
                            <p className="text-sm text-slate-700 mt-0.5">
                              {product.mlAnalysis.analysisDetails.eyesCondition}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Smell Indicator */}
                      {product.mlAnalysis.analysisDetails.smellIndicator && (
                        <div className="flex items-start gap-2.5">
                          <div>
                            <p className="text-xs text-slate-500 font-bold">Smell Indicator</p>
                            <p className="text-sm text-slate-700 mt-0.5">
                              {product.mlAnalysis.analysisDetails.smellIndicator}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Score Bars */}
                    <div className="space-y-3 pt-2">
                      {product.mlAnalysis.analysisDetails.colorScore > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-800 flex items-center gap-1.5 text-semibold">Color Assessment</span>
                            <span className="text-xs font-bold text-slate-900">{product.mlAnalysis.analysisDetails.colorScore}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-orange-400 to-amber-400 h-2 rounded-full transition-all"
                              style={{ width: `${product.mlAnalysis.analysisDetails.colorScore}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {product.mlAnalysis.analysisDetails.textureScore > 0 && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs text-slate-800 flex items-center gap-1.5 text-semibold">Texture & Firmness</span>
                            <span className="text-xs font-bold text-slate-900">{product.mlAnalysis.analysisDetails.textureScore}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-sky-400 to-cyan-400 h-2 rounded-full transition-all"
                              style={{ width: `${product.mlAnalysis.analysisDetails.textureScore}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Quality & Recommendations */}
                    {(product.mlAnalysis.analysisDetails.overallQuality || product.mlAnalysis.analysisDetails.recommendations) && (
                      <div className="pt-3 border-t border-slate-100 space-y-3">
                        {product.mlAnalysis.analysisDetails.overallQuality && (
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-600">Quality Grade</span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                              {product.mlAnalysis.analysisDetails.overallQuality}
                            </span>
                          </div>
                        )}
                        {product.mlAnalysis.analysisDetails.recommendations && (
                          <div>
                            <p className="text-xs text-slate-500 font-bold mb-1">Storage & Usage</p>
                            <p className="text-sm text-slate-600">{product.mlAnalysis.analysisDetails.recommendations}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </div>
            )}


            {/* Quantity Selector + Add to Cart */}
            <div className="flex gap-3 pt-2">
              <div className="flex items-center bg-white rounded-xl border border-slate-200 shadow-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-l-xl transition font-medium text-lg"
                >
                  −
                </button>
                <span className="w-10 text-center font-bold text-slate-900 text-lg border-x border-slate-100 py-3">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-r-xl transition font-medium text-lg"
                >
                  +
                </button>
              </div>

              <motion.button
                onClick={handleAddToCart}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex-1 py-3.5 px-6 rounded-xl text-white font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  added
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : !token || !user
                      ? "bg-slate-400 hover:bg-slate-500 cursor-pointer"
                      : "bg-sky-500 hover:bg-sky-600"
                }`}
                title={!token || !user ? "Login to add items to cart" : ""}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {!token || !user ? "Login to Add to Cart" : `Add to Cart · ₹${product.price * quantity}`}
                  </>
                )}
              </motion.button>
            </div>

            {/* Authentication Alert */}
            {!token || !user ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-900 text-sm">Login Required</p>
                  <p className="text-amber-800 text-sm mt-1">
                    Please login to add items to cart and complete your purchase.
                  </p>
                  <button
                    onClick={() => navigate("/login")}
                    className="mt-2 text-sm font-semibold text-amber-600 hover:text-amber-700 underline"
                  >
                    Go to Login →
                  </button>
                </div>
              </motion.div>
            ) : null}
          </motion.div>
        </div>

        {/* ── RECIPE VIDEOS SECTION ── */}
        {(product.recipeVideos && product.recipeVideos.length > 0) || videoLoading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-16 border-t border-slate-200 pt-12"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-8">
              🍳 Cooking Recipes with {product.name}
            </h3>

            {videoLoading && (!product.recipeVideos || product.recipeVideos.length === 0) ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-12 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground text-center">
                  Finding the perfect recipe videos for {product.name}...
                </p>
                <p className="text-slate-400 text-sm mt-2">Powered by Google Gemini AI</p>
              </div>
            ) : product.recipeVideos && product.recipeVideos.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.recipeVideos.map((video, index) => (
                  <motion.div
                    key={video.id || index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
                  >
                    {/* Video Thumbnail */}
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block w-full pt-[56.25%] bg-slate-900 overflow-hidden"
                    >
                      {(video.thumbnailMax || video.thumbnailHQ || video.thumbnail) && (
                        <img
                          src={video.thumbnailMax || video.thumbnailHQ || video.thumbnail}
                          alt={video.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      )}
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-red-500/80 group-hover:bg-red-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute top-3 right-3 bg-red-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                        Recipe {index + 1}
                      </span>
                      {video.duration && video.duration !== "00:00" && (
                        <span className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-0.5 rounded text-xs font-semibold">
                          {video.duration}
                        </span>
                      )}
                    </a>

                    {/* Content */}
                    <div className="p-5">
                      <h4 className="text-base font-bold text-slate-900 mb-1.5 line-clamp-2">{video.title}</h4>
                      <p className="text-slate-500 text-sm mb-3 line-clamp-2">{video.description}</p>
                      {video.channel && (
                        <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                          <User className="w-3 h-3" /> {video.channel}
                        </p>
                      )}
                      <a
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold text-sm transition-all"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        Watch on YouTube
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : null}
          </motion.div>
        ) : null}

        {/* ── SELLER INFO SECTION ── */}
        {product.sellerId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 border-t border-slate-200 pt-12"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6">About the Seller</h3>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-xl font-bold text-white select-none shrink-0">
                  {product.sellerId.name
                    ? product.sellerId.name.charAt(0).toUpperCase()
                    : <User className="w-7 h-7 text-white" />}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">{product.sellerId.name || "Seller"}</h4>
                  <p className="text-slate-500 text-sm">Verified Seller</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.sellerId.email && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-sky-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-slate-500">Email</p>
                      <p className="text-sm font-medium text-slate-800 truncate">{product.sellerId.email}</p>
                    </div>
                  </div>
                )}

                {product.sellerId.phone && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Phone</p>
                      <p className="text-sm font-medium text-slate-800">{product.sellerId.phone}</p>
                    </div>
                  </div>
                )}

                {product.sellerId.address && (product.sellerId.address.city || product.sellerId.address.state) && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-4 h-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Location</p>
                      <p className="text-sm font-medium text-slate-800">
                        {[product.sellerId.address.city, product.sellerId.address.state, product.sellerId.address.country].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                )}

                {product.sellerId.createdAt && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Member Since</p>
                      <p className="text-sm font-medium text-slate-800">
                        {new Date(product.sellerId.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetails;
