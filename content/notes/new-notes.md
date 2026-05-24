---
title: "Whhat is this site about"
date: 2026-05-24
lastmod: 2026-05-24
draft: false
description: "Scattered notes on DNS internals and tooling."
tags: ["networking", "dns", "protocols"]
status: "seedling"
toc: false
math: false
---

Rough notes. Still filling this in.

## Record types I always forget

- `A` — IPv4 address
- `AAAA` — IPv6 address
- `CNAME` — alias to another name (can't coexist with other records at same name)
- `MX` — mail exchange (has priority field)
- `TXT` — arbitrary text (used for SPF, DKIM, domain verification)
- `NS` — nameserver delegation
- `PTR` — reverse DNS (IP → name, lives in `.arpa`)
- `SOA` — start of authority, one per zone

## Useful dig invocations

```bash
# Query specific record type
dig A example.com
dig MX example.com @8.8.8.8

# Short output
dig +short A example.com

# Trace from root
dig +trace example.com

# Reverse lookup
dig -x 93.184.216.34

# Check zone transfer (usually blocked)
dig AXFR example.com @ns1.example.com
```

## Things to investigate later

- [ ] DNSSEC validation chain
- [ ] DNS-over-HTTPS vs DNS-over-TLS tradeoffs
- [ ] Split-horizon DNS setups
- [ ] DNS rebinding attack mechanics
