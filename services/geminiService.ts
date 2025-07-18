import { GoogleGenAI } from "@google/genai";
import { WaterQualityData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generatePrompt = (data: WaterQualityData): string => {
  return `
Eres un experto en análisis de calidad del agua. Tu tarea es interpretar los siguientes datos y proporcionar un diagnóstico claro y útil para un usuario no experto, **tomando en cuenta el origen del agua como contexto principal**.

Datos de la muestra de agua:
- **Origen de la muestra**: ${data.source}
- Turbidez: ${data.turbidity}%
- Temperatura: ${data.temperature}°C
- Sólidos Disueltos Totales (TDS): ${data.tds} ppm

**Instrucciones de Análisis Contextual:**

1.  **Analiza el Origen**: Primero, determina el tipo de fuente de agua basándote en el texto del origen.
    *   Si el origen contiene palabras como "río", "quebrada", "laguna", "manantial", "fuente natural", "pozo artesanal", el análisis debe enfocarse en la **salud del ecosistema acuático** y los riesgos ambientales. La recomendación **NO debe ser sobre consumo humano directo**.
    *   Si el origen contiene palabras como "agua potable", "caño", "canilla", "grifo", "red pública", "filtro", "botellón", el análisis debe centrarse en la **aptitud para el consumo humano**.
    *   Si el origen es ambiguo (ej: "pozo profundo", "reservorio"), usa tu criterio para dar el análisis más probable, o menciona ambas posibilidades.

2.  **Estructura de la Respuesta**: Proporciona una respuesta en formato Markdown con los siguientes apartados:

### Diagnóstico General
Un párrafo breve resumiendo la calidad general del agua, **contextualizado por su origen**. (Ej: "El agua de este río muestra signos de contaminación..." o "La calidad del agua del grifo es aceptable, pero...").

### Interpretación Contextual (Basada en el Origen)
Un párrafo dedicado a explicar qué significan los resultados **en el contexto del origen proporcionado**. Si es un río, habla de impacto ambiental. Si es un grifo, habla de seguridad para el hogar.

### Análisis por Parámetro
Evalúa cada valor (Turbidez, Temperatura, TDS) individualmente. Explica qué significa el valor **para ese tipo de fuente de agua**. Usa los siguientes rangos como guía general, pero adapta tu explicación al contexto:
- **Turbidez**: Ideal < 5%. Preocupante > 10%. Para ríos, una alta turbidez puede indicar erosión o contaminación. Para agua de grifo, cualquier valor visible es inaceptable.
- **Temperatura**: Para consumo, ideal 10-15°C. Para ecosistemas acuáticos, cambios bruscos o temperaturas > 25°C pueden dañar la vida acuática.
- **TDS**: Para consumo, ideal < 300 ppm. Aceptable 300-600 ppm. Malo > 900 ppm. En ríos, valores muy altos pueden indicar contaminación por sales o químicos.

### Alertas
Si algún valor es preocupante **para su contexto**, emite una alerta clara en una lista. Si no hay alertas, indica que "No se observan alertas significativas para este tipo de fuente."

### Recomendación Final
Concluye con una recomendación práctica, directa y **apropiada para el origen del agua**:
- Para fuentes naturales: "Se recomienda monitorear la fuente y buscar la causa de la alta turbidez. No consumir sin un tratamiento avanzado."
- Para fuentes de consumo: "Se recomienda filtrar el agua antes de consumir.", "Se recomienda hervir el agua.", "El agua parece segura para el consumo directo.", "Evite el consumo de esta agua."

Sé claro, conciso y utiliza un lenguaje fácil de entender. No incluyas advertencias sobre ser una IA. Solo proporciona el análisis solicitado.
  `;
};

export const analyzeWaterQuality = async (data: WaterQualityData): Promise<string> => {
  const prompt = generatePrompt(data);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error al generar contenido de Gemini:", error);
    throw new Error("La solicitud al servicio de IA falló.");
  }
};
