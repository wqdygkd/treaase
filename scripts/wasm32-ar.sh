#!/usr/bin/env bash
# Cross-platform archiver for wasm32 objects built by cc-rs.
#
# macOS system `ar`/`ranlib` index WASM objects as mach-o and leave archives
# with only `__.SYMDEF`, so rust-lld cannot pull in tree-sitter symbols and
# they surface as unresolved `env` imports in the final .wasm.
set -eu

if command -v llvm-ar >/dev/null 2>&1; then
    exec llvm-ar "$@"
fi

host="$(rustc -vV 2>/dev/null | sed -n 's/^host: //p' || true)"
if [ -n "${host}" ]; then
    rust_llvm_ar="$(rustc --print sysroot 2>/dev/null)/lib/rustlib/${host}/bin/llvm-ar"
    if [ -x "${rust_llvm_ar}" ]; then
        exec "${rust_llvm_ar}" "$@"
    fi
fi

if [ -x /opt/homebrew/opt/llvm/bin/llvm-ar ]; then
    exec /opt/homebrew/opt/llvm/bin/llvm-ar "$@"
fi

if command -v zig >/dev/null 2>&1; then
    exec zig ar "$@"
fi

echo "llvm-ar/zig ar not found; install rustup component llvm-tools or zig" >&2
exit 1
