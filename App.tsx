import React, { useState, useCallback } from 'react';
import { WaterQualityData } from './types';
import { analyzeWaterQuality } from './services/geminiService';
import { NumberInput } from './components/NumberInput';
import { AnalyzeButton } from './components/AnalyzeButton';
import { ResultDisplay } from './components/ResultDisplay';
import { DropletIcon, ThermometerIcon, TestTubeIcon, WaterIcon, MapPinIcon } from './components/Icons';

const App: React.FC = () => {
  const [waterData, setWaterData] = useState<WaterQualityData>({
    source: '',
    turbidity: '',
    temperature: '',
    tds: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'source') {
        setWaterData(prev => ({ ...prev, [name]: value }));
    } else {
        // Allow only numbers and a single decimal point for numeric fields
        if (/^\d*\.?\d*$/.test(value)) {
            setWaterData(prev => ({ ...prev, [name]: value }));
        }
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!waterData.source || !waterData.turbidity || !waterData.temperature || !waterData.tds) {
      setError('Por favor, complete todos los campos.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysis = await analyzeWaterQuality(waterData);
      setResult(analysis);
    } catch (err) {
      setError('Hubo un error al contactar el servicio de análisis. Por favor, intente de nuevo más tarde.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [waterData]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3 mb-2">
                <WaterIcon className="h-8 w-8 text-blue-500" />
                <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Analizador de Calidad del Agua</h1>
            </div>
          <p className="text-slate-500 text-md">
            Ingrese los valores medidos y el origen del agua para obtener un análisis contextualizado por IA.
          </p>
        </div>
        
        <div className="flex flex-col gap-6 mb-8">
            <div>
              <label htmlFor="source" className="font-semibold text-slate-700 mb-2 block">Origen de la Muestra</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon className="h-5 w-5 text-slate-400"/>
                </div>
                <input
                  type="text"
                  id="source"
                  name="source"
                  value={waterData.source}
                  onChange={handleChange}
                  placeholder="Ej: Grifo de la cocina, Río Cumbaza"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">El contexto del origen es clave para un análisis preciso.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <NumberInput
                label="Turbidez"
                name="turbidity"
                value={waterData.turbidity}
                onChange={handleChange}
                unit="%"
                placeholder="Ej: 5"
                icon={<DropletIcon className="h-5 w-5 text-slate-400"/>}
              />
              <NumberInput
                label="Temperatura"
                name="temperature"
                value={waterData.temperature}
                onChange={handleChange}
                unit="°C"
                placeholder="Ej: 15"
                icon={<ThermometerIcon className="h-5 w-5 text-slate-400"/>}
              />
              <NumberInput
                label="Nivel de TDS"
                name="tds"
                value={waterData.tds}
                onChange={handleChange}
                unit="ppm"
                placeholder="Ej: 250"
                icon={<TestTubeIcon className="h-5 w-5 text-slate-400"/>}
              />
            </div>
        </div>

        <div className="text-center mb-8">
          <AnalyzeButton onClick={handleSubmit} isLoading={isLoading} />
        </div>
        
        <ResultDisplay 
          isLoading={isLoading}
          error={error}
          result={result}
        />
      </div>
       <footer className="text-center mt-8 text-slate-500 text-sm">
        <p>Desarrollado con React, Tailwind CSS y la API de Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
