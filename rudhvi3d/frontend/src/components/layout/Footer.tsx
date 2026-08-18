import { MapPin, Phone, Mail, Instagram, Youtube, Facebook, Twitter } from 'lucide-react';
import { footerLinks } from '../../data/navigation';

interface FooterProps {
  variant: 'dark' | 'light';
}

export default function Footer({ variant }: FooterProps) {
  const isDark = variant === 'dark';

  return (
    <footer className={`${isDark ? 'bg-rudhvi-darker border-t border-rudhvi-border' : 'bg-gray-50 border-t border-gray-200'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
                <span className="text-black font-bold text-lg font-serif">R</span>
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-serif font-bold ${isDark ? 'text-gold-400' : 'text-gray-900'}`}>RUDHVI</span>
                <span className={`text-[10px] tracking-[0.2em] uppercase -mt-1 ${isDark ? 'text-gold-500/70' : 'text-gray-500'}`}>IMMERSIVE</span>
              </div>
            </div>
            <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              India&apos;s first immersive Durga Puja experience platform. Explore pandals in 360° &amp; VR, create AI-powered 3D memories, and relive the magic.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {[Instagram, Youtube, Facebook, Twitter].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                    isDark ? 'bg-rudhvi-card border border-rudhvi-border hover:border-gold-500 text-gray-400 hover:text-gold-400' : 'bg-white border border-gray-200 hover:border-red-400 text-gray-500 hover:text-red-600'
                  }`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Explore</h4>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((item) => (
                <li key={item}>
                  <a href="#" className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-gold-400' : 'text-gray-600 hover:text-red-700'}`}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((item) => (
                <li key={item}>
                  <a href="#" className={`text-sm transition-colors ${isDark ? 'text-gray-400 hover:text-gold-400' : 'text-gray-600 hover:text-red-700'}`}>{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className={`font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin size={16} className={`mt-0.5 flex-shrink-0 ${isDark ? 'text-gold-400' : 'text-red-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Kolkata, West Bengal, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className={`flex-shrink-0 ${isDark ? 'text-gold-400' : 'text-red-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className={`flex-shrink-0 ${isDark ? 'text-gold-400' : 'text-red-600'}`} />
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>hello@rudhvi.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={`mt-12 pt-8 border-t ${isDark ? 'border-rudhvi-border' : 'border-gray-200'}`}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
              &copy; 2026 RUDHVI IMMERSIVE. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy Policy', 'Terms of Service', 'Refund Policy'].map((item) => (
                <a key={item} href="#" className={`text-sm transition-colors ${isDark ? 'text-gray-500 hover:text-gold-400' : 'text-gray-500 hover:text-red-700'}`}>{item}</a>
              ))}
            </div>
          </div>
          <p className={`text-center mt-4 text-sm font-serif ${isDark ? 'text-gold-500/60' : 'text-red-700/60'}`}>
            RUDHVI IMMERSIVE &ndash; Relive. Cherish. Share.
          </p>
        </div>
      </div>
    </footer>
  );
}
