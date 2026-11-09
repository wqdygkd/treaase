import manifest from '../../assets/asset-manifest.json';

export const assetPaths = manifest;

export function assetUrl(path: string): string {
  return `/${path.replace(/^\/+/, '')}`;
}
