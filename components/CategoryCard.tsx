
import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  description: string;
  icon: React.ReactNode;
  onSelect: (category: Category) => void;
  disabled?: boolean;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, description, icon, onSelect, disabled }) => {
  return (
    <button
      onClick={() => onSelect(category)}
      disabled={disabled}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-8 text-left transition-all hover:border-blue-500 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-bold text-slate-900">{category}</h3>
      <p className="text-sm text-slate-500">{description}</p>
      <div className="mt-4 flex items-center text-sm font-semibold text-blue-600">
        Start Test
        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </button>
  );
};

export default CategoryCard;
