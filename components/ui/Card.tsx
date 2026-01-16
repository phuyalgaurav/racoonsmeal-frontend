import React from 'react';
import Image from 'next/image';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', noPadding = false }) => {
  return (
    <div className={`card-base ${noPadding ? '' : 'p-6'} ${className}`}>
      {children}
    </div>
  );
};

interface RecipeCardProps {
    title: string;
    description: string;
    imageUrl?: string;
    onEdit?: () => void;
    onLike?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ title, description, imageUrl, onEdit, onLike }) => {
    return (
        <div className="bg-white rounded-2xl border-2 border-main overflow-hidden flex flex-col h-full transform transition-transform hover:-translate-y-1 hover:shadow-lg duration-200">
            {/* Image Area */}
            <div className="aspect-video bg-gray-100 border-b-2 border-main relative">
               {imageUrl ? (
                   <Image 
                     src={imageUrl} 
                     alt={title} 
                     fill
                     className="object-cover"
                     unoptimized
                   />
               ) : (
                   <div className="w-full h-full flex items-center justify-center text-main/30 font-bold">
                       No Image
                   </div>
               )}
            </div>
            
            {/* Content */}
            <div className="p-4 grow flex flex-col">
                <h3 className="text-xl font-header font-bold text-main mb-1">{title}</h3>
                <p className="text-sm text-main/80 font-body line-clamp-2 mb-4 grow">{description}</p>
                
                {/* Footer Actions */}
                <div className="flex justify-between items-center mt-auto pt-3 border-t-2 border-main/10">
                    <button onClick={onLike} className="flex items-center gap-1 text-red font-bold hover:scale-110 transition-transform">
                        <span className="text-lg">♥</span> Like
                    </button>
                    {onEdit && (
                        <button onClick={onEdit} className="text-sidebar font-bold text-sm hover:underline">
                            Edit Recipe
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
