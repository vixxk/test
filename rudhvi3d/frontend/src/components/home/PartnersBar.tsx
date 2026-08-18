import { motion } from "framer-motion";
import { partnersData, partnersBarConfig } from "../../data/partners";

export default function PartnersBar() {
  const logoGroups = [partnersData, partnersData];

  return (
    <section className="relative z-20 px-4 sm:px-6 lg:px-8 py-8 md:py-10 bg-rudhvi-cream">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto"
      >
        <div className="relative bg-white border border-gold-500 rounded-2xl shadow-xl shadow-black/10 overflow-hidden -mt-10 md:-mt-12">
          <div className="relative px-12 md:px-16 py-6 md:py-7">
            {/* Left Element */}
            <div className="absolute -left-3 md:-left-4 top-1/2 -translate-y-1/2 w-14 h-14 md:w-20 md:h-20 shadow-sm flex items-center justify-center z-10">
              <img src="/images/partner/e1.png" alt="" />
            </div>

            {/* Right Element */}
            <div className="absolute -right-3 md:-right-4 top-1/2 -translate-y-1/2 w-14 h-14 md:w-20 md:h-20 shadow-sm flex items-center justify-center z-10">
              <img
                src="/images/partner/e1.png"
                alt=""
                className="scale-x-[-1]"
              />
            </div>

            {/* Title */}
            <p className="text-center text-red-700 text-[10px] md:text-[11px] font-semibold tracking-[0.2em] uppercase mb-5">
              {partnersBarConfig.title}
            </p>

            {/* Partner Logos */}
            <div className="relative overflow-hidden">
              <motion.div
                className="flex w-max items-center"
                animate={{ x: ["0%", "-50%"] }}
                transition={{
                  duration: 18,
                  ease: "linear",
                  repeat: Infinity,
                }}
              >
                {logoGroups.map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    className="flex items-center gap-6 md:gap-10 lg:gap-12 pr-6 md:pr-10 lg:pr-12"
                    aria-hidden={groupIndex === 1}
                  >
                    {group.map((partner) => (
                      <motion.a
                        key={`${partner.id}-${groupIndex}`}
                        href={partner.website || "#"}
                        whileHover={{ scale: 1.08 }}
                        className="flex-shrink-0 flex items-center justify-center h-8 md:h-10 transition-all duration-300"
                        tabIndex={groupIndex === 1 ? -1 : undefined}
                      >
                        <img
                          src={partner.logoUrl}
                          alt={groupIndex === 0 ? partner.name : ""}
                          className="h-7 md:h-9 w-auto object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            if (target.parentElement) {
                              target.parentElement.innerHTML = `<span class="text-gray-800 font-bold text-base md:text-lg whitespace-nowrap">${partner.name}</span>`;
                            }
                          }}
                        />
                      </motion.a>
                    ))}
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
