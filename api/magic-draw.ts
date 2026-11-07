import { GoogleGenAI } from '@google/genai';
import { json, route, assertSameOrigin } from '../server/http.js';

interface MagicDrawRequest {
  imageBase64?: string;
  activeTemplateId?: string;
  childName?: string;
}

export const POST = route(async (req: Request) => {
  assertSameOrigin(req);

  let body: MagicDrawRequest;
  try {
    const text = await req.text();
    body = JSON.parse(text || '{}');
  } catch {
    return json({ error: 'Format JSON invalide.' }, { status: 400 });
  }

  const childName = (body.childName || 'Champion').slice(0, 20);
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !body.imageBase64) {
    // Si pas de clé Gemini ou pas d'image, le client utilise son moteur magique local sans erreur
    return json({
      status: 'offline_ready',
      message: 'Utilisation du moteur magique local instantané.'
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });

    // Nettoyer le préfixe data:image/png;base64,...
    const base64Data = body.imageBase64.replace(/^data:image\/\w+;base64,/, '');

    const prompt = `Tu es un artiste peintre et conteur féerique pour enfants de 3 à 7 ans.
Regarde ce dessin fait par un enfant nommé ${childName}. Même si le dessin est approximatif, simple ou plein de gribouillages d'enfant, trouve avec tendresse ce à quoi il fait penser (un animal fantastique, un véhicule, une fusée, une fleur géante, un château magique, etc.).
Réponds UNIQUEMENT en JSON strict avec les clés suivantes :
{
  "title": "Titre magique court et poétique",
  "detectedSubject": "Sujet reconnu en 2 mots",
  "category": "animaux" ou "espace" ou "magie" ou "vehicules" ou "nature",
  "cheer": "Message audio chaleureux s'adressant directement à ${childName}",
  "magicDescription": "Description féerique de la transformation de son dessin"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Data
          }
        },
        {
          text: prompt
        }
      ],
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return json({
      status: 'success',
      data: parsed
    });
  } catch (err) {
    console.warn('[magic-draw] Erreur IA Gemini, repli local:', err);
    return json({
      status: 'fallback',
      message: 'Repli vers le générateur magique local.'
    });
  }
});
