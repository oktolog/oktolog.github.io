---
title: "rop-finder"
date: 2026-02-01
draft: false
description: "A Rust-based ROP gadget discovery and chain suggestion tool for stripped x86-64 ELF binaries."
tags: ["rust", "exploitation", "rop", "tooling"]
---

# rop-finder

A fast ROP gadget finder written in Rust, targeting stripped x86-64 ELF binaries. Focuses on usability: outputs ready-to-paste pwntools snippets alongside raw addresses.

## Features

- Disassembles all executable sections using the `iced-x86` engine
- Classifies gadgets by type: register control, memory read/write, arithmetic, syscall
- Outputs pwntools-compatible offset definitions
- JSON export for pipeline integration
- Handles multi-`ret` gadgets and gadget deduplication

## Installation

```bash
cargo install rop-finder
# or
git clone https://github.com/oktolog/rop-finder
cd rop-finder
cargo build --release
```

## Usage

```bash
# Find all gadgets up to depth 6
rop-finder --file ./target --depth 6

# Filter by type
rop-finder --file ./target --type reg-control

# Output pwntools snippets
rop-finder --file ./target --format pwntools

# JSON output
rop-finder --file ./target --format json > gadgets.json
```

## Example Output

```
[reg-control] 0x401234: pop rdi; ret
[reg-control] 0x401238: pop rsi; pop r15; ret
[syscall]     0x401567: syscall; ret
[mem-write]   0x40189a: mov qword ptr [rax], rbx; ret

-- pwntools snippet --
POP_RDI  = elf.address + 0x1234
POP_RSI  = elf.address + 0x1238
SYSCALL  = elf.address + 0x1567
MOV_RAX  = elf.address + 0x189a
```

## Status

Early but usable. The classification heuristics miss some gadget patterns — PRs welcome.
