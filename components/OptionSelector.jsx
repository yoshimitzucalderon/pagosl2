'use client';

import { useRouter } from 'next/navigation';

export default function OptionSelector() {
  const router = useRouter();

  const options = [
    {
      title: 'Upload Document',
      description: 'Upload and process payment documents with OCR',
      icon: '📄',
      href: '/upload',
      color: 'blue',
    },
    {
      title: 'Manual Entry',
      description: 'Enter payment information manually',
      icon: '✏️',
      href: '/manual',
      color: 'green',
    },
    {
      title: 'Payment History',
      description: 'View all processed payments',
      icon: '📋',
      href: '/history',
      color: 'purple',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {options.map((option) => (
        <div
          key={option.title}
          onClick={() => router.push(option.href)}
          className="card-hover cursor-pointer group"
        >
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl group-hover:bg-accent-50 transition-colors">
                {option.icon}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-accent-600 transition-colors">
                {option.title}
              </h3>
              <p className="text-gray-600 text-sm mt-1">
                {option.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <svg 
                className="w-5 h-5 text-gray-400 group-hover:text-accent-500 transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 