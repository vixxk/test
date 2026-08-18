import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { memoryPlansData } from "../../data/memories";

const iconMap: Record<string, string> = {
  Star: "/images/memories-icons/photo memomry.png",
  Heart: "/images/memories-icons/couple photo.png",
  Users: "/images/memories-icons/family photo.png",
  Film: "/images/memories-icons/cinematic experience.png",
  Package: "/images/memories-icons/memory pack.png",
};

export default function MemoryPricing() {
  return (
    <section className="py-16 md:py-24 bg-rudhvi-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-16 mt-2">
              <img src="/images/hero/heding-element.png" alt="" />
            </div>
            <h2 className="section-title-dark">
              Choose Your Memory Experience
            </h2>
            <div className="w-16 mt-2">
              <img src="/images/hero/heding-element.png" alt="" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {memoryPlansData.map((plan, idx) => {
            const iconSrc = iconMap[plan.icon];
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="relative card-light overflow-visible p-5 pt-7"
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 z-20 -translate-x-1/2">
                    <span className="block whitespace-nowrap rounded-full bg-red-600 px-2.5 py-1 text-[9px] font-bold text-white shadow-md">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="text-center mb-4 pt-2">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-rudhvi-cream border border-gray-200 flex items-center justify-center">
                    <img
                      src={iconSrc}
                      alt={plan.name}
                      className="w-10 h-10 object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {plan.name}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {plan.price}
                  </p>
                </div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2">
                      <Check
                        size={14}
                        className="text-green-500 mt-0.5 flex-shrink-0"
                      />
                      <span className="text-xs text-gray-600">{feat}</span>
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2.5 rounded-full text-sm font-semibold bg-red-700 text-white hover:bg-red-600 transition-colors">
                  {idx === 4 ? "Get Pack Now" : "Create Now"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
