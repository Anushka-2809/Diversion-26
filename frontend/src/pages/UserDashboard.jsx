import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit2,
  Save,
  X,
  Loader2,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  CreditCard,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Fish,
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

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://aqua-delight-backend.vercel.app/api";

const UserDashboard = () => {
  const { user, token, updateProfile, isBuyer } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || {},
  });

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    if (!isBuyer) {
      navigate("/");
    }
  }, [isBuyer, navigate]);

  // Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await fetch(`${API_URL}/order`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        setOrdersError(err.message);
      } finally {
        setOrdersLoading(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address_")) {
      const field = name.replace("address_", "");
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update profile");
      await updateProfile(formData);
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    Pending: {
      icon: Clock,
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
    Confirmed: {
      icon: CheckCircle2,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    Processing: {
      icon: Package,
      color: "bg-violet-50 text-violet-700 border-violet-200",
    },
    Shipped: {
      icon: Truck,
      color: "bg-sky-50 text-sky-700 border-sky-200",
    },
    Delivered: {
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    Cancelled: {
      icon: XCircle,
      color: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "My Orders", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50/50 to-slate-50 pt-16 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 mt-2">
                <User className="h-5 w-5 text-sky-600" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                My Account
              </h1>
            </div>
            <p className="text-muted-foreground ml-[52px]">
              Welcome back, {user?.name}
            </p>
          </div>
        </motion.div>

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
              {tab.id === "orders" && orders.length > 0 && (
                <Badge
                  variant="secondary"
                  className={`ml-1 text-xs h-5 ${
                    activeTab === "orders"
                      ? "bg-white/20 text-white"
                      : "bg-sky-100 text-sky-700"
                  }`}
                >
                  {orders.length}
                </Badge>
              )}
            </button>
          ))}
        </div>

        {/* ─── PROFILE TAB ─── */}
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mb-4">
                      <User className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                      {user?.name || "User"}
                    </h2>
                    <Badge className="bg-sky-50 text-sky-700 border-sky-200 mb-4">
                      {user?.role}
                    </Badge>
                    <Separator className="w-full mb-4" />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {user?.email}
                    </div>
                    {user?.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                        <Phone className="h-4 w-4" />
                        {user.phone}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Details Form */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Profile Details</CardTitle>
                      <CardDescription>
                        Manage your personal information
                      </CardDescription>
                    </div>
                    {!isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(true)}
                        className="gap-2 text-sky-600 border-sky-200 hover:bg-sky-50"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Alerts */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                      </motion.div>
                    )}
                    {success && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
                      >
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        {success}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-400" />
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ""}
                        disabled
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 text-slate-500 text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          disabled={!isEditing}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none disabled:bg-slate-50 disabled:text-slate-500"
                        />
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          disabled={!isEditing}
                          placeholder="Your phone number"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none disabled:bg-slate-50 disabled:text-slate-500"
                        />
                      </div>
                    </div>

                    {/* Address Section */}
                    <Separator />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-4 flex items-center gap-1.5">
                        <MapPin className="h-4 w-4 text-slate-400" />
                        Address
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 space-y-2">
                          <label className="text-sm font-medium text-slate-700">
                            Street
                          </label>
                          <input
                            type="text"
                            name="address_street"
                            value={formData.address?.street || ""}
                            onChange={handleChange}
                            disabled={!isEditing}
                            placeholder="Street address"
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none disabled:bg-slate-50 disabled:text-slate-500"
                          />
                        </div>
                        {[
                          { name: "city", label: "City" },
                          { name: "state", label: "State" },
                          { name: "zipCode", label: "Zip Code" },
                          { name: "country", label: "Country" },
                        ].map((field) => (
                          <div key={field.name} className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">
                              {field.label}
                            </label>
                            <input
                              type="text"
                              name={`address_${field.name}`}
                              value={formData.address?.[field.name] || ""}
                              onChange={handleChange}
                              disabled={!isEditing}
                              placeholder={field.label}
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sky-400 focus:border-transparent outline-none disabled:bg-slate-50 disabled:text-slate-500"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="submit"
                          disabled={loading}
                          className="flex-1 bg-sky-500 hover:bg-sky-600"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setIsEditing(false);
                            setError("");
                            setSuccess("");
                          }}
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* ─── ORDERS TAB ─── */}
        {activeTab === "orders" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
          >
            {ordersLoading ? (
              <div className="flex items-center justify-center py-32">
                <div className="text-center">
                  <Loader2 className="h-10 w-10 animate-spin text-sky-500 mx-auto" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Loading your orders...
                  </p>
                </div>
              </div>
            ) : ordersError ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">{ordersError}</p>
                </CardContent>
              </Card>
            ) : orders.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <ShoppingBag className="h-14 w-14 text-slate-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-slate-700 mb-2">
                    No orders yet
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Start exploring our fresh seafood collection!
                  </p>
                  <Button
                    onClick={() => navigate("/explore")}
                    className="bg-sky-500 hover:bg-sky-600"
                  >
                    <Fish className="h-4 w-4" />
                    Browse Products
                  </Button>
                </CardContent>
              </Card>
            ) : (
              orders.map((order, i) => {
                const StatusIcon =
                  statusConfig[order.status]?.icon || Clock;
                const statusColor =
                  statusConfig[order.status]?.color ||
                  "bg-slate-50 text-slate-700 border-slate-200";
                const isExpanded = expandedOrder === order._id;

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow">
                      {/* Order Header */}
                      <div
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-5 cursor-pointer hover:bg-slate-50/50 transition-colors"
                        onClick={() =>
                          setExpandedOrder(isExpanded ? null : order._id)
                        }
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 shrink-0">
                            <Package className="h-5 w-5 text-sky-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 text-sm">
                              {order.orderId}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-IN",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <Badge
                                className={`${statusColor} border text-xs`}
                              >
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {order.status}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="text-xs"
                              >
                                {order.items?.length || 0}{" "}
                                {order.items?.length === 1 ? "item" : "items"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mt-3 sm:mt-0">
                          <p className="text-lg font-bold text-slate-900">
                            ₹{order.totalPrice?.toFixed(2)}
                          </p>
                          {isExpanded ? (
                            <ChevronUp className="h-5 w-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-slate-400" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="overflow-hidden"
                          >
                            <Separator />
                            <div className="p-5 space-y-5">
                              {/* Order Items */}
                              <div>
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                  Order Items
                                </h4>
                                <div className="space-y-3">
                                  {order.items?.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 bg-sky-100 rounded-lg flex items-center justify-center shrink-0">
                                          <Fish className="h-4 w-4 text-sky-600" />
                                        </div>
                                        <div>
                                          <p className="text-sm font-medium text-slate-900">
                                            {item.fishName ||
                                              item.fishId?.name ||
                                              "Fish Item"}
                                          </p>
                                          <p className="text-xs text-muted-foreground">
                                            Qty: {item.quantity} × ₹
                                            {item.price}
                                          </p>
                                        </div>
                                      </div>
                                      <p className="text-sm font-semibold text-slate-900">
                                        ₹{item.subtotal?.toFixed(2)}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Order Details Grid */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Payment */}
                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <div className="flex items-center gap-2 mb-1">
                                    <CreditCard className="h-4 w-4 text-slate-400" />
                                    <span className="text-xs font-medium text-muted-foreground">
                                      Payment
                                    </span>
                                  </div>
                                  <p className="text-sm font-medium text-slate-900">
                                    {order.paymentMethod}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className={`text-xs mt-1 ${
                                      order.paymentStatus === "Completed"
                                        ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                                        : order.paymentStatus === "Failed"
                                        ? "border-red-200 text-red-700 bg-red-50"
                                        : "border-amber-200 text-amber-700 bg-amber-50"
                                    }`}
                                  >
                                    {order.paymentStatus}
                                  </Badge>
                                </div>

                                {/* Delivery Address */}
                                <div className="p-3 bg-slate-50 rounded-lg">
                                  <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="h-4 w-4 text-slate-400" />
                                    <span className="text-xs font-medium text-muted-foreground">
                                      Delivery Address
                                    </span>
                                  </div>
                                  <p className="text-sm text-slate-900">
                                    {order.deliveryAddress?.street &&
                                      `${order.deliveryAddress.street}, `}
                                    {order.deliveryAddress?.city &&
                                      `${order.deliveryAddress.city}, `}
                                    {order.deliveryAddress?.state &&
                                      `${order.deliveryAddress.state} `}
                                    {order.deliveryAddress?.zipCode &&
                                      order.deliveryAddress.zipCode}
                                  </p>
                                </div>

                                {/* Phone */}
                                {order.phoneNumber && (
                                  <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Phone className="h-4 w-4 text-slate-400" />
                                      <span className="text-xs font-medium text-muted-foreground">
                                        Contact
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-900">
                                      {order.phoneNumber}
                                    </p>
                                  </div>
                                )}

                                {/* Notes */}
                                {order.notes && (
                                  <div className="p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <Package className="h-4 w-4 text-slate-400" />
                                      <span className="text-xs font-medium text-muted-foreground">
                                        Notes
                                      </span>
                                    </div>
                                    <p className="text-sm text-slate-900">
                                      {order.notes}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Total */}
                              <div className="flex justify-between items-center p-3 bg-sky-50 rounded-lg border border-sky-100">
                                <span className="text-sm font-medium text-sky-800">
                                  Order Total
                                </span>
                                <span className="text-lg font-bold text-sky-900">
                                  ₹{order.totalPrice?.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                );
              })
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
