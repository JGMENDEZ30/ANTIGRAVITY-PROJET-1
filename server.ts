import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import Stripe from "stripe";

dotenv.config();

// Initialize Gemini client lazily to avoid startup crash if API key is missing.
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("La clave GEMINI_API_KEY no está configurada. Por favor, añádela en Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

let stripeClient: Stripe | null = null;
function getStripeClient(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("La clave STRIPE_SECRET_KEY no está configurada. Por favor, añádela en tu archivo .env.");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // 1. Text Analysis Endpoint (analyzes historical or modern Russian texts)
  app.post("/api/gemini/analyze-text", async (req, res) => {
    try {
      const { text, context } = req.body;
      if (!text) {
        return res.status(400).json({ error: "El texto es obligatorio." });
      }

      // MOCK MODE FOR GEMINI TEXT ANALYSIS
      const key = process.env.GEMINI_API_KEY;
      if (!key || key === "" || key.includes("MY_GEMINI_API_KEY")) {
        console.warn("⚠️ Usando MODO SIMULACIÓN de Gemini para Análisis de Texto.");
        await new Promise((resolve) => setTimeout(resolve, 800));
        return res.json({
          originalText: text,
          meaning: "Análisis simulado en modo de demostración local.",
          era: "Eslavo Oriental / Ruso Medio",
          phoneticBreakdown: "En este modo simulación, analizamos que las sílabas tienden a simplificarse. Los yers antiguos cayeron dando origen a vocales plenas o silencios.",
          grammarEvolution: "El caso genitivo y el número dual cambiaron para convertirse en el plural moderno.",
          vocabularyTrivia: "Este término es una joya histórica del desarrollo lingüístico ruso.",
          equivalentModern: "ruso (pronunciado 'ruso')",
          equivalentOld: "русь (pronunciado 'rus')"
        });
      }

      const ai = getGeminiClient();
      const prompt = `Analiza el siguiente texto o palabra rusa (histórica o moderna): "${text}"
Contexto o período histórico de interés: ${context || "Desarrollo general"}

Por favor, devuelve un análisis filológico en formato JSON estructurado que contenga:
1. "originalText": El texto original analizado.
2. "meaning": Significado en español.
3. "era": Era lingüística a la que pertenece principalmente o cómo se relaciona con ella.
4. "phoneticBreakdown": Explicación detallada de su fonética histórica (por ejemplo, pérdida de vocales yers, pleofonía o polnoglasie, asimilaciones, etc.).
5. "grammarEvolution": Cómo evolucionó su gramática desde el proto-eslavo u otra etapa hasta el ruso moderno (por ejemplo, simplificación de casos, pérdida del número dual, cambios verbales).
6. "vocabularyTrivia": Un dato curioso o trivia fascinante sobre este término.
7. "equivalentModern": Cómo se escribiría o diría en ruso moderno estándar (con pronunciación figurada en español).
8. "equivalentOld": Su equivalente aproximado en ruso antiguo o eslavo eclesiástico (con alfabeto cirílico y pronunciación aproximada).

Responde ESTRICTAMENTE en formato JSON válido. No uses markdown wrapping, no incluyas textos adicionales fuera del JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              originalText: { type: Type.STRING },
              meaning: { type: Type.STRING },
              era: { type: Type.STRING },
              phoneticBreakdown: { type: Type.STRING },
              grammarEvolution: { type: Type.STRING },
              vocabularyTrivia: { type: Type.STRING },
              equivalentModern: { type: Type.STRING },
              equivalentOld: { type: Type.STRING },
            },
            required: [
              "originalText",
              "meaning",
              "era",
              "phoneticBreakdown",
              "grammarEvolution",
              "vocabularyTrivia",
              "equivalentModern",
              "equivalentOld",
            ],
          },
        },
      });

      const resultText = response.text?.trim() || "{}";
      res.json(JSON.parse(resultText));
    } catch (error: any) {
      console.error("Error in /api/gemini/analyze-text:", error);
      res.status(500).json({ error: error.message || "Error al analizar el texto con Gemini." });
    }
  });

  // 2. Chat/Roleplay Endpoint (chat with historical characters)
  app.post("/api/gemini/interactive", async (req, res) => {
    try {
      const { messages, character } = req.body;
      if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "Los mensajes son obligatorios." });
      }

      // MOCK MODE FOR GEMINI CHAT
      const key = process.env.GEMINI_API_KEY;
      if (!key || key === "" || key.includes("MY_GEMINI_API_KEY")) {
        console.warn("⚠️ Usando MODO SIMULACIÓN de Gemini para el Chat.");
        let text = "";
        const userMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";
        
        if (character === "monk") {
          if (userMessage.includes("hola") || userMessage.includes("saludos") || userMessage.includes("buenos")) {
            text = "Pax vobiscum, viajero. Que las bendiciones inunden tu camino. Cuéntame, ¿quieres saber cómo escribíamos los anales históricos en Kiev en el siglo XI?";
          } else if (userMessage.includes("caso") || userMessage.includes("gramatica") || userMessage.includes("escribir")) {
            text = "Ah, la gramática es un reflejo del orden. En mi monasterio usamos el eslavo eclesiástico, que conserva desinencias antiguas muy solemnes que el pueblo ya no usa al hablar.";
          } else {
            text = "Una pregunta muy profunda, hijo mío. En la Rus de Kiev, el idioma es el puente entre el cielo y la tierra. La evolución fonética apenas comienza en este siglo XI. Cuéntame más sobre lo que buscas.";
          }
        } else if (character === "reformer") {
          if (userMessage.includes("hola") || userMessage.includes("saludos") || userMessage.includes("buenos")) {
            text = "¡Hola! Estoy muy ocupado con los planos de la nueva imprenta de San Petersburgo. ¡Dime rápido, qué duda tienes sobre las Letras Civiles!";
          } else {
            text = "¡Excelente punto! Por orden del Zar Pedro I, el alfabeto debe simplificarse. Eliminamos símbolos complicados para imprimir libros de navegación y matemáticas más rápido.";
          }
        } else if (character === "pushkin") {
          text = "¡Sublime! La poesía de nuestra era une la sencillez del habla popular con la elegancia del eslavo sagrado. Si lees mis poemas, notarás que el ruso moderno es ágil, sonoro y libre.";
        } else {
          text = "Como filólogo, te diré que la historia del ruso se divide en tres grandes periodos: el eslavo oriental antiguo (siglos IX-XIV), el ruso medio (siglos XIV-XVII) y el ruso moderno (siglos XVIII en adelante). ¿Hay algún cambio de sonido que te interese?";
        }
        // Simular retardo de red
        await new Promise((resolve) => setTimeout(resolve, 800));
        return res.json({ text });
      }

      const ai = getGeminiClient();
      
      let systemInstruction = "";
      if (character === "monk") {
        systemInstruction = "Eres Nestor el Cronista, un monje erudito de la Kiev del siglo XI (Kievan Rus'). Hablas con sabiduría, reverencia histórica y profunda fe. Explicas a los usuarios cómo era el dialecto del eslavo oriental antiguo y el eslavo eclesiástico en tu monasterio. Responde en español fluido pero con un tono solemne, histórico y reflexivo.";
      } else if (character === "reformer") {
        systemInstruction = "Eres un reformador de la corte de Pedro el Grande en el siglo XVIII. Estás entusiasmado por la modernización, la secularización del alfabeto cirílico (las 'Letras Civiles') y la incorporación de vocabulario europeo (alemán, francés, holandés) al ruso medio. Eres asertivo, pragmático y hablas con orgullo del progreso de la imprenta rusa. Responde en español.";
      } else if (character === "pushkin") {
        systemInstruction = "Eres un gran admirador de Aleksandr Pushkin y un lingüista de la Edad de Oro del siglo XIX. Tu misión es transmitir la belleza poética del ruso estándar moderno, explicando cómo se sintetizaron las raíces populares de los siervos con la elegancia literaria del eslavo eclesiástico. Hablas de forma apasionada, elocuente y poética. Responde en español.";
      } else {
        systemInstruction = "Eres un filólogo experto en la historia y evolución de la lengua rusa. Respondes con rigor académico pero de forma muy accesible, apasionada y didáctica. Explicas etimologías, cambios fonéticos (como el palatalizado) y anécdotas de manera amena. Responde en español.";
      }

      // Prepare contents format for generateContent
      const contents = messages.map((m: any) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.8,
        },
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error in /api/gemini/interactive:", error);
      res.status(500).json({ error: error.message || "Error al procesar el chat con Gemini." });
    }
  });

  // 3. New Topic / Scenario Custom Generation
  app.post("/api/gemini/suggest-topic", async (req, res) => {
    try {
      const { topic } = req.body;
      if (!topic) {
        return res.status(400).json({ error: "El tema o sugerencia es obligatorio." });
      }

      // MOCK MODE FOR SUGGEST TOPIC
      const key = process.env.GEMINI_API_KEY;
      if (!key || key === "" || key.includes("MY_GEMINI_API_KEY")) {
        console.warn("⚠️ Usando MODO SIMULACIÓN de Gemini para sugerir temas.");
        await new Promise((resolve) => setTimeout(resolve, 800));
        return res.json({
          title: `Investigación: ${topic}`,
          era: "Periodo de Transición",
          category: "Ruso Medio",
          description: `Una ficha de estudio dedicada al tema "${topic}", generada por simulación local.`,
          duration: "3 MINUTOS",
          badge: "Simulado",
          insightTitle: "Lección Filológica",
          insightText: "Cada palabra rusa conserva un fósil de su pasado medieval.",
          detailText: `Esta es una simulación de los detalles para "${topic}". Cuando configures tu clave real de Gemini API en la configuración del proyecto, la IA generará un análisis personalizado y preciso en profundidad sobre este tema en tiempo real.`
        });
      }

      const ai = getGeminiClient();
      const prompt = `El usuario ha sugerido un nuevo tema de investigación sobre el desarrollo histórico de la lengua rusa: "${topic}"

Genera una nueva ficha de periodo lingüístico detallada, al estilo del sistema de "Escenarios de Estrés" de MindfulShift pero adaptado a la filología. Devuelve un formato JSON estructurado con:
1. "title": Título elegante de la ficha (ej. "La rebelión de los yers", "Las reformas del zar").
2. "era": Época o período correspondiente (ej. "Siglo XI", "Ruso Medio", etc.).
3. "category": Categoría correspondiente (debes elegir una entre: "Proto-Eslavo", "Eslavo Oriental", "Eslavo Eclesiástico", "Ruso Medio", "Dialecto de Moscú", "Ruso Moderno").
4. "description": Breve resumen descriptivo y cautivador del hito histórico-lingüístico.
5. "duration": Un tiempo estimado de lectura simulación (ej. "3 minutos").
6. "badge": Una etiqueta corta (ej. "Hito", "Reforma", "Fonética").
7. "insightTitle": "Perspectiva Lingüística" o similar.
8. "insightText": Una frase célebre, explicación filológica o cita que resuma el impacto de este tema en la lengua moderna.
9. "detailText": Explicación ampliada paso a paso de lo que ocurrió.

Responde ESTRICTAMENTE en formato JSON válido. No uses markdown wrapping, no incluyas textos adicionales fuera del JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              era: { type: Type.STRING },
              category: { type: Type.STRING },
              description: { type: Type.STRING },
              duration: { type: Type.STRING },
              badge: { type: Type.STRING },
              insightTitle: { type: Type.STRING },
              insightText: { type: Type.STRING },
              detailText: { type: Type.STRING },
            },
            required: [
              "title",
              "era",
              "category",
              "description",
              "duration",
              "badge",
              "insightTitle",
              "insightText",
              "detailText",
            ],
          },
        },
      });

      const resultText = response.text?.trim() || "{}";
      res.json(JSON.parse(resultText));
    } catch (error: any) {
      console.error("Error in /api/gemini/suggest-topic:", error);
      res.status(500).json({ error: error.message || "Error al generar la sugerencia filológica." });
    }
  });

  // Stripe Checkout Session Endpoint
  app.post("/api/stripe/create-checkout-session", async (req, res) => {
    try {
      const { planType } = req.body;
      if (!planType || (planType !== "pro" && planType !== "lifetime")) {
        return res.status(400).json({ error: "Tipo de plan inválido o faltante." });
      }

      // MOCK MODE: Si no tienes clave real de Stripe, simulamos el pago directamente para probar
      const secretKey = process.env.STRIPE_SECRET_KEY;
      if (!secretKey || secretKey.includes("reemplazar") || secretKey === "") {
        console.warn("⚠️ Usando MODO SIMULACIÓN de Stripe para desarrollo local.");
        const mockUrl = `${req.headers.origin || "http://localhost:3000"}/?payment_success=true&plan=${planType}`;
        // Simular retraso de carga para mejor experiencia de usuario
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return res.json({ url: mockUrl });
      }

      const stripe = getStripeClient();

      // Configure item based on plan type
      let lineItems: any[] = [];
      let mode: "subscription" | "payment" = "payment";

      if (planType === "pro") {
        mode = "subscription";
        lineItems = [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Plan Zar (Mensual Pro)",
                description: "Acceso completo mensual a todas las eras y explicaciones ilimitadas con Gemini.",
              },
              unit_amount: 499, // $4.99 in cents
              recurring: {
                interval: "month",
              },
            },
            quantity: 1,
          },
        ];
      } else if (planType === "lifetime") {
        mode = "payment";
        lineItems = [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Plan Dinastía (Acceso de por vida)",
                description: "Acceso ilimitado para siempre a la historia del ruso y una insignia especial.",
              },
              unit_amount: 1999, // $19.99 in cents
            },
            quantity: 1,
          },
        ];
      }

      // Create session
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: mode,
        success_url: `${req.headers.origin || "http://localhost:3000"}/?payment_success=true&plan=${planType}`,
        cancel_url: `${req.headers.origin || "http://localhost:3000"}/?payment_cancel=true`,
      });

      res.json({ url: session.url });
    } catch (error: any) {
      console.error("Error in /api/stripe/create-checkout-session:", error);
      res.status(500).json({ error: error.message || "Error al crear la sesión de Stripe." });
    }
  });

  // Vite / Static files setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
