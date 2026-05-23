---
title: My First Linux Note
date: 2026-05-23T09:00:01+00:00
lastmod: 2026-05-23T09:00:01+00:00
draft: false
description: ""
tags:
  - linux
  - networking
  - hacking
status: growing
toc: true
math: true
series: linux-learning-101
---

<!-- status options: seedling | growing | evergreen -->

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