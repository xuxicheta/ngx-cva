import { appendToObject } from './append-to-object';

describe('appendToObject', () => {
  it('should throw when null', () => {
    expect(() => appendToObject(null, 'key', 'value')).toThrow();
  });

  it('should add field when object', () => {
    expect(appendToObject({} as any, 'key', 'value')).toEqual({ key: 'value'});
  });

  it('should replace field when object', () => {
    expect(appendToObject({ key: 'dfsf'} , 'key', 'value')).toEqual({ key: 'value'});
  });
});
