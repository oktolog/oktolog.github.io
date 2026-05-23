---
title: "Linux Process Memory Layout"
date: 2026-03-10
lastmod: 2026-05-18
draft: false
description: "Quick reference for x86-64 Linux virtual memory layout."
tags: ["linux", "memory", "reference"]
status: "evergreen"
toc: false
math: false
---

Reference card for the virtual address space of an x86-64 Linux process.

## Layout (low → high)

```
0x0000000000000000  ← NULL / unmapped guard
0x0000000000400000  ← text segment (.text, .rodata) — typical
0x0000000000600000  ← data segment (.data, .bss)
                      heap grows ↓ via brk()/mmap()
                    ← stack grows ↑ from high addresses
0x00007fffffff0000  ← stack (grows toward lower addresses)
0x00007ffff7800000  ← libc / shared libraries (ASLR randomized)
0xffff800000000000  ← kernel space (not accessible from userland)
```

## Key segments

| Segment | Permissions | Notes |
|---------|-------------|-------|
| `.text` | r-x | executable code |
| `.rodata` | r-- | string literals, constants |
| `.data` | rw- | initialized globals |
| `.bss` | rw- | zero-initialized globals |
| heap | rw- | `malloc()` arena |
| stack | rw- | function frames, grows down |
| `[vdso]` | r-x | kernel syscall trampoline |
| `[vsyscall]` | r-x | legacy fast syscall page |

## Reading a live map

```bash
# View memory map of running process
cat /proc/<pid>/maps

# Or with a friendlier display
pmap -x <pid>
```

## ASLR randomized regions

- Stack base
- Library load addresses (`.so` files)
- Heap base (when `mmap()` is used)
- **Not randomized** when PIE is disabled: `.text`, `.data`, `.bss`

> [!tip]
> Disable ASLR for local debugging: `echo 0 | sudo tee /proc/sys/kernel/randomize_va_space`

## Status

Last verified against Linux 6.8 / glibc 2.39.
