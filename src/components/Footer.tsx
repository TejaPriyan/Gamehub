import { motion } from 'framer-motion';
import { Gamepad2, Github, Globe, Sparkles, Heart, ExternalLink, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com/TejaPriyan', label: 'GitHub', color: 'hover:text-accent-cyan' },
    { icon: Globe, href: 'https://portfoliotejapriyan.vercel.app/', label: 'Portfolio', color: 'hover:text-accent-magenta' },
    { icon: Sparkles, href: 'https://github.com/TejaPriyan/Gamehub', label: 'Gamehub Repo', color: 'hover:text-accent-purple' },
  ];

  const footerLinks = [
    {
      title: 'ARENA CHALLENGES',
      links: [
        { label: 'Neon Pulse (Rhythm)', href: '#games' },
        { label: 'Vortex Defender (360°)', href: '#games' },
        { label: 'Quantum Drift 2099', href: '#games' },
        { label: 'Hexa Matrix (Puzzle)', href: '#games' },
        { label: 'Cyber Slash (Reflex)', href: '#games' },
        { label: 'Grav-Runner (Platformer)', href: '#games' },
      ],
    },
    {
      title: 'OPERATIVE CARDS',
      links: [
        { label: 'Forge Player Identity', href: '#hero' },
        { label: '3D Holographic Tilt', href: '#hero' },
        { label: 'Download Card PNG', href: '#hero' },
        { label: 'Share Gamer Tag', href: '#hero' },
      ],
    },
    {
      title: 'ECOSYSTEM',
      links: [
        { label: 'Teja Priyan Portfolio', href: 'https://portfoliotejapriyan.vercel.app/' },
        { label: 'GitHub Repositories', href: 'https://github.com/TejaPriyan' },
        { label: 'AI Workspace', href: 'https://github.com/TejaPriyan/TejapriyanAI' },
      ],
    },
  ];

  return (
    <footer className="relative bg-dark-background border-t border-accent-cyan/20">
      {/* Top Glow Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-60" />

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
                <h2 className="font-heading text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-cyan to-accent-magenta tracking-tight">
                  TEJA PRIYAN
                </h2>
                <p className="font-mono text-xs text-light-foreground/60 tracking-widest uppercase -mt-1">
                  WORLD • CYBER ARCADE
                </p>
              </div>
            </Link>

            <p className="font-paragraph text-sm text-light-foreground/75 max-w-md leading-relaxed">
              High-performance cyberpunk browser arcade and operative card generator. Built with Astro, React, Framer Motion, and Web Audio API by Teja Priyan.
            </p>

            {/* Social & Official Links */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-xl bg-white/5 border border-white/10 ${social.color} transition-all duration-300 hover:scale-105 hover:border-accent-cyan/50 hover:shadow-[0_0_15px_rgba(0,255,255,0.25)]`}
                  title={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4 font-mono">
              <h3 className="text-xs font-bold text-accent-cyan uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2.5 text-xs">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-light-foreground/65 hover:text-accent-magenta transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan/40 group-hover:bg-accent-magenta transition-colors" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 font-mono text-xs text-light-foreground/55">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-center md:text-left">
              &copy; {currentYear} Teja Priyan World. All rights reserved.
            </p>

            <div className="flex items-center gap-2">
              <span>Engineered by</span>
              <span className="text-accent-cyan font-bold">Teja Priyan</span>
              <span>with</span>
              <Heart className="w-3.5 h-3.5 text-accent-magenta fill-accent-magenta animate-pulse" />
            </div>

            <div className="flex items-center gap-4">
              <span className="text-accent-cyan">STATION: ONLINE</span>
              <span>//</span>
              <span>LATENCY: 12ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-accent-magenta via-accent-purple to-accent-cyan opacity-40" />
    </footer>
  );
}
