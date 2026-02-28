import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Fish,
  ImagePlus,
  MapPin,
  CalendarDays,
  DollarSign,
  Package,
  Tag,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const API_URL = import.meta.env.VITE_API_URL || "https://aqua-delight-backend.vercel.app/api";

const ProductListing = () => {
  const { isSeller, token } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    quantity: "",
    harvestDate: "",
    image: null,
    origin: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    { value: "Premium Fish" },
    { value: "Premium Shrimp & Prawns" },
    { value: "Premium Crabs" },
    { value: "Exotic &  Luxury Seafood" },
    { value: "Local Fish" },
  ];

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setForm((prev) => ({ ...prev, [name]: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("category", form.category);
      formData.append("price", parseFloat(form.price));
      formData.append("quantity", parseInt(form.quantity));
      formData.append("harvestDate", new Date(form.harvestDate).toISOString());
      formData.append("origin", form.origin);

      if (form.image) {
        formData.append("image", form.image);
      }

      const response = await fetch(`${API_URL}/fish`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to list product");
      }

      setSuccess("Product listed successfully!");
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        quantity: "",
        harvestDate: "",
        image: null,
        origin: "",
      });
      setImagePreview(null);
    } catch (err) {
      setError(err.message || "Failed to list product");
    } finally {
      setLoading(false);
    }
  };

  if (!isSeller) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50 to-slate-50">
        <Card className="max-w-md w-full mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-7 w-7 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription>
              Only registered sellers can list products on the marketplace.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full" size="lg">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/50 to-slate-50 pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-sky-100 mb-4">
            <Fish className="h-8 w-8 text-sky-600" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            List Your Product
          </h1>
          <p className="mt-2 text-slate-500 max-w-md mx-auto">
            Add your fresh seafood to our marketplace and reach thousands of
            buyers
          </p>
        </motion.div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4"
            >
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Something went wrong
                </p>
                <p className="text-sm text-red-700 mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => setError("")}
                className="ml-auto text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4"
            >
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">Success!</p>
                <p className="text-sm text-green-700 mt-0.5">{success}</p>
              </div>
              <button
                onClick={() => setSuccess("")}
                className="ml-auto text-green-400 hover:text-green-600"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sky-700 border-sky-200 bg-sky-50">
                    Step 1
                  </Badge>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </div>
                <CardDescription>
                  Enter the core details about your seafood product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-slate-400" />
                      Product Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="e.g., Fresh Atlantic Salmon"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label className="flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5 text-slate-400" />
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={form.category}
                      onValueChange={(val) =>
                        handleSelectChange("category", val)
                      }
                      disabled={loading}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="description"
                    className="flex items-center gap-1.5"
                  >
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Describe your product — freshness, taste, best cooking methods..."
                    rows={4}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    A good description helps buyers find and trust your product.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 2: Pricing & Stock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sky-700 border-sky-200 bg-sky-50">
                    Step 2
                  </Badge>
                  <CardTitle className="text-lg">Pricing & Stock</CardTitle>
                </div>
                <CardDescription>
                  Set competitive pricing and available quantity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price" className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                      Price (₹) <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                        ₹
                      </span>
                      <Input
                        id="price"
                        type="number"
                        name="price"
                        value={form.price}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="pl-7"
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="quantity"
                      className="flex items-center gap-1.5"
                    >
                      <Package className="h-3.5 w-3.5 text-slate-400" />
                      Quantity <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="e.g., 50"
                      min="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 3: Origin & Freshness */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sky-700 border-sky-200 bg-sky-50">
                    Step 3
                  </Badge>
                  <CardTitle className="text-lg">Origin & Freshness</CardTitle>
                </div>
                <CardDescription>
                  Help buyers know where and when your catch was sourced
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Catch Date */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="harvestDate"
                      className="flex items-center gap-1.5"
                    >
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                      Catch Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="harvestDate"
                      type="date"
                      name="harvestDate"
                      value={form.harvestDate}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </div>

                  {/* Origin */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="origin"
                      className="flex items-center gap-1.5"
                    >
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      Origin
                    </Label>
                    <Input
                      id="origin"
                      name="origin"
                      value={form.origin}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="e.g., Kerala Coast"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section 4: Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-sky-700 border-sky-200 bg-sky-50">
                    Step 4
                  </Badge>
                  <CardTitle className="text-lg">Product Image</CardTitle>
                </div>
                <CardDescription>
                  Upload a clear photo — products with images sell 3x faster
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!imagePreview ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="cursor-pointer group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-10 transition-colors hover:border-sky-300 hover:bg-sky-50/30"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 mb-3 group-hover:bg-sky-200 transition-colors">
                      <ImagePlus className="h-6 w-6 text-sky-600" />
                    </div>
                    <p className="text-sm font-medium text-slate-700">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      JPG, PNG, GIF, WebP — Max 10MB
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      name="image"
                      onChange={handleChange}
                      disabled={loading}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon-sm"
                      className="absolute top-3 right-3"
                      onClick={() => {
                        setImagePreview(null);
                        setForm((prev) => ({ ...prev, image: null }));
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-white/90 text-slate-800 hover:bg-white/90 backdrop-blur-sm">
                        {form.image?.name}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Separator className="my-2" />
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full h-12 text-base font-semibold bg-sky-500 hover:bg-sky-600"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Listing Product...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  List Product
                </>
              )}
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-3">
              Your product will be reviewed and visible to buyers within minutes.
            </p>
          </motion.div>
        </form>
      </div>
    </div>
  );
};

export default ProductListing;
