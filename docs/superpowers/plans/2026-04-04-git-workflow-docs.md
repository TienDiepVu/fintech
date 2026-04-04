# Git Workflow and Feature Documentation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update `gemini.md` to enforce a new Git workflow and structured feature documentation process.

**Architecture:** Modify the central instructions file (`gemini.md`) to integrate Git setup at the start of the execution phase and mandate persistent feature documentation in `docs/features/`.

**Tech Stack:** Markdown, Git.

---

### Task 1: Update `gemini.md` with New Workflow and Communication Rules

**Files:**
- Modify: `gemini.md`

- [ ] **Step 1: Update `gemini.md` content**

Update the introduction and "BƯỚC 3" section to include Git setup, documentation requirements, and communication language.

```markdown
Bạn là một AI Lập trình viên cao cấp. Kể từ bây giờ, với mọi yêu cầu (task) mà người dùng đưa ra, dù rõ ràng hay mông lung, bạn BẮT BUỘC phải tuân thủ nghiêm ngặt quy trình 3 bước sau đây. Không bao giờ được bỏ qua bước nào.

**NGÔN NGỮ GIAO TIẾP:**
- Sử dụng tiếng Việt để giao tiếp với người dùng.
- Giữ nguyên các thuật ngữ chuyên môn (technical terms) bằng tiếng Anh (ví dụ: `checkout`, `pull`, `commit`, `feature`, `hook`, `context`, etc.).

... (giữ nguyên Bước 1 và Bước 2) ...

**BƯỚC 3: THỰC THI & TÀI LIỆU HÓA (EXECUTION & DOCUMENTATION)**

1. **Thiết lập Git (Git Setup):**
   - Thực hiện `git checkout main` và `git pull origin main` để đảm bảo code mới nhất.
   - Tạo nhánh mới từ `main` theo quy tắc:
     + Tính năng mới: `git checkout -b feature/[ten-nhanh]`
     + Sửa lỗi: `git checkout -b fix/[ten-nhanh]`

2. **Triển khai mã nguồn (Implementation):**
   - Tiến hành xuất ra mã nguồn theo đúng kế hoạch đã chốt ở Bước 2.

3. **Tài liệu hóa tính năng (Feature Documentation):**
   - Tạo (hoặc cập nhật) file tài liệu trong thư mục `docs/features/[ten-tinh-nang].md`.
   - Nội dung bắt buộc:
     + **Mô tả:** Cách tính năng hoạt động, mục đích và logic xử lý.
     + **Hướng dẫn sử dụng:** Các bước sử dụng hoặc ví dụ minh họa.
     + **Lịch sử thay đổi:** Nhật ký các lần chỉnh sửa (Ngày/Giờ - Nội dung thay đổi).

4. **Cập nhật Nhật ký tổng (Logging):**
   - SAU KHI hoàn thành, tự động tổng hợp lại các thay đổi quan trọng vào file `CHANGELOG_AI.md`.
   - Cung cấp sẵn câu lệnh bash để người dùng có thể nhanh chóng chèn nội dung nhật ký này.
   - Bao gồm đường dẫn đến file tài liệu trong `docs/features/` vừa tạo/cập nhật.
```

- [ ] **Step 2: Verify the file content**

Run: `cat gemini.md`
Expected: The file should contain the updated "BƯỚC 3" section with Git and documentation rules.

- [ ] **Step 3: Commit the changes**

```bash
git add gemini.md
git commit -m "docs: update gemini.md with git workflow and documentation rules"
```

### Task 2: Create Documentation Directory and Template

**Files:**
- Create: `docs/features/.gitkeep` (to ensure the directory exists)

- [ ] **Step 1: Create the directory**

Run: `mkdir -p docs/features`

- [ ] **Step 2: Add a `.gitkeep` file**

Run: `touch docs/features/.gitkeep`

- [ ] **Step 3: Commit**

```bash
git add docs/features/.gitkeep
git commit -m "docs: create directory for feature documentation"
```
