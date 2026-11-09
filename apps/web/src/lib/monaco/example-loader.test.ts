import { describe, expect, it } from 'vitest';
import { examplesByLanguage } from './example-loader';
import { exampleLanguageByExtension } from './language-support';

const exampleFiles = import.meta.glob('../../../../../example/*', {
  query: '?raw',
  import: 'default',
  eager: true,
});

describe('example-loader', () => {
  const entries = Object.entries(exampleFiles).sort(([a], [b]) => a.localeCompare(b));

  for (const [path, content] of entries) {
    const fileName = path.split('/').pop() ?? '';
    if (!fileName.startsWith('simple.')) continue;
    if (fileName.startsWith('simple.overrides.')) continue;
    const extension = fileName.split('.').pop();
    if (!extension) continue;
    const expected = exampleLanguageByExtension.get(extension);
    if (!expected) continue;

    it(`loads ${expected} example from ${fileName}`, () => {
      const canonical = String(content ?? '').replace(/\r\n?/g, '\n');
      expect(examplesByLanguage.get(expected)).toBe(canonical);
      expect(examplesByLanguage.get(expected)).not.toContain('\r');
    });
  }
});
