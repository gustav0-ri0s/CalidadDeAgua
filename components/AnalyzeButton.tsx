
import React from 'react';
import { SpinnerIcon } from './Icons';

interface AnalyzeButtonProps {
  onClick: () => void;
  isLoading: boolean;
}

export const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ onClick, isLoading }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      className="w-full md:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transform hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
    >
      {isLoading ? (
        <>
          <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
          Analizando...
        </>
      ) : (
        'Interpretar calidad del agua'
      )}
    </button>
  );
};
