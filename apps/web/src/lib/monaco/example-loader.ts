import { findExampleLanguageByExtension, type SupportedEditorLanguageId } from './language-support';

type ExampleLoadResult = ReadonlyMap<SupportedEditorLanguageId, string>;

const exampleFiles = import.meta.glob('../../../../../example/*', {
  query: '?raw',
  import: 'default',
  eager: true,
});

function comparePaths(a: [string, string], b: [string, string]): number {
  return a[0].localeCompare(b[0]);
}

function buildExamplesMap(): ExampleLoadResult {
  const examples = new Map<SupportedEditorLanguageId, string>();

  const entries = Object.entries(exampleFiles).sort(comparePaths);
  for (const [path, content] of entries) {
    const fileName = path.split('/').pop() ?? '';
    if (!fileName.startsWith('simple.')) continue;
    if (fileName.startsWith('simple.overrides.')) continue;
    const extension = fileName.split('.').pop();
    if (!extension) continue;
    const languageId = findExampleLanguageByExtension(extension);
    if (!languageId) continue;
    if (examples.has(languageId)) continue;
    if (typeof content !== 'string') continue;
    // Git autocrlf makes raw examples CRLF on Windows; Core's canonical source text is LF.
    examples.set(languageId, content.replace(/\r\n?/g, '\n'));
  }

  return examples;
}

export const examplesByLanguage = buildExamplesMap();
