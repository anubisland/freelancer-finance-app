import { ping } from './fixtures/ping';

describe('CI smoke', () => {
  it('imports a trivial module and asserts true', () => {
    expect(ping()).toBe(true);
  });
});
