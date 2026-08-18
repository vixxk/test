import { motion } from "framer-motion";
import { memorySteps } from "../../data/memories";

const iconMap: Record<string, string> = {
  Upload: "/images/memories-icons/upload image icon.png",
  Sparkles: "/images/memories-icons/ai create.png",
  Play: "/images/memories-icons/moments.png",
  Share: "/images/memories-icons/share.png",
};

export default function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-white">
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
            <h2 className="section-title-dark">How It Works</h2>
            <div className="w-16 mt-2">
              <img src="/images/hero/heding-element.png" alt="" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {memorySteps.map((step) => {
            const iconSrc = iconMap[step.icon];
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: step.num * 0.1 }}
                className="card-light p-6 text-center relative"
              >
                <div className="absolute top-4 left-4">
                  <span className="w-7 h-7 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center">
                    {step.num}
                  </span>
                </div>
                <div className="w-16 h-16 mx-auto mb-4 mt-4 rounded-2xl bg-rudhvi-cream border border-gray-200 flex items-center justify-center">
                  <img
                    src={iconSrc}
                    alt={step.title}
                    className="w-14 h-14 object-contain"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
