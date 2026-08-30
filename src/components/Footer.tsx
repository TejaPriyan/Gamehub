import { motion } from 'framer-motion';
import { Gamepad2, Github, Twitter, Youtube, Twitch, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter', color: 'hover:text-accent-cyan' },
    { icon: Youtube, href: '#', label: 'YouTube', color: 'hover:text-accent-magenta' },
    { icon: Twitch, href: '#', label: 'Twitch', color: 'hover:text-accent-purple' },
    { icon: Github, href: '#', label: 'GitHub', color: 'hover:text-accent-cyan' },
  ];

  const footerLinks = [
    {
      title: 'Gaming',
      links: [
        { label: 'Mini Games', href: '#games' },
        { label: 'Player Cards', href: '#hero' },
        { label: 'Leaderboards', href: '#' },
        { label: 'Tournaments', href: '#' },
      ],
    },
    {
      title: 'Community',
      links: [
        { label: 'Discord', href: '#' },
        { label: 'Forums', href: '#' },
        { label: 'Events', href: '#' },
        { label: 'Support', href: '#' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Game Guides', href: '#' },
        { label: 'FAQ', href: '#' },
        { label: 'API Docs', href: '#' },
        { label: 'Blog', href: '#' },
      ],
    },
  ];

  return (
    <footer className="relative bg-dark-background border-t border-accent-cyan/20">
      {/* Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-50" />

      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="relative">
                <div className="absolute inset-0 bg-accent-cyan blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                <Gamepad2 className="w-12 h-12 text-accent-cyan relative z-10" />
              </div>
              <div>
                <h2 className="font-heading text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta">
                  TEJA PRIYAN
                </h2>
                <p className="font-paragraph text-xs text-light-foreground/60 -mt-1">
                  WORLD
                </p>
              </div>
            </Link>

            <p className="font-paragraph text-sm text-light-foreground/70 max-w-md">
              Your ultimate destination for anime-inspired cyberpunk gaming. Create your player identity, dominate mini-games, and join a thriving community of gamers.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-lg bg-light-foreground/5 border border-light-foreground/10 ${social.color} transition-all duration-300 hover:scale-110 hover:shadow-lg hover:shadow-accent-cyan/20`}
                  whileHover={{ y: -4 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerLinks.map((section, sectionIndex) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-heading text-lg font-bold text-accent-cyan uppercase">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <motion.li
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: (sectionIndex * 0.1) + (linkIndex * 0.05) }}
                  >
                    <a
                      href={link.href}
                      className="font-paragraph text-sm text-light-foreground/60 hover:text-accent-magenta transition-colors duration-300 inline-flex items-center gap-2 group"
                    >
                      <span className="w-0 h-px bg-accent-magenta group-hover:w-4 transition-all duration-300" />
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-accent-cyan/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-paragraph text-sm text-light-foreground/50 text-center md:text-left">
              © {currentYear} Teja Priyan World. All rights reserved.
            </p>

            <div className="flex items-center gap-2 font-paragraph text-sm text-light-foreground/50">
              <span>Crafted with</span>
              <Heart className="w-4 h-4 text-accent-magenta fill-accent-magenta animate-pulse" />
              <span>for gamers worldwide</span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="#"
                className="font-paragraph text-sm text-light-foreground/50 hover:text-accent-cyan transition-colors duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="font-paragraph text-sm text-light-foreground/50 hover:text-accent-cyan transition-colors duration-300"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-accent-magenta via-accent-purple to-accent-cyan opacity-30" />
    </footer>
  );
}
