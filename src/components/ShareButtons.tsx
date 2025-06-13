'use client';

import React from 'react';

interface ShareButtonsProps {
  title: string;
}

export default function ShareButtons({ title }: ShareButtonsProps) {
  return (
    <div className="flex space-x-4">
      <button
        onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(title)}`, '_blank')}
        className="text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Twitter'da Paylaş"
      >
        Twitter
      </button>
      <button
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank')}
        className="text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="Facebook'ta Paylaş"
      >
        Facebook
      </button>
      <button
        onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(title)}`, '_blank')}
        className="text-gray-600 hover:text-blue-600 transition-colors"
        aria-label="LinkedIn'de Paylaş"
      >
        LinkedIn
      </button>
    </div>
  );
} 