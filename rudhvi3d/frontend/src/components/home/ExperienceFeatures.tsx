import { motion } from "framer-motion";
import { featuresData } from "../../data/features";

const iconMap: Record<string, string> = {
  Degree: "/images/icons/360 degree.png",
  Experience: "/images/icons/day night experience.png",
  Audio: "/images/icons/special sound.png",
  Map: "/images/icons/map icon.png",
  Vr: "/images/icons/vr.png",
  Pass: "/images/icons/pass.png",
};

export default function ExperienceFeatures() {
  return (
    <section id="experiences" className="py-16 md:py-24 bg-rudhvi-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title-gold">
            Experience Puja Like Never Before
          </h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
            Cutting-edge technology meets ancient tradition. Six immersive
            features that transport you right into the heart of the celebration.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {featuresData.map((feature, idx) => {
            const iconSrc = iconMap[feature.icon];

            return (
              <motion.div
                key={feature.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="card-dark p-5 text-center group cursor-pointer"
              >
                <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-rudhvi-dark border border-rudhvi-border flex items-center justify-center group-hover:border-gold-500 transition-colors">
                  <img
                    src={iconSrc}
                    alt={feature.label}
                    className="w-8 h-8 object-contain"
                  />
                </div>

                <p className="text-sm text-gray-300 font-medium">
                  {feature.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
