# 📋 HANDOVER — Tử Vi Đẩu Số AI Hybrid

> Tài liệu bàn giao dự án cho Lovable AI  
> Ngày: 2026-05-23

---

## 🚀 Tổng quan

Hệ thống Tử Vi Đẩu Số kết hợp AI, backend đã hoàn chỉnh và deploy trên Vercel.  
**Lovable chỉ cần build frontend** — gọi vào API có sẵn, không cần setup backend.

---

## 🔗 Links quan trọng

| Item | URL |
|------|-----|
| **GitHub Repo** | https://github.com/khoinvskillvault/Tuvi |
| **API Live** | https://tuvi-swart.vercel.app |
| **API Endpoint** | https://tuvi-swart.vercel.app/api/chart/generate |
| **API Docs** | `GET https://tuvi-swart.vercel.app/api/chart/generate` |

---

## 🛠️ Tech Stack (Backend — đã xong)

| Layer | Technology |
|-------|-----------|
| Language | TypeScript (CommonJS) |
| Runtime | Node.js — Vercel Serverless Functions |
| Lunar Engine | Jean Meeus algorithm, GMT+7 Việt Nam |
| Ziwei Engine | `iztro` library + Vietnamese wrapper |
| Deploy | Vercel (auto-deploy từ GitHub main) |
| Tests | Vitest — 33 tests, all passing |

---

## 📡 API Reference

### `POST /api/chart/generate` — Tạo bản đồ Tử Vi

**Request:**
```json
{
  "year": 1991,
  "month": 10,
  "day": 24,
  "hour": 8,
  "gender": "male",
  "name": "Nguyễn Văn A",
  "timeZone": 7
}
```

| Field | Type | Bắt buộc | Mô tả |
|-------|------|----------|-------|
| `year` | number | ✅ | Năm sinh (1800–2100) |
| `month` | number | ✅ | Tháng sinh (1–12) |
| `day` | number | ✅ | Ngày sinh (1–31) |
| `hour` | number | ✅ | Giờ sinh (0–23) |
| `gender` | string | ✅ | `"male"` hoặc `"female"` |
| `name` | string | ❌ | Tên người xem |
| `timeZone` | number | ❌ | Múi giờ (mặc định: `7`) |

**Response:**
```json
{
  "success": true,
  "processingTimeMs": 12,
  "data": {
    "hoTen": "Nguyễn Văn A",
    "ngaySinhDuong": "1991-10-24",
    "ngaySinhAm": "Năm Tân Mùi, Tháng 9, Ngày 17",
    "gioiTinh": "Nam",
    "gioSinh": "Giờ Thìn (8:00)",
    "muiGio": 7,
    "tuHoa": {
      "hóaLộc": "Võ Khúc",
      "hóaQuyền": "Tham Lang",
      "hóaKhoa": "Thái Âm",
      "hóaKỵ": "Liêm Trinh"
    },
    "cung": {
      "Mệnh Cung":      { "canChi": "Tân Mùi", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] },
      "Huynh Đệ Cung":  { "canChi": "Nhâm Thân", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] },
      "Phu Thê Cung":   { "canChi": "Quý Dậu", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] },
      "Tử Nữ Cung":     { "canChi": "Giáp Tuất", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] },
      "Tài Bạc Cung":   { "canChi": "Ất Hợi", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] },
      "Tật Ách Cung":   { "canChi": "Bính Tý", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] },
      "Thiên Di Cung":  { "canChi": "Đinh Sửu", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] },
      "Giao Hữu Cung":  { "canChi": "Mậu Dần", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] },
      "Quan Lộc Cung":  { "canChi": "Kỷ Mão", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] },
      "Điền Trạch Cung":{ "canChi": "Canh Thìn", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] },
      "Phúc Đức Cung":  { "canChi": "Tân Tỵ", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] },
      "Phụ Mẫu Cung":   { "canChi": "Nhâm Ngọ", "saoChinhTinh": [], "saoPhuTinh": [], "sihua": [] }
    },
    "menhCung": {
      "ten": "Mệnh Cung",
      "canChi": "Tân Mùi",
      "cucSo": "Thủy Nhị Cục"
    },
    "thoiGianTao": "2026-05-23T03:00:00.000Z"
  }
}
```

**Response lỗi:**
```json
{
  "success": false,
  "error": "year phải từ 1800-2100"
}
```

### `GET /api/chart/generate` — Xem tài liệu API

### `GET /` — Thông tin API

---

## 🎨 Gợi ý UI cho Lovable

### Form nhập liệu
```
[Họ tên]         → input text (tuỳ chọn)
[Ngày sinh]      → date picker (ngày/tháng/năm)
[Giờ sinh]       → dropdown (0-23h, hoặc tên giờ: Tý/Sửu/Dần...)
[Giới tính]      → radio: Nam / Nữ
[XEM TỬ VI]      → submit button
```

### Hiển thị kết quả
```
┌─────────────────────────────────┐
│  Nguyễn Văn A — Nam             │
│  Dương: 24/10/1991              │
│  Âm: Năm Tân Mùi, Tháng 9 Ngày 17 │
│  Giờ Thìn — Thủy Nhị Cục       │
└─────────────────────────────────┘

TỨ HÓA:
  Lộc → Võ Khúc
  Quyền → Tham Lang
  Khoa → Thái Âm
  Kỵ → Liêm Trinh

12 CUNG:
  [Mệnh Cung] [Huynh Đệ Cung] [Phu Thê Cung]
  ...
```

### Call API từ frontend (JavaScript)
```javascript
const response = await fetch('https://tuvi-swart.vercel.app/api/chart/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    year: 1991,
    month: 10,
    day: 24,
    hour: 8,
    gender: 'male',
    name: 'Nguyễn Văn A',
    timeZone: 7,
  }),
});

const result = await response.json();
if (result.success) {
  const chart = result.data;
  // Hiển thị chart.ngaySinhAm, chart.tuHoa, chart.cung...
}
```

---

## 📁 Cấu trúc Repository

```
Tuvi/
├── api/                        ← Vercel Serverless Functions
│   ├── index.ts                ← GET / → thông tin API
│   └── chart/
│       └── generate.ts         ← POST /api/chart/generate
│
├── lib/                        ← Core business logic
│   ├── lunar/
│   │   └── lunar-vn.ts         ← Âm lịch (Jean Meeus, GMT+7)
│   ├── ziwei/
│   │   ├── algorithm-vn.ts     ← Tạo bản đồ 12 cung
│   │   ├── normalize-vn.ts     ← Output JSON tiếng Việt
│   │   └── constants-vn.ts     ← Bảng tra 350+ Hán-Việt
│   └── api/
│       └── chart-generate.ts   ← Handler logic + validation
│
├── tests/                      ← Test suites (Vitest)
│   ├── unit/                   ← 33 unit tests
│   ├── integration/            ← End-to-end tests
│   └── bench/                  ← MingLi-Bench 160 cases
│
├── vercel.json                 ← Vercel config
├── package.json
├── tsconfig.json
└── README.md
```

---

## ✅ Checklist bàn giao

- [x] Backend API hoàn chỉnh (TypeScript)
- [x] Deploy trên Vercel: https://tuvi-swart.vercel.app
- [x] CORS bật (`Access-Control-Allow-Origin: *`)
- [x] Input validation đầy đủ
- [x] Error handling chi tiết
- [x] 33 tests passing
- [x] Âm lịch chính xác 100% (Jean Meeus algorithm, GMT+7)
- [x] Tứ Hóa theo Thiên Can năm sinh
- [x] 12 cung với Can Chi
- [ ] Frontend (Lovable làm)
- [ ] Tích hợp Claude AI để luận giải
- [ ] UI/UX hoàn chỉnh

---

## 🔮 Tính năng có thể mở rộng thêm

1. **Luận giải bằng Claude AI** — gửi `data` từ API vào Claude prompt
2. **Đại hạn / Tiểu hạn** — tính vận 10 năm, 1 năm
3. **Lưu lịch sử** — lưu bản đồ đã xem
4. **So sánh hợp tuổi** — nhập 2 người, tính hợp/xung
5. **Chia sẻ** — tạo link bản đồ tử vi để share

---

*Được tạo bởi Claude Code — Dự án Tử Vi Đẩu Số AI Hybrid (6/6 giai đoạn hoàn thành)*
