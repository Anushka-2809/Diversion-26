import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Package,
  Plus,
  Trash2,
  Edit2,
  Eye,
  TrendingUp,
  LayoutDashboard,
  Loader2,
  AlertCircle,
  X,
  Fish,
  DollarSign,
  Layers,
  ImageOff,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const SellerDashboard = () => {
  const { user, token, isSeller } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    if (!isSeller) {
      navigate("/");
    }
  }, [isSeller, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [productsRes, analyticsRes] = await Promise.all([
          fetch(`${API_URL}/fish/seller/items`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${API_URL}/fish/seller/analytics`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (productsRes.ok) {
          const data = await productsRes.json();
          setProducts(data.fish || []);
        }

        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          setAnalytics(data);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/fish/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        setProducts(products.filter((p) => p._id !== productId));
        setShowDeleteConfirm(null);
      } else {
        setError("Failed to delete product");
      }
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "analytics", label: "Analytics", icon: TrendingUp },
    { id: "products", label: "My Products", icon: Package },
  ];

  const statCards = analytics
    ? [
        {
          icon: Package,
          label: "Total Products",
          value: analytics.totalProducts,
          description: "Currently listed",
          color: "bg-blue-500",
          lightColor: "bg-blue-50 text-blue-700",
        },
        {
          icon: BarChart3,
          label: "Total Inventory",
          value: analytics.totalQuantity,
          description: "Units in stock",
          color: "bg-emerald-500",
          lightColor: "bg-emerald-50 text-emerald-700",
        },
        {
          icon: DollarSign,
          label: "Average Price",
          value: `₹${analytics.avgPrice}`,
          description: "Per product",
          color: "bg-amber-500",
          lightColor: "bg-amber-50 text-amber-700",
        },
        {
          icon: Layers,
          label: "Categories",
          value: analytics.productsByCategory.length,
          description: "Types listed",
          color: "bg-violet-500",
          lightColor: "bg-violet-50 text-violet-700",
        },
      ]
    : [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-sky-50/50 to-slate-50 pt-20">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto" />
          <p className="mt-4 text-sm text-muted-foreground">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/50 to-slate-50 pt-16 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                <Fish className="h-5 w-5 text-sky-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground ml-[52px]">
              Welcome back, {user?.name}
            </p>
          </div>
          <Button
            onClick={() => navigate("/seller/list-product")}
            className="bg-sky-500 hover:bg-sky-600 h-10 self-start sm:self-center"
          >
            <Plus className="h-4 w-4" />
            List New Product
          </Button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4"
            >
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 flex-1">{error}</p>
              <button
                onClick={() => setError("")}
                className="text-red-400 hover:text-red-600"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl p-1 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-sky-500 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── OVERVIEW TAB ─── */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Stat Cards */}
            {analytics && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {statCards.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-sm text-muted-foreground font-medium">
                              {stat.label}
                            </p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">
                              {stat.value}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {stat.description}
                            </p>
                          </div>
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.color}`}
                          >
                            <stat.icon className="h-5 w-5 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Category & Quick Stats */}
            {analytics && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Products by Category
                    </CardTitle>
                    <CardDescription>
                      Distribution across your product types
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {analytics.productsByCategory.map((cat) => {
                      const pct = analytics.totalProducts
                        ? ((cat.count / analytics.totalProducts) * 100).toFixed(0)
                        : 0;
                      return (
                        <div key={cat._id} className="space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-slate-700">
                              {cat._id || "Uncategorized"}
                            </span>
                            <span className="text-muted-foreground">
                              {cat.count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100">
                            <div
                              className="h-2 rounded-full bg-sky-500 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                {/* Recent Products */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Products</CardTitle>
                    <CardDescription>
                      Your latest listings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {products.length > 0 ? (
                      <div className="space-y-3">
                        {products.slice(0, 5).map((product) => (
                          <div
                            key={product._id}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                          >
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                <ImageOff className="h-4 w-4 text-slate-400" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                ₹{product.price} · {product.quantity} in stock
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs shrink-0">
                              {product.category}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-6">
                        No products yet
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </motion.div>
        )}

        {/* ─── ANALYTICS TAB ─── */}
        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {analytics ? (
              <>
                {/* Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  {statCards.map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <Card>
                        <CardContent >
                          <p className="text-sm text-muted-foreground font-medium">
                            {stat.label}
                          </p>
                          <p className="text-3xl font-bold text-slate-900 mt-2">
                            {stat.value}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stat.description}
                          </p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Category Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription>
                      Breakdown of products across categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {analytics.productsByCategory.map((cat) => {
                      const percentage = (
                        (cat.count / analytics.totalProducts) *
                        100
                      ).toFixed(1);
                      return (
                        <div key={cat._id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium text-slate-700">
                              {cat._id || "Uncategorized"}
                            </span>
                            <span className="text-muted-foreground">
                              {cat.count} products ({percentage}%)
                            </span>
                          </div>
                          <div className="h-2.5 w-full rounded-full bg-slate-100">
                            <div
                              className="h-2.5 rounded-full bg-sky-500 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <BarChart3 className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No analytics data available yet
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* ─── PRODUCTS TAB ─── */}
        {activeTab === "products" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {products.length > 0 ? (
              products.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        {product.image ? (
                          <div className="md:w-48 h-44 md:h-auto shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="md:w-48 h-44 md:h-auto shrink-0 bg-slate-100 flex items-center justify-center">
                            <ImageOff className="h-8 w-8 text-slate-300" />
                          </div>
                        )}

                        {/* Content */}
                        <div className="flex-1 p-5">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-slate-900">
                                {product.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {product.description}
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="shrink-0 self-start border-sky-200 text-sky-700 bg-sky-50"
                            >
                              {product.category}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 border border-emerald-200">
                              ₹{product.price}
                            </Badge>
                            <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50 border border-amber-200">
                              Qty: {product.quantity}
                            </Badge>
                            {product.origin && (
                              <Badge className="bg-violet-50 text-violet-700 hover:bg-violet-50 border border-violet-200">
                                {product.origin}
                              </Badge>
                            )}
                          </div>

                          <Separator className="mb-4" />

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(`/product/${product._id}`)
                              }
                            >
                              <Eye className="h-4 w-4" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                navigate(
                                  `/seller/edit-product/${product._id}`
                                )
                              }
                            >
                              <Edit2 className="h-4 w-4" />
                              Edit
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                setShowDeleteConfirm(product._id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card>
                <CardContent className="py-16 text-center">
                  <Package className="h-14 w-14 text-slate-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">
                    No products listed yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Start selling by listing your first product
                  </p>
                  <Button
                    onClick={() => navigate("/seller/list-product")}
                    className="bg-sky-500 hover:bg-sky-600"
                  >
                    <Plus className="h-4 w-4" />
                    List Your First Product
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <Card className="max-w-sm w-full">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                    <Trash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <CardTitle>Delete Product?</CardTitle>
                  <CardDescription>
                    This action cannot be undone. The product will be permanently
                    removed from the marketplace.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowDeleteConfirm(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => handleDelete(showDeleteConfirm)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerDashboard;
