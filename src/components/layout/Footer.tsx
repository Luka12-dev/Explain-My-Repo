import React from 'react';
import { Github, Youtube, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'GitHub Profile',
      url: 'https://github.com/Luka12-dev/',
      icon: Github,
    },
    {
      name: 'YouTube Channel',
      url: 'https://www.youtube.com/@LukaCyber-s4b7o',
      icon: Youtube,
    },
    {
      name: 'Project Repository',
      url: 'https://github.com/Luka12-dev/Explain-My-Repo',
      icon: ExternalLink,
    },
  ];

  return (
    <footer className="border-t border-liquid-blue-200 dark:border-liquid-dark-200 bg-white/50 dark:bg-black/50 backdrop-blur-md mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gradient-blue dark:text-gradient-dark">
              Explain My Repo
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              AI-powered repository analysis tool with modern liquid design. Analyze any GitHub repository with advanced AI models.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-liquid-blue-500 dark:hover:text-white smooth-transition"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-liquid-blue-500 dark:hover:text-white smooth-transition"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/settings"
                  className="text-gray-600 dark:text-gray-400 hover:text-liquid-blue-500 dark:hover:text-white smooth-transition"
                >
                  Settings
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Connect</h4>
            <div className="flex flex-col space-y-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-liquid-blue-500 dark:hover:text-white smooth-transition group"
                  >
                    <Icon size={18} className="group-hover:scale-110 smooth-transition" />
                    <span className="text-sm">{link.name}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-liquid-blue-200 dark:border-liquid-dark-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {currentYear} Explain My Repo. Created by Luka.
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Built with React, TypeScript, Next.js & Node.js
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
