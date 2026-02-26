import { GoogleGenAI } from '@google/genai';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === 'your_api_key_here') {
    console.error('ERROR: GEMINI_API_KEY is not set correctly in the .env file.');
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const prompts = [
    {
        name: 'mich_logo_wordmark',
        prompt: "A premium, elegant serif wordmark logo for the brand 'MICH'. The font is inspired by 'Cinzel' or classical Roman inscriptions, with refined letterforms and generous spacing. An ornate, delicate olive branch ornament is positioned below the name. The color scheme is deep olive green (#1B3A2D) and gold (#C9A84C) accents on a warm cream (#F5EDE0) background. Mediterranean luxury aesthetic, artisanal, and sophisticated. Designed with golden ratio principles. High resolution, white or cream background, vector style."
    },
    {
        name: 'mich_logo_seal',
        prompt: "A circular heritage seal emblem for 'MICH', a premium Lebanese dairy brand. The word 'MICH' is prominently placed in the center in an elegant serif font. The words 'JOCOQUE & YOGURT' arc gracefully around the central name in smaller uppercase lettering. The outer ring features a subtle pattern inspired by Mediterranean tiles. The color palette features terracotta (#C4763C), gold (#C9A84C), and deep olive green (#1B3A2D) on a cream (#F5EDE0) background. Luxurious, historical, and artisanal aesthetic. Golden ratio balanced design. Product branding style."
    },
    {
        name: 'mich_logo_arch',
        prompt: "A premium logo for 'MICH', a Lebanese dairy brand. The design features a stylized pointed Lebanese arch (oriental arch) framing the wordmark 'MICH' in an elegant, clean serif typeface. The aesthetic is Mediterranean luxury and minimalist. The color palette is deep olive green (#1B3A2D) and gold (#C9A84C) accents on a cream (#F5EDE0) base. Proportions follow the golden ratio for a balanced and harmonious look. Sophisticated, architectural, and artisanal. Flat design, clean lines."
    },
    {
        name: 'mich_logo_monogram',
        prompt: "A stylized 'M' monogram logo for the brand 'MICH'. The 'M' is intricately designed with subtle olive branch elements and leaves integrated into the letterform strokes. This design is intended for use on jar lids and wax seals. The color palette is a rich combination of gold (#C9A84C) and deep olive green (#1B3A2D) on a terracotta (#C4763C) background. Mediterranean luxury aesthetic, artisanal, premium, and sophisticated. Designed with golden ratio principles. Symmetrical and balanced."
    }
];

async function generateImages() {
    console.log('Generating images using Google AI Studio...');

    for (const item of prompts) {
        console.log(`\nGenerating: ${item.name}...`);
        try {
            const response = await ai.models.generateImages({
                model: 'imagen-4.0-generate-001',
                prompt: item.prompt,
                config: {
                    numberOfImages: 1,
                    outputMimeType: 'image/jpeg',
                    aspectRatio: '1:1'
                }
            });

            const base64Image = response.generatedImages[0].image.imageBytes;
            const buffer = Buffer.from(base64Image, 'base64');
            const outputPath = path.join(__dirname, '..', `${item.name}.jpg`);

            fs.writeFileSync(outputPath, buffer);
            console.log(`✅ Saved ${item.name}.jpg to brand-design/`);

        } catch (error) {
            console.error(`❌ Failed to generate ${item.name}:`, error.message);
        }
    }
    console.log('\nAll done!');
}

generateImages();
