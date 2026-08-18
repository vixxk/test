import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { vrProductData } from '../../data/vrStore';

export default function VRStoreSection() {
  return (
    <section id="vr-store" className="py-16 md:py-24 bg-rudhvi-dark relative overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 50% 80%, rgba(201, 160, 65, 0.2) 0%, transparent 60%)' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card-dark p-6 md:p-10 lg:p-14"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <p className="text-gold-400 text-xs font-bold tracking-widest uppercase mb-3">RUDHVI VR VIEWER</p>
              <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
                See Durga Puja<br />Like You&apos;re Really There
              </h2>
              <p className="text-gray-400 mb-6">The ultimate VR headset designed for the immersive Durga Puja experience. Premium optics, adjustable fit, and universal compatibility.</p>

              <div className="grid grid-cols-2 gap-3 mb-8">
                {vrProductData.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2">
                    <Check size={14} className="text-gold-400" />
                    <span className="text-sm text-gray-300">{feat}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-4xl font-bold text-white">{vrProductData.price}</span>
                  <p className="text-xs text-gray-500 mt-1">Includes {vrProductData.includesMembership}</p>
                </div>
                <button className="btn-gold">
                  Buy VR Viewer
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square max-w-sm mx-auto relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold-500/10 to-transparent" />
                <img
                  src={vrProductData.image}
                  alt={vrProductData.name}
                  className="w-full h-full object-cover rounded-3xl"
                />
                <div className="absolute top-4 right-4 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  1 MONTH PREMIUM
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
