import { ParameterObject, SchemaObject } from 'openapi3-ts';
import CompiledSchema from './CompiledSchema';
import ChowError from '../error';

export default class CompiledParameterCookie {
  private compiledSchema: CompiledSchema;
  private cookieSchema: SchemaObject = {
    type: 'object',
    properties: {},
    required: []
  };

  constructor(parameters: ParameterObject[]) {
    for (const parameter of parameters) {
      this.cookieSchema.properties![parameter.name] = parameter.schema || {};
      if (parameter.required) {
        this.cookieSchema.required!.push(parameter.name);
      }
    }

    this.compiledSchema = new CompiledSchema(this.cookieSchema);
  }

  /**
   * If there is no query passed in, we make it an empty object
   */
  public validate(value: any = {}) {
    try {
      this.compiledSchema.validate(value);
    } catch(e) {
      throw new ChowError('Schema validation error', { in: 'cookie', rawErrors: e });
    }
  }
}
