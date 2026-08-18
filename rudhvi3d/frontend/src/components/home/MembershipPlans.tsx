import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown } from "lucide-react";
import { membershipPlans, membershipBenefits } from "../../data/membership";

const membershipBenefitIcons: Record<string, string> = {
  "Mobile, Web, Smart TV & VR Support": "/images/pricing-icons/all screen.png",
  "HD Quality Streaming": "/images/pricing-icons/fhd.png",
  "Secure & Safe Payments": "/images/pricing-icons/secure.png",
  "Cancel Anytime": "/images/pricing-icons/cancle anytime.png",
};

export default function MembershipPlans() {
  const [hasPass, setHasPass] = useState<boolean>(false);

  useEffect(() => {
    setHasPass(localStorage.getItem("puja3d_pass") === "true");
  }, []);

  const handlePlanSelect = () => {
    localStorage.setItem("puja3d_pass", "true");
    setHasPass(true);
    window.dispatchEvent(new Event("storage"));
    const exploreEl = document.getElementById("explore");
    if (exploreEl) {
      exploreEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="membership" className="py-16 md:py-24 bg-rudhvi-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title-dark">Choose Your Membership</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Unlock the full immersive Durga Puja experience with Puja3D Pass. All premium 360° & VR pandals unlocked.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {membershipPlans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className={`relative rounded-2xl p-6 md:p-8 border transition-all duration-300 ${
                hasPass
                  ? "bg-white/90 border-gray-200 opacity-80 select-none cursor-not-allowed"
                  : plan.highlight
                  ? "bg-white border-gold-400 shadow-xl shadow-gold-200/30 scale-[1.02]"
                  : "bg-white border-gray-200 hover:border-gold-300 hover:shadow-lg"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gold-500 text-black text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Sparkles size={10} /> {plan.badge}
                  </span>
                </div>
              )}
              <div className="text-center mb-6">
                <h3 className="font-semibold text-gray-900 text-lg">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handlePlanSelect}
                disabled={hasPass}
                className={`w-full py-3 rounded-full text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  hasPass
                    ? "bg-emerald-600 text-white font-bold cursor-not-allowed pointer-events-none opacity-90 shadow-none"
                    : plan.highlight
                    ? "bg-gradient-to-r from-gold-500 to-gold-400 text-black hover:shadow-lg"
                    : "border-2 border-gray-300 text-gray-700 hover:border-gold-400 hover:text-gold-600"
                }`}
              >
                {hasPass ? (
                  <>
                    <Crown size={16} /> Active
                  </>
                ) : (
                  plan.cta
                )}
              </button>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-500">
          {membershipBenefits.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <img
                src={membershipBenefitIcons[item]}
                alt=""
                className="w-6 h-6 object-contain flex-shrink-0"
              />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
