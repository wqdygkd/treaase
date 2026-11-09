import { describe, expect, it } from 'vitest';
import { createWorkspaceHost, parseEditorDeepLinks } from './index';

describe('workspace host boundary', () => {
  it('exposes file lifecycle operations only through the desktop host', async () => {
    const host = await createWorkspaceHost('desktop');
    expect(host.surface).toBe('desktop');
    expect(host.openFile).toBeTypeOf('function');
    expect(host.saveFile).toBeTypeOf('function');
    expect(host.watchFile).toBeTypeOf('function');
    expect(host.saveSession).toBeTypeOf('function');
    expect(host.takeStartupFiles).toBeTypeOf('function');
    expect(host.onCommand).toBeTypeOf('function');
    expect(host.getInitialDeepLinks).toBeTypeOf('function');
  });

  it('accepts only editor deep links', () => {
    expect(parseEditorDeepLinks([
      'treease://editor?lang=json',
      'treease://auth/callback?code=one-time-code',
      'treease://auth/other',
      'treease://settings',
      'https://treease.com/editor',
    ])).toEqual([
      new URL('treease://editor?lang=json'),
    ]);
  });
});
