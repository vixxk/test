import { motion } from "framer-motion";
import { trustBadgesData } from "../../data/memories";

const iconMap: Record<string, string> = {
  Shield: "/images/memories-icons/secure.png",
  Tv: "/images/memories-icons/high quality.png",
  Zap: "/images/memories-icons/processing.png",
  Monitor: "/images/memories-icons/all device.png",
  Heart: "/images/memories-icons/lead.png",
};

export default function TrustBadges() {
  return (
    <section className="py-12 md:py-16 bg-rudhvi-cream border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {trustBadgesData.map((badge) => {
            const iconSrc = iconMap[badge.icon];
            return (
              <div key={badge.title} className="flex items-start gap-3 p-3">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0">
                  <img
                    src={iconSrc}
                    alt={badge.title}
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">
                    {badge.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{badge.desc}</p>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* <p className="text-center mt-8 text-sm font-serif text-red-700/70">
          RUDHVI IMMERSIVE &ndash; Relive. Cherish. Share.
        </p> */}
      </div>
    </section>
  );
}
