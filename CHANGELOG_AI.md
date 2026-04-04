# AI TASKS LOG

### Ngày/Giờ: 4/4/2026
### Task: Triển khai tính năng Quản lý Vay nợ (Debt Management)
### Các file đã thay đổi:
- `gemini.md`: Cập nhật quy tắc Git, Ngôn ngữ và Documentation.
- `src/db/schema.ts`: Thêm bảng `contacts`, cột `contact_id` vào `transactions`.
- `src/hooks/useContacts.ts`: Hook quản lý Danh bạ (Contacts CRUD).
- `src/hooks/useTransactions.ts`: Cập nhật để hỗ trợ lưu và lấy thông tin đối tượng giao dịch.
- `src/pages/ContactsPage.tsx`: Giao diện quản lý Danh bạ.
- `src/pages/DebtsPage.tsx`: Giao diện quản lý Nợ (Tab switch "Tôi nợ" và "Nợ tôi").
- `src/components/Transactions/TransactionForm.tsx`: Hỗ trợ chọn đối tượng khi nhập giao dịch vay nợ.
- `src/components/Layout/Header.tsx`: Thêm menu điều hướng.
- `docs/features/debt-management.md`: Tài liệu hướng dẫn chi tiết tính năng.

### Chi tiết:
- Hệ thống hóa việc theo dõi vay nợ gắn với từng người cụ thể trong danh bạ.
- Tự động tính toán số nợ/cho vay dựa trên tên danh mục (Vay, Cho vay, Thu nợ, Trả nợ).
- Cập nhật Realtime cho cả danh bạ và giao dịch.
- Tài liệu chi tiết cách sử dụng và cấu hình database đã được tạo tại `docs/features/`.

---

### Ngày/Giờ: 4/2/2026 12:35 AM
### Task: Thiết lập Drizzle ORM và Schema Database (Quản lý thu chi)
... (giữ nguyên phần cũ) ...
