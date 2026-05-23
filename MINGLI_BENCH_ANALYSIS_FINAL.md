# 🔍 PHÂN TÍCH MingLi-Bench + SO SÁNH 3 REPOS

**Ngày:** 2026-05-22  
**Scope:** Đánh giá MingLi-Bench + Tích hợp vào dự án Tử Vi + AI  
**Kết luận:** 🎯 **MingLi-Bench = Bộ test cases tiêu chuẩn để verify accuracy**

---

## 📊 TỔNG QUAN MingLi-Bench

### Mục đích:
**Benchmark dataset** để đánh giá LLMs trên lý số Tử Vi (Bazi + Ziwei)

- 160 câu hỏi multiple-choice
- Từ Global Fortune Teller Competition (2022-2025)
- Dùng `iztro` để sinh ra bản đồ sao
- Hỗ trợ Chain-of-Thought (CoT) reasoning

### Công nghệ:
- **Python 3.9+**
- **Framework:** Custom benchmark runner
- **LLM Support:** OpenAI, Anthropic, Google, DeepSeek, Doubao (via OpenRouter)
- **Data:** 160 structured QA pairs + pre-computed Bazi/Ziwei charts

---

## 📈 CẤU TRÚC DỮ LIỆU

```json
{
  "questions": [
    {
      "id": "ftb_0001",
      "case_id": "case_1",
      "birth_info": {
        "year": 1974,
        "month": 4,
        "day": 28,
        "hour": 16,
        "minute": 40,
        "gender": "男",
        "location": "usa"
      },
      "question": "此命1996年发生何事？",
      "options": [
        { "letter": "A", "text": "患上严重抑郁痴" },
        { "letter": "B", "text": "回港认识现任妻子" },
        { "letter": "C", "text": "交通意外，撞车，人平安" },
        { "letter": "D", "text": "得到一笔意外之财" }
      ],
      "answer": "A",
      "category": "健康"
    }
  ]
}
```

### Metadata:
- **160 questions** across **12 life categories:**
  - 健康 (Health)
  - 婚姻 (Marriage)
  - 事业 (Career)
  - 财富 (Wealth)
  - 家庭 (Family)
  - ...

- **Pre-computed charts** (fortune_api_results.json):
  - Bazi 八字 (từ iztro)
  - Ziwei 紫微 (từ iztro)
  - JSON format, indexed by `case_id`

---

## 🔬 SO SÁNH 3 REPOS (TỔNG HỢP)

| Tiêu chí | iztro | lasotuvi | MingLi-Bench |
|----------|-------|----------|--------------|
| **Loại** | Algorithm | Algorithm | Benchmark/Dataset |
| **Ngôn ngữ** | TypeScript | Python | Python |
| **Mục đích** | Sắp xếp sao | Sắp xếp sao | Test LLMs |
| **14 Chính tinh** | ✅ 100% | ✅ 100% | N/A (dùng iztro) |
| **GMT+7 handle** | ❌ | ✅ | ✅ (via iztro) |
| **Unit tests** | ❌ | ✅ | ✅ (160 cases) |
| **Output format** | Raw chart | Raw chart | Formatted QA |
| **Maturity** | Production | Dead (2021) | Active (2025) |
| **Ích lợi cho AI** | Sao → JSON | Sao → JSON | **JSON → AI prompt** |

---

## 🎯 VAI TRÒ TRONG DỰ ÁN CỦA KHÔI

```
┌─────────────────────────────────────────────┐
│   Ứng dụng Tử Vi + AI của Khôi             │
├─────────────────────────────────────────────┤
│                                             │
│  User Input (ngày sinh)                    │
│           ↓                                 │
│  [iztro + lasotuvi] ← Tạo chart           │
│           ↓                                 │
│  [normalize-vn] ← JSON Việt                │
│           ↓                                 │
│  [Claude AI] ← Luận giải bay bổng         │
│           ↓                                 │
│  Output (Luận giải)                       │
│           ▲                                 │
│           │                                 │
│  [MingLi-Bench] ← Verify accuracy          │
│  (160 test cases)                          │
│                                             │
└─────────────────────────────────────────────┘
```

**Vai trò của MingLi-Bench:**
1. ✅ **Verify accuracy** của chart generation
2. ✅ **Benchmark AI** — test Claude reasoning
3. ✅ **Regression testing** — sau mỗi update
4. ✅ **Competitive analysis** — compare vs other LLMs

---

## 💡 CÁCH SỬ DỤNG MingLi-Bench

### 1️⃣ **Verify Accuracy của Hybrid Algorithm**

```python
# Chạy MingLi-Bench với Hybrid Algorithm của chúng ta
# (thay vì iztro pure)

python -m mingli_bench.cli \
  --model anthropic/claude-opus \
  --astro \                          # Dùng pre-computed charts
  --cot \                            # Chain-of-Thought
  --platform anthropic
```

**Kỳ vọng:**
- Hybrid (iztro + lasotuvi + lunar-vn) nên cho kết quả = iztro pure
- Vì chúng ta chỉ thay đổi input (lunar converter), không thay logic sắp xếp sao

### 2️⃣ **Benchmark Claude Reasoning**

```python
# Test khả năng reasoning của Claude trên lý số

python -m mingli_bench.cli \
  --model anthropic/claude-opus \
  --astro \
  --cot
```

**Output:**
```
Category: 健康
  Questions: 20
  Correct: 18 (90%)
  
Category: 婚姻
  Questions: 15
  Correct: 12 (80%)
```

### 3️⃣ **Compare Hypothesis Testing**

```python
# Test giả thuyết: 
# "lunar-vn (GMT+7) cho kết quả chính xác hơn lunar-js (GMT+8)"

# Run 1: iztro pure (lunar-javascript, GMT+8)
python -m mingli_bench.cli --use-iztro-pure --astro

# Run 2: Hybrid (lunar-vn, GMT+7)
python -m mingli_bench.cli --use-lunar-vn --astro

# Compare scores → Nên bằng nhau hoặc gần bằng
# (nếu khác = chứng tỏ code có bug)
```

---

## 📋 HÀNH ĐỘNG: TÍCH HỢP MingLi-Bench VÀO HYBRID

### Bước 1: Adapter Pattern

Tạo wrapper để MingLi-Bench có thể dùng Hybrid Algorithm:

```python
# tests/integration/mingli_bench_adapter.py

from mingli_bench.models.base import ModelClient
from lib.ziwei.algorithm_vn import generateChartVN
from lib.ziwei.normalize_vn import normalizeChartVN

class HybridAlgorithmAdapter:
    """Adapter để MingLi-Bench dùng Hybrid Algorithm"""
    
    def generate_chart(self, birth_info):
        """Thay thế iztro bằng Hybrid"""
        chart = generateChartVN(birth_info)
        return normalizeChartVN(chart)
    
    def verify_accuracy(self, test_cases: List[Dict]):
        """Chạy MingLi-Bench với Hybrid"""
        results = []
        for case in test_cases:
            chart = self.generate_chart(case['birth_info'])
            results.append({
                'case_id': case['case_id'],
                'chart': chart,
                'match_expected': self.compare_with_iztro(chart, case['expected'])
            })
        return results
    
    def compare_with_iztro(self, hybrid_result, iztro_result):
        """So sánh Hybrid vs iztro pure"""
        # Kiểm tra:
        # - Cùng 14 chính tinh?
        # - Cùng tứ hóa?
        # - Cùng patterns?
        pass
```

### Bước 2: Tạo Test Suite

```python
# tests/integration/test_hybrid_accuracy.py

import pytest
from mingli_bench_adapter import HybridAlgorithmAdapter
from mingli_bench.data.loader import DataLoader

class TestHybridAccuracy:
    
    @pytest.fixture
    def adapter(self):
        return HybridAlgorithmAdapter()
    
    @pytest.fixture
    def mingli_data(self):
        loader = DataLoader('data/data.json')
        return loader.load_questions()
    
    def test_chart_generation_matches_iztro(self, adapter, mingli_data):
        """Hybrid chart nên match với iztro pure"""
        for question in mingli_data[:10]:  # Test 10 cases
            birth_info = question['birth_info']
            
            hybrid_chart = adapter.generate_chart(birth_info)
            iztro_chart = self.generate_with_iztro(birth_info)
            
            assert hybrid_chart['palaces'] == iztro_chart['palaces']
            assert hybrid_chart['sihua'] == iztro_chart['sihua']
    
    def test_lunar_conversion_accuracy(self, adapter, mingli_data):
        """GMT+7 lunar conversion nên chính xác"""
        # Test case: 1991-10-24 (Hồ Chí Minh) = 1991-09-17 (Âm lịch)
        result = adapter.generate_chart({
            'year': 1991,
            'month': 10,
            'day': 24,
            'hour': 14,
            'gender': 'male',
            'timeZone': 7
        })
        
        assert result['lunar']['month'] == 9
        assert result['lunar']['day'] == 17
    
    def test_gmt7_vs_gmt8_difference(self, adapter):
        """Chứng minh GMT+7 (Việt) khác GMT+8 (Trung)"""
        # Case borderline: ngày trăng mới gần đó
        birth_gmt7 = adapter.generate_chart({...timeZone: 7...})
        birth_gmt8 = adapter.generate_chart({...timeZone: 8...})
        
        # Có thể khác nhau 1 ngày tùy vào giờ chính xác
        assert birth_gmt7['lunar']['day'] >= birth_gmt8['lunar']['day'] - 1
```

### Bước 3: Benchmark Claude

```python
# tests/integration/test_claude_reasoning.py

import pytest
from mingli_bench.cli import run_benchmark

class TestClaudeReasoningOnMingLi:
    
    def test_claude_with_cot_and_astro(self):
        """Benchmark Claude trên MingLi-Bench"""
        results = run_benchmark(
            model_name='anthropic/claude-opus',
            use_cot=True,
            use_astro=True,
            astro_provider='hybrid',  # ← Dùng Hybrid, không phải iztro pure
            sample_size=160
        )
        
        # Verify: Overall accuracy > 60%
        # (benchmark từ paper MingLi có baseline ~50%)
        assert results['overall_accuracy'] > 0.60
        
        # Per-category breakdown
        for category, score in results['by_category'].items():
            print(f"{category}: {score:.1%}")
        
        return results
```

---

## 🚀 LỢI ÍCH CỦA MingLi-BENCH

### 1️⃣ **Verification (Xác minh)**
- ✅ Chứng minh chart generation đúng
- ✅ Hybrid = iztro pure (nếu correct)
- ✅ GMT+7 handling chính xác

### 2️⃣ **Benchmarking (Đánh giá)**
- ✅ Claude reasoning score trên lý số
- ✅ Compare vs OpenAI, Google, v.v.
- ✅ Regression testing sau mỗi update

### 3️⃣ **Research (Nghiên cứu)**
- ✅ Analyze: CoT vs non-CoT
- ✅ Analyze: Astro charts vs pure reasoning
- ✅ Publish: Performance on fortune telling benchmark

### 4️⃣ **Production QA**
- ✅ Automated testing trước deploy
- ✅ Catch regressions early
- ✅ Monitor accuracy over time

---

## 📊 BẢNG HÀNH ĐỘNG: TÍCH HỢP MingLi-BENCH

| Task | Effort | Timeline | Priority |
|------|--------|----------|----------|
| Tạo HybridAlgorithmAdapter | 4 giờ | Ngay | P0 |
| Viết test_hybrid_accuracy.py | 6 giờ | Ngay | P0 |
| Run benchmark trên 160 cases | 2 giờ | Ngay | P0 |
| **So sánh:** Hybrid vs iztro pure | 4 giờ | Tuần 4 | P1 |
| **Benchmark:** Claude reasoning | 4 giờ | Tuần 4 | P1 |
| Documentation + Report | 4 giờ | Tuần 4 | P2 |
| **TOTAL** | **24 giờ** | **~1 tuần** | |

---

## 🎯 FINAL RECOMMENDATION: 3-REPO INTEGRATION STRATEGY

### **TIER 1: Algorithm (Core)**
```
iztro (TypeScript, production-ready)
  ↓ (Replace lunar-javascript with)
  lib/lunar/lunar-vn.ts (Port từ lasotuvi, GMT+7)
  ↓
  lib/ziwei/normalize-vn.ts (Output JSON Việt)
```

### **TIER 2: Testing & Verification**
```
lasotuvi (Unit tests, astronomical formulas)
  ↓ (Port test cases từ)
  tests/unit/lunar-vn.test.ts
  ↓
MingLi-Bench (160 benchmark cases)
  ↓ (Verify accuracy với)
  tests/integration/test_hybrid_accuracy.py
```

### **TIER 3: AI Application**
```
Claude API (Interpretation)
  ↓ (Feed JSON từ)
  lib/ziwei/normalize-vn.ts
  ↓ (Evaluate with)
  MingLi-Bench benchmark
```

---

## 📈 EXPECTED OUTCOMES (AFTER INTEGRATION)

### Code Quality:
- ✅ **Type coverage:** >95%
- ✅ **Test coverage:** >85%
- ✅ **Lunar accuracy:** 100% (verified vs lasotuvi)
- ✅ **GMT+7 precision:** ±0 days

### Performance:
- ⏱️ **Chart generation:** <100ms
- 🧠 **Claude reasoning:** >60% accuracy on MingLi-Bench
- 📦 **Bundle size:** +50-100KB (lunar converter)

### Verification:
- ✅ Hybrid == iztro pure (chart comparison)
- ✅ Claude > baseline on fortune telling
- ✅ Regression suite (160 cases)

---

## 🔗 NEXT STEPS (KHÔI QUYẾT ĐỊNH)

### Option A: Bắt tay Giai đoạn 2 ngay
- Tuần 1-4: Code Hybrid (lunar-vn + algorithm-vn + normalize-vn)
- Tuần 5: Tích hợp MingLi-Bench + Verification
- **Timeline:** 5 tuần, production-ready

### Option B: Nghiên cứu thêm
- Khôi muốn tìm thêm resources Việt Nam?
- Muốn deep-dive vào MingLi-Bench methodology?
- Muốn study lasotuvi code chi tiết hơn?

### Option C: Hybrid approach
- Tuần 1-2: Code Giai đoạn 2
- Tuần 3: Tích hợp MingLi-Bench (song song)
- **Timeline:** 4 tuần, faster iteration

---

## 📚 SUMMARY: CÁC RESOURCES HIỆN CÓ

| Resource | Type | Use Case | Quality |
|----------|------|----------|---------|
| **iztro v2.5.8** | Algorithm | Sắp xếp sao + 60+ patterns | ⭐⭐⭐⭐⭐ Production |
| **lasotuvi v0.1.0** | Algorithm | Lunar converter GMT+7 + tests | ⭐⭐⭐⭐ Good |
| **MingLi-Bench** | Dataset | 160 benchmark cases | ⭐⭐⭐⭐⭐ Excellent |
| **Technical Spec** | Blueprint | Implementation guide | ⭐⭐⭐⭐⭐ Ready to code |

**Bạn có đủ resources để code Hybrid ngay!** 🚀

---

**Quyết định của bạn sẽ quyết định timeline tiếp theo!**

**Bạn muốn:**
1. ⏭️ **Bắt tay code Giai đoạn 2 ngay?** (Tôi support từng dòng)
2. 📊 **Deep-dive vào MingLi-Bench methodology?** (Tôi giải thích chi tiết)
3. ❓ **Có câu hỏi thêm?** (Hỏi tôi bây giờ)

