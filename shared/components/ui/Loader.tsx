import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
}

const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  color = 'primary',
  text,
  fullScreen = false,
}) => {
  // Tailles pour le spinner
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  // Couleurs pour le spinner
  const colorClasses = {
    primary: 'border-primary-600 border-t-transparent',
    secondary: 'border-gray-600 border-t-transparent',
    white: 'border-white border-t-transparent',
  };

  // Tailles pour le texte
  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50'
    : 'flex items-center justify-center';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center">
        <div
          className={`${sizeClasses[size]} border-4 ${colorClasses[color]} rounded-full animate-spin`}
          role="status"
          aria-label="Loading"
        />
        {text && (
          <p className={`mt-2 ${textSizeClasses[size]} font-medium text-gray-700`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

// Variantes du loader
export const ButtonLoader: React.FC<{ color?: 'primary' | 'secondary' | 'white' }> = ({ color = 'white' }) => {
  return <Loader size="sm" color={color} />;
};

export const PageLoader: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <div className="w-full max-w-4xl px-4">
        <div className="space-y-6 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-xl" />
            <div className="flex-1">
              <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-gray-200">
                <div className="h-4 w-20 bg-gray-200 rounded mb-3" />
                <div className="h-8 w-16 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-24 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const InlineLoader: React.FC<{ text?: string }> = ({ text }) => {
  return (
    <div className="flex items-center space-x-2">
      <Loader size="sm" color="primary" />
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
};
