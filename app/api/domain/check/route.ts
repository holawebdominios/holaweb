import { NextRequest, NextResponse } from 'next/server';
import { domainSearchSchema } from '@/lib/validations';
import { checkDomain, generateSuggestions } from '@/lib/domain-api';
import { DomainInfo } from '@/types/domain';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar request
    const validated = domainSearchSchema.parse(body);
    
    // TODO: Implementar rate limiting
    
    // Verificar cada dominio con cada TLD
    const startTime = Date.now();
    const results: DomainInfo[] = [];
    
    for (const domain of validated.domains) {
      for (const tld of validated.tlds) {
        const result = await checkDomain(domain, tld as any);
        results.push(result);
      }
    }
    
    // Generar sugerencias si se solicita
    const suggestions = validated.includeAlternatives
      ? generateSuggestions(validated.domains[0])
      : [];
    
    const searchTime = Date.now() - startTime;
    
    return NextResponse.json({
      success: true,
      results,
      suggestions,
      searchTime,
      cached: false
    });
    
  } catch (error) {
    console.error('Error en verificación de dominio:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al verificar dominio',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 400 }
    );
  }
}

