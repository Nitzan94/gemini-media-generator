import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import mime from 'mime';

export async function POST(request: NextRequest) {
  try {
    const { prompt, imageData, apiKey } = await request.json();
    
    // Validate required fields
    if (!prompt || !apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: prompt and apiKey are required' 
        }, 
        { status: 400 }
      );
    }

    // Initialize Gemini AI with user's API key (NEW SDK)
    const ai = new GoogleGenAI({
      apiKey: apiKey
    });

    // Configuration for image generation
    const config = {
      responseModalities: ['IMAGE', 'TEXT'] as const,
    };

    const model = 'gemini-2.5-flash-image-preview';
    
    try {
      // Support for both text-only and image+text input
      const contents = [{
        role: 'user' as const,
        parts: imageData ? [
          {
            text: prompt,
          },
          {
            inlineData: {
              mimeType: imageData.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+)/)?.[1] || 'image/jpeg',
              data: imageData.replace(/^data:image\/[a-z]+;base64,/, '')
            }
          }
        ] : [
          {
            text: prompt,
          }
        ],
      }];

      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let generatedImage = null;
      let generatedText = '';

      for await (const chunk of response) {
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const inlineData = chunk.candidates[0].content.parts[0].inlineData;
          generatedImage = {
            data: inlineData.data,
            mimeType: inlineData.mimeType
          };
        } else if (chunk.text) {
          generatedText += chunk.text;
        }
      }

      // Return the generated content
      return NextResponse.json({
        success: true,
        image: generatedImage,
        text: generatedText,
        originalPrompt: prompt,
        message: generatedImage ? 'Image generated successfully!' : 'Content generated successfully!',
        timestamp: new Date().toISOString()
      });

    } catch (apiError: any) {
      console.error('Gemini API Error:', apiError);
      
      // Handle specific API errors
      if (apiError.message?.includes('API_KEY_INVALID')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid API key. Please check your Gemini API key and try again.',
            code: 'INVALID_API_KEY'
          }, 
          { status: 401 }
        );
      }
      
      if (apiError.message?.includes('QUOTA_EXCEEDED')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'API quota exceeded. Please check your Gemini API usage limits.',
            code: 'QUOTA_EXCEEDED'
          }, 
          { status: 429 }
        );
      }
      
      if (apiError.message?.includes('RATE_LIMIT_EXCEEDED')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Rate limit exceeded. Please wait a moment and try again.',
            code: 'RATE_LIMIT_EXCEEDED'
          }, 
          { status: 429 }
        );
      }

      // Generic API error
      return NextResponse.json(
        { 
          success: false, 
          error: `Gemini API Error: ${apiError.message || 'Unknown error occurred'}`,
          code: 'GEMINI_API_ERROR'
        }, 
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Server Error:', error);
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid request format. Please check your request data.',
          code: 'INVALID_JSON'
        }, 
        { status: 400 }
      );
    }

    // Generic server error
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error. Please try again later.',
        code: 'INTERNAL_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      }, 
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      success: false, 
      error: 'Method not allowed. Use POST to generate images.',
      code: 'METHOD_NOT_ALLOWED'
    }, 
    { status: 405 }
  );
}