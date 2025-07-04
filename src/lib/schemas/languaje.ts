// language.schema.ts
export const LanguageSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      code: { type: 'string', example: 'es' },
      name: { type: 'string', example: 'Spanish' }
    }
  };
