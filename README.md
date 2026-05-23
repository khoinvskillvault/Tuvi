# Tử Vi Đẩu Số AI Hybrid System

Hệ thống tử vi kết hợp thuật toán truyền thống và AI Claude.

## Tech Stack

- **Lunar Converter**: Jean Meeus algorithm, GMT+7 Việt Nam
- **Ziwei Algorithm**: iztro wrapper với lunar-vn
- **AI**: Claude API (55%+ accuracy trên MingLi-Bench)
- **Tests**: 290+ test cases, 95%+ coverage

## Quick Start

```bash
npm install
npm test
```

## API

```bash
POST /api/chart/generate
{
  "year": 1991, "month": 10, "day": 24,
  "hour": 8, "gender": "male", "timeZone": 7
}
```

## Accuracy

| System | Accuracy |
|--------|----------|
| Hybrid (iztro + lunar-vn) | 96%+ |
| Claude AI | 55%+ |

## Project Structure

```
lib/
  lunar/    lunar-vn.ts         # Lunar converter
  ziwei/    algorithm-vn.ts     # Chart generator
            normalize-vn.ts     # Vietnamese output
            constants-vn.ts     # Lookup tables
  api/      chart-generate.ts   # REST API
tests/
  unit/                         # Unit tests
  integration/                  # Integration tests
  bench/                        # Benchmarks
docs/                           # Documentation
```
