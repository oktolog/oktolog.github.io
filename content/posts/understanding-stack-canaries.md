---
title: "Understanding Stack Canaries"
date: 2026-05-15
lastmod: 2026-05-20
draft: false
description: "A practical look at stack canaries — what they are, how they work, and the techniques attackers use to bypass them."
tags: ["security", "exploitation", "linux", "memory-safety"]
series: "binary-exploitation-101"
toc: true
math: false
mermaid: false
---

Stack canaries are one of the oldest and most widely deployed exploit mitigations in modern systems. Despite their age, they remain effective against naive stack smashing attacks. This post covers how they work and how they can be defeated.

## Overview

A stack canary is a random value placed on the stack between local variables and the saved return address. Before a function returns, the runtime checks whether the canary value has been modified. If it has, the program terminates immediately.

The name comes from the "canary in a coal mine" — a sentinel that warns of danger.

## How Canaries Are Implemented

On Linux, glibc implements stack canaries via the `__stack_chk_fail` mechanism. The canary value is stored in `fs:0x28` (on x86-64) and written to the stack on function entry:

```asm
; Function prologue
mov    rax, QWORD PTR fs:0x28
mov    QWORD PTR [rbp-0x8], rax
xor    eax, eax
```

Before returning:

```asm
; Function epilogue
mov    rdx, QWORD PTR [rbp-0x8]
xor    rdx, QWORD PTR fs:0x28
je     <clean>
call   __stack_chk_fail@plt
```

## Three Ways to Bypass Them

### 1. Leak the Canary

The most common technique. If there is a format string vulnerability or an info leak primitive, read the canary from memory before overwriting it.

```python
# Example: format string leak on 64-bit
# Canary is typically at a predictable stack offset
payload = b"%15$p"   # adjust index via trial and error
```

### 2. Brute Force (fork servers only)

In forked services, child processes inherit the parent's canary. Each byte can be brute-forced independently:

| Byte | Attempts |
|------|----------|
| 1    | 256      |
| 2    | 256      |
| ...  | ...      |
| 8    | 256      |

**Total: 2048 attempts** instead of $256^8$.

### 3. Overwrite a Different Target

If there is a pointer dereference or GOT overwrite primitive, the canary is irrelevant — you can corrupt arbitrary memory without touching the stack cookie.

## Checking Canary Status

```bash
# Check if a binary has stack canaries
checksec --file=./target

# Output:
# CANARY    : ENABLED
# NX        : ENABLED
# PIE       : ENABLED
# RELRO     : FULL
```

{{< callout type="tip" >}}
Always run `checksec` before starting any binary exploitation challenge. It tells you which mitigations are active and guides your exploitation strategy.
{{< /callout >}}

{{< callout type="warning" >}}
Brute-forcing canaries only works when the server forks. Threaded servers or re-exec-on-connect servers will have a different canary each time.
{{< /callout >}}

## Conclusion

Stack canaries are a speed bump, not a wall. Their effectiveness depends entirely on whether the canary value can be leaked. Pair them with ASLR and PIE for meaningfully stronger mitigations.

## References

- Phrack 49, "Smashing the Stack for Fun and Profit" — Aleph One
- `man 7 feature_test_macros` — Linux security feature overview
- glibc source: `sysdeps/x86_64/stackguard-macros.h`
