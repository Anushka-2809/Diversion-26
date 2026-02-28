import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
  X,
  Loader2,
  Fish,
  ShoppingBag,
  Store,
  Sparkles,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await register(form.name, form.email, form.password, form.role);
      navigate("/");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-sky-500 via-sky-600 to-blue-700 items-center justify-center p-12">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
        <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] rounded-full border-[40px] border-white/10" />
        <div className="absolute bottom-[-60px] right-[-60px] w-[250px] h-[250px] rounded-full border-[30px] border-white/10" />
        <div className="absolute top-1/3 right-10 w-[120px] h-[120px] rounded-full bg-white/5" />

        <div className="relative z-10 text-white max-w-md">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm flex items-center justify-center border border-white/20">
                <Fish className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: "'Sora', 'Nunito', sans-serif" }}>
                Aqua<span className="text-sky-200">Delight</span>
              </span>
            </div>

            <h2 className="text-4xl font-bold leading-tight mb-4" style={{ fontFamily: "'Sora', 'Nunito', sans-serif" }}>
              Hello,<br />welcome!
            </h2>

            <p className="text-sky-100 text-base leading-relaxed mb-10 font-light">
              Create your account and start exploring the freshest seafood — powered by AI and delivered straight to your door.
            </p>

            <div className="space-y-4">
              {[
                { icon: Sparkles, text: "AI-powered recipe suggestions" },
                { icon: ShieldCheck, text: "ML freshness detection" },
                { icon: Truck, text: "Fast cold-chain delivery" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/15">
                    <item.icon className="w-4 h-4 text-sky-200" />
                  </div>
                  <span className="text-sm text-sky-100">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white px-6 py-12 relative">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "radial-gradient(circle, #0ea5e9 1px, transparent 1px)", backgroundSize: "36px 36px" }} />

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm relative z-10"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center">
                <Fish className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900" style={{ fontFamily: "'Sora', 'Nunito', sans-serif" }}>
                Aqua<span className="text-sky-500">Delight</span>
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1" style={{ fontFamily: "'Sora', 'Nunito', sans-serif" }}>
              Create Account
            </h1>
            <p className="text-sm text-slate-500 font-light">
              Join Aqua Delight and explore fresh seafood
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Alert */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-3"
                >
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700 flex-1">{error}</p>
                  <button type="button" onClick={() => setError("")} className="text-red-400 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  required
                  value={form.name}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  value={form.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  required
                  value={form.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="pl-10 h-12 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Account Type */}
            <div className="space-y-2">
              <Label className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Account Type
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "buyer" })}
                  disabled={isLoading}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3.5 transition-all ${
                    form.role === "buyer"
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                  } disabled:opacity-50`}
                >
                  <ShoppingBag
                    className={`h-5 w-5 ${
                      form.role === "buyer" ? "text-sky-600" : "text-slate-400"
                    }`}
                  />
                  <span className="text-sm font-semibold">Buyer</span>
                  <span className="text-[10px] text-slate-400">Browse & purchase</span>
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, role: "seller" })}
                  disabled={isLoading}
                  className={`flex flex-col items-center gap-1.5 rounded-xl border-2 p-3.5 transition-all ${
                    form.role === "seller"
                      ? "border-sky-500 bg-sky-50 text-sky-700"
                      : "border-slate-200 bg-slate-50 text-slate-500 hover:border-slate-300"
                  } disabled:opacity-50`}
                >
                  <Store
                    className={`h-5 w-5 ${
                      form.role === "seller" ? "text-sky-600" : "text-slate-400"
                    }`}
                  />
                  <span className="text-sm font-semibold">Seller</span>
                  <span className="text-[10px] text-slate-400">List & sell products</span>
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 text-sm font-semibold bg-sky-500 hover:bg-sky-600 rounded-xl shadow-[0_2px_12px_0_rgba(14,165,233,0.3)] hover:shadow-[0_4px_20px_0_rgba(14,165,233,0.45)] transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </>
                )}
              </Button>
              <Link to="/login" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 text-sm font-semibold rounded-xl border-slate-200 hover:border-sky-300 hover:text-sky-600 transition-all"
                >
                  Login
                </Button>
              </Link>
            </div>
          </form>

          <p className="text-xs text-center text-slate-400 mt-8">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;