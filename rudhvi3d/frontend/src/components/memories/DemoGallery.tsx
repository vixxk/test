import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { memoryDemosData } from "../../data/memories";

export default function DemoGallery() {
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
            <h2 className="section-title-dark">
              Bring Your Puja Moments to Life
            </h2>
            <div className="w-16 mt-2">
              <img src="/images/hero/heding-element.png" alt="" />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {memoryDemosData.map((demo) => (
            <motion.div
              key={demo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md group-hover:shadow-xl transition-shadow">
                <img
                  src={demo.image}
                  alt={demo.title}
                  className="w-full aspect-square object-fill"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play size={22} className="text-red-600 ml-0.5" />
                  </div>
                </div>
              </div>
              <p className="text-center text-sm font-medium text-gray-700 mt-3">
                {demo.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
