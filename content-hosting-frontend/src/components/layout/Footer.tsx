import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">ContentHub</h3>
            <p className="text-gray-400 text-sm">
              A modern platform for hosting and sharing articles and podcasts.
              Create, publish, and discover amazing content.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/articles" className="hover:text-white transition-colors">Articles</a></li>
              <li><a href="/podcasts" className="hover:text-white transition-colors">Podcasts</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><span className="cursor-pointer hover:text-white transition-colors">Help Center</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Contact Us</span></li>
              <li><span className="cursor-pointer hover:text-white transition-colors">Privacy Policy</span></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} ContentHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;