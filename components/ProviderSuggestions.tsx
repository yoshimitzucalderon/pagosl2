"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Wand2, Check, X, Loader2 } from 'lucide-react';

interface ProviderSuggestion {
  id: string;
  proveedor: string;
  confidence: number;
}

interface ProviderSuggestionsProps {
  currentValue: string;
  onSelect: (provider: string) => void;
  className?: string;
}

const ProviderSuggestions: React.FC<ProviderSuggestionsProps> = ({
  currentValue,
  onSelect,
  className = ""
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ProviderSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMagicClick = async () => {
    if (!currentValue || currentValue.trim().length < 2) {
      setError('Escribe al menos 2 caracteres para buscar sugerencias');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      console.log('🪄 Buscando proveedores similares para:', currentValue);
      
             // Usar nuestro proxy local de Next.js
       const response = await fetch('/api/provider-suggestions', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify({
           search_term: currentValue.trim(),
           max_results: 3
         }),
         signal: AbortSignal.timeout(15000) // 15 segundos timeout
       });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

                    // Manejar la respuesta JSON con validación
       const responseText = await response.text();
       console.log('📊 Respuesta del servidor:', responseText);
       
       if (!responseText || responseText.trim() === '') {
         throw new Error('El servidor no devolvió ninguna respuesta');
       }
       
       let result;
       try {
         result = JSON.parse(responseText);
         console.log('📊 Resultado de la búsqueda:', result);
       } catch (parseError) {
         console.error('❌ Error parseando JSON:', parseError);
         throw new Error('Respuesta del servidor inválida');
       }

      if (result.success && result.suggestions) {
        setSuggestions(result.suggestions);
        setShowSuggestions(true);
        
        if (result.suggestions.length === 0) {
          setError('No se encontraron proveedores similares en la base de datos');
          setTimeout(() => setError(null), 5000);
        } else {
          console.log(`✅ Se encontraron ${result.suggestions.length} sugerencias`);
        }
      } else {
        throw new Error(result.message || 'No se pudieron obtener sugerencias');
      }

    } catch (error) {
      console.error('❌ Error obteniendo sugerencias:', error);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Tiempo de espera agotado. Inténtalo de nuevo.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Error desconocido al buscar sugerencias');
      }
      
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (provider: string) => {
    console.log('✅ Proveedor seleccionado:', provider);
    onSelect(provider);
    setShowSuggestions(false);
    setSuggestions([]);
    setError(null);
  };

  const handleReject = () => {
    console.log('❌ Usuario rechazó las sugerencias');
    setShowSuggestions(false);
    setSuggestions([]);
    setError(null);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {/* Botón Mágico */}
      <button
        type="button"
        onClick={handleMagicClick}
        disabled={isLoading || !currentValue || currentValue.trim().length < 2}
        className={`
          flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
          ${isLoading 
            ? 'bg-blue-100 text-blue-400 cursor-not-allowed' 
            : 'bg-purple-100 hover:bg-purple-200 text-purple-600 hover:text-purple-700 active:scale-95 hover:shadow-md'
          }
          ${(!currentValue || currentValue.trim().length < 2) ? 'opacity-50 cursor-not-allowed' : ''}
          focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-1
        `}
        title={
          !currentValue || currentValue.trim().length < 2 
            ? "Escribe al menos 2 caracteres" 
            : "Buscar proveedores similares con IA"
        }
      >
        {isLoading ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Wand2 size={16} />
        )}
      </button>

      {/* Menú de Sugerencias */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 animate-in slide-in-from-top-2 duration-200">
          <div className="mb-3">
            <h4 className="text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
              <span className="text-purple-600">🤖</span>
              Sugerencias de IA
            </h4>
            <p className="text-xs text-gray-500">
              Se encontraron {suggestions.length} proveedor{suggestions.length !== 1 ? 'es' : ''} similar{suggestions.length !== 1 ? 'es' : ''} en la base de datos:
            </p>
          </div>
          
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.id || index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {suggestion.proveedor}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${suggestion.confidence * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {Math.round(suggestion.confidence * 100)}%
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectSuggestion(suggestion.proveedor)}
                  className="ml-3 flex items-center justify-center w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full transition-all duration-200 group-hover:scale-110"
                  title="Usar esta sugerencia"
                >
                  <Check size={14} />
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs text-gray-500">
              💡 Selecciona una opción o mantén el valor actual
            </span>
            <button
              type="button"
              onClick={handleReject}
              className="flex items-center gap-1 px-3 py-1 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
            >
              <X size={12} />
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Mensaje de Error */}
      {error && (
        <div className="absolute top-full mt-2 right-0 w-72 bg-red-50 border border-red-200 rounded-lg p-3 z-50 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-start gap-2">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
              <X size={12} className="text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-red-800 leading-relaxed">{error}</p>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-xs text-red-600 hover:text-red-800 mt-2 underline"
              >
                Cerrar mensaje
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};

export default ProviderSuggestions; 