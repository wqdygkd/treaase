#!/usr/bin/env bash
# ranlib for wasm32 archives built by cc-rs.
#
# Host ranlib rejects WASM objects ("not a mach-o file") and can leave an
# unusable macOS symbol index; keep the archive in LLVM/zig form instead.
set -eu

if command -v llvm-ranlib >/dev/null 2>&1; then
    exec llvm-ranlib "$@"
fi

host="$(rustc -vV 2>/dev/null | sed -n 's/^host: //p' || true)"
if [ -n "${host}" ]; then
    rust_llvm_ranlib="$(rustc --print sysroot 2>/dev/null)/lib/rustlib/${host}/bin/llvm-ranlib"
    if [ -x "${rust_llvm_ranlib}" ]; then
        exec "${rust_llvm_ranlib}" "$@"
    fi
fi

if [ -x /opt/homebrew/opt/llvm/bin/llvm-ranlib ]; then
    exec /opt/homebrew/opt/llvm/bin/llvm-ranlib "$@"
fi

if command -v zig >/dev/null 2>&1; then
    exec zig ranlib "$@"
fi

echo "llvm-ranlib/zig ranlib not found; install rustup component llvm-tools or zig" >&2
exit 1
