# Kế hoạch thực thi: Quy chuẩn Clean Code và Clean Architecture

> **Dành cho Agent:** YÊU CẦU SUB-SKILL: Sử dụng superpowers:subagent-driven-development (khuyến nghị) hoặc superpowers:executing-plans để thực hiện từng nhiệm vụ trong kế hoạch này. Sử dụng cú pháp checkbox (`- [ ]`) để theo dõi tiến độ.

**Mục tiêu:** Cập nhật file `gemini.md` để tích hợp bộ quy chuẩn Clean Code và Clean Architecture, giúp AI tuân thủ nghiêm ngặt trong các task lập trình sau này.

**Cách tiếp cận:** Thêm phần "CODE STANDARDS" vào đầu file `gemini.md`, ngay sau phần ngôn ngữ giao tiếp.

**Công nghệ:** Markdown, Git.

---

### Nhiệm vụ 1: Cập nhật `gemini.md` với Quy chuẩn mới

**Tệp tin:**
- Chỉnh sửa: `gemini.md`

- [ ] **Bước 1: Cập nhật nội dung `gemini.md`**

Chèn phần **CODE STANDARDS (CLEAN CODE & ARCHITECTURE)** vào sau phần ngôn ngữ giao tiếp.

```markdown
**CODE STANDARDS (CLEAN CODE & ARCHITECTURE):**
1. **Phân lớp Kiến trúc (Clean Architecture):**
   - **UI Layer (`src/components`, `src/pages`):** Chỉ hiển thị dữ liệu và nhận tương tác. Tuyệt đối không gọi trực tiếp Supabase/API.
   - **Logic Layer (`src/hooks`):** Chứa logic điều khiển và kết nối dữ liệu. Tách biệt logic phức tạp khỏi Component.
   - **Data Layer (`src/lib`, `src/services`):** Tương tác với Database/API. Đảm bảo hàm nguyên tử (atomic).
   - **Domain Layer (`src/types`):** Định nghĩa kiểu dữ liệu dùng chung.
2. **Quy tắc Clean Code:**
   - **Single Responsibility (S):** Mỗi hàm, mỗi Component chỉ làm một việc duy nhất.
   - **Đặt tên (Naming):** Component dùng `PascalCase`. Hàm/Biến dùng `camelCase`. Boolean dùng tiền tố `is`, `has`, `should`. Tên phải mang tính mô tả.
   - **Kích thước hàm:** Ưu tiên dưới 20 dòng. Nếu dài hơn, bắt buộc tách nhỏ.
   - **Xử lý lỗi:** Luôn bọc Async code trong `try-catch` và trả về kết quả nhất quán dạng `{ data, error }`.
   - **Constants:** Sử dụng hằng số thay cho "Magic Numbers".
```

- [ ] **Bước 2: Kiểm tra nội dung file**

Chạy lệnh: `cat gemini.md`
Kỳ vọng: File hiển thị đầy đủ các quy chuẩn vừa thêm và giữ nguyên các bước quy trình hiện có.

- [ ] **Bước 3: Thực hiện commit**

```bash
git add gemini.md
git commit -m "docs: integrate clean code and architecture standards into gemini.md"
```
