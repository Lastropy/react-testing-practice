import '@testing-library/jest-dom/vitest'
import ResizeObserver from 'resize-observer-polyfill';
import {server} from './mocks/server';

// Starting our mock API server before all unit tests in a test suite
beforeAll(() => server.listen());
// Reset each handler before each test
afterEach(() => server.resetHandlers());
// Close the server after all tests in a test suite
afterAll(() => server.close());

global.ResizeObserver = ResizeObserver;

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.hasPointerCapture = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });