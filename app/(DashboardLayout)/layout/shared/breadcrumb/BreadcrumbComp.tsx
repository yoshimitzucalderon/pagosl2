import React from 'react';
import Link from 'next/link';

interface BreadcrumbItem {
  to: string;
  title: string;
}

interface BreadcrumbCompProps {
  title: string;
  items: BreadcrumbItem[];
}

const BreadcrumbComp: React.FC<BreadcrumbCompProps> = ({ title, items }) => {
  return (
    <div className="mb-6">
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {items.map((item, index) => (
            <li key={index} className="inline-flex items-center">
              {index > 0 && (
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
              )}
              {index === items.length - 1 ? (
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {item.title}
                </span>
              ) : (
                <Link href={item.to} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                  {item.title}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
        {title}
      </h1>
    </div>
  );
};

export default BreadcrumbComp; 