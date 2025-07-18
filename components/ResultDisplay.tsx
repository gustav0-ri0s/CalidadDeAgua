
import React from 'react';
import { SparklesIcon } from './Icons';

interface ResultDisplayProps {
  isLoading: boolean;
  error: string | null;
  result: string | null;
}

const formatResult = (text: string) => {
    // Basic Markdown to HTML conversion
    return text
      .replace(/### (.*)/g, '<h3 class="text-xl font-bold text-slate-800 mt-4 mb-2">$1</h3>')
      .replace(/#### (.*)/g, '<h4 class="text-lg font-semibold text-slate-700 mt-3 mb-1">$1</h4>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\* (.*)/g, '<li class="ml-5 list-disc">$1</li>')
      .replace(/\n/g, '<br />')
      .replace(/<br \/><li>/g, '<li>'); // Fix extra breaks before list items
  };

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, error, result }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="text-center text-slate-500">
          <p>Obteniendo análisis de la IA...</p>
          <p className="text-sm mt-1">Esto puede tardar unos segundos.</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
          <p className="font-semibold">Error</p>
          <p>{error}</p>
        </div>
      );
    }
    if (result) {
      return (
        <div className="prose prose-slate max-w-none p-6 bg-slate-100 rounded-lg">
           <div className="flex items-center gap-2 mb-4">
            <SparklesIcon className="h-6 w-6 text-blue-500" />
            <h2 className="text-2xl font-bold text-slate-900 m-0">Resultado del Análisis</h2>
          </div>
          <div
            className="text-slate-700"
            dangerouslySetInnerHTML={{ __html: formatResult(result) }}
          />
        </div>
      );
    }
    return (
      <div className="text-center text-slate-400 p-6 border-2 border-dashed border-slate-200 rounded-lg">
        <p>El resultado del análisis aparecerá aquí.</p>
      </div>
    );
  };

  return <div className="mt-6 animate-fade-in">{renderContent()}</div>;
};
