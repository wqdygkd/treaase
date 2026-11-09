<script lang="ts">
  import { Menu, RefreshCw, Settings } from 'lucide-svelte';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from './ui/dropdown-menu';

  export let onCheckForUpdates: () => Promise<void> = async () => {};
  export let onOpenSettings: () => void = () => {};

  const desktop = import.meta.env.PUBLIC_WORKSPACE_SURFACE === 'desktop';
</script>

<div class="editor-menu-anchor">
  <DropdownMenu>
    <DropdownMenuTrigger
      class="relative inline-grid h-6 w-6 cursor-pointer place-items-center rounded-full border-0 bg-transparent text-[var(--text-primary)] outline-none transition-[background-color,box-shadow] duration-150 hover:bg-[var(--panel-bg-alt)] data-[state=open]:bg-[var(--panel-bg-alt)] focus-visible:ring-2 focus-visible:ring-blue-600/30"
      aria-label="Application menu"
      title="Menu"
      data-testid="app-menu-button"
    >
      <Menu size={12} />
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" sideOffset={8} class="w-[200px] rounded-[10px] p-2 shadow-[0_14px_38px_rgba(15,23,42,0.16)]">
      {#if desktop}
        <DropdownMenuItem class="rounded-[7px] text-[13px]" data-testid="app-check-updates-menu-item" onSelect={() => void onCheckForUpdates()}>
          <RefreshCw size={14} />Check for updates
        </DropdownMenuItem>
      {/if}
      <DropdownMenuItem class="rounded-[7px] text-[13px]" data-testid="app-settings-menu-item" onSelect={onOpenSettings}>
        <Settings size={14} />Settings
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>

<style>
  .editor-menu-anchor {
    position: relative;
    display: inline-flex;
    width: 24px;
    height: 24px;
    flex: 0 0 24px;
    align-items: center;
    justify-content: center;
    overflow: visible;
  }
</style>
