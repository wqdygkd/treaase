<script lang="ts">
  import '../app.css';
  import { assetUrl, assetPaths } from '$lib/assets';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import { installTestBridge } from '$lib/test-bridge/bootstrap';
  import 'virtual:wdio-plugin';

  const testRuntime = import.meta.env.MODE === 'test';
  const productionRuntime = import.meta.env.PROD || import.meta.env.SIMULATE_PROD;

  if (typeof window !== 'undefined' && (import.meta.env.DEV || testRuntime)) {
    installTestBridge();
  }

  const adsEnabled = productionRuntime && !testRuntime;
</script>

<svelte:head>
  <link rel="icon" type="image/png" href={assetUrl(assetPaths.treeaseLogo)} />
  {#if adsEnabled}
    <script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6579013241267492"
      crossorigin="anonymous"
    ></script>
  {/if}
</svelte:head>

<slot />
<Toaster />
