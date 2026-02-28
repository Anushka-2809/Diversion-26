// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { UtensilsCrossed, Brain, Tag, Truck } from "lucide-react";

const features = [
  {
    icon: UtensilsCrossed,
    title: "Recipe Suggestions",
    description:
      "Get AI-powered recipe recommendations for every fish you buy. Discover new dishes, cooking techniques, and curated YouTube video tutorials tailored to your catch.",
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-500",
    glowColor: "rgba(16,185,129,0.08)",
    borderHover: "hover:border-emerald-200",
  },
  {
    icon: Brain,
    title: "ML Freshness Detection",
    description:
      "Our machine learning model analyzes fish images to provide a real-time freshness score — checking eyes, texture, color, and more to certify quality before you buy.",
    iconBg: "bg-sky-50",
    iconColor: "text-sky-500",
    glowColor: "rgba(14,165,233,0.08)",
    borderHover: "hover:border-sky-200",
  },
  {
    icon: Tag,
    title: "Smart Pricing",
    description:
      "Transparent, competitive pricing directly from verified sellers. No middlemen, no hidden fees — just fair prices for premium quality seafood.",
    iconBg: "bg-violet-50",
    iconColor: "text-violet-500",
    glowColor: "rgba(139,92,246,0.08)",
    borderHover: "hover:border-violet-200",
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description:
      "From ocean to doorstep in record time. Our optimized logistics ensure your fresh catch arrives quickly with cold-chain packaging to preserve freshness.",
    iconBg: "bg-rose-50",
    iconColor: "text-rose-500",
    glowColor: "rgba(244,63,94,0.08)",
    borderHover: "hover:border-rose-200",
  },
];

const stats = [
  { value: 2, suffix: "+", label: "Years Experience" },
  { value: 5000, suffix: "+", label: "Happy Customers" },
  { value: 30, suffix: "+", label: "Fish Varieties" },
  { value: 4.9, suffix: "★", label: "Average Rating", decimals: 1 },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const WhyChoose = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">

      {/* background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0ea5e9 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Why Choose <span className="text-sky-500">AquaDelight</span>
          </h2>

          <p className="text-slate-500 max-w-xl mx-auto">
            Powered by AI and built for freshness — here's what makes us different.
          </p>
        </motion.div>

        {/* features */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              className={`group relative bg-white rounded-2xl border border-slate-100 ${feature.borderHover} shadow-[0_2px_16px_0_rgba(0,0,0,0.05)] hover:shadow-[0_16px_48px_0_rgba(0,0,0,0.09)] transition-all duration-300 p-7 flex flex-col overflow-hidden`}
            >
              {/* glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at top left, ${feature.glowColor}, transparent 70%)`,
                }}
              />

              <div
                className={`w-12 h-12 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 relative z-10`}
              >
                <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
              </div>

              <h3
                className="text-sm font-bold text-slate-800 mb-2 group-hover:text-sky-600 transition-colors duration-200 relative z-10"
                style={{ fontFamily: "'Sora', 'Nunito', sans-serif" }}
              >
                {feature.title}
              </h3>

              <p className="text-sm text-slate-500 leading-relaxed font-light relative z-10">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* stats */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-slate-50 border border-slate-100 rounded-2xl p-10 text-center"
        >
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-slate-900">
                <CountUp
                  end={stat.value}
                  duration={2}
                  decimals={stat.decimals || 0}
                />
                {stat.suffix}
              </p>

              <p className="text-xs uppercase tracking-wider text-slate-400 mt-2">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChoose;