# AI TASKS LOG

### Ngày/Giờ: 4/6/2026
### Task: Triển khai tính năng Thông tin tài khoản (Account Information)
### Các file đã tạo mới:
- `src/components/ui/avatar.tsx`: Component hiển thị ảnh đại diện chuyên nghiệp.
- `src/components/Account/ProfileDialog.tsx`: Pop-up hiển thị thông tin tài khoản chi tiết.
- `src/hooks/useProfile.ts`: Hook để xử lý việc tải ảnh đại diện lên Supabase Storage.
- `docs/features/account-info.md`: Tài liệu hướng dẫn chi tiết tính năng.

### Các file đã thay đổi:
- `src/db/schema.ts`: Thêm bảng `profiles` liên kết với `auth.users`.
- `src/types/index.ts`: Thêm interface `Profile` và `ProfileFormData`.
- `src/contexts/AuthContext.tsx`: Cập nhật để tự động fetch và quản lý `profile`.
- `src/components/Layout/Header.tsx`: Thay đổi hiển thị Email thành [Avatar + Tên] và tích hợp Pop-up.

### Chi tiết:
- Hệ thống hóa việc quản lý thông tin người dùng (Tên, SĐT, Ngày sinh, Địa chỉ, Email).
- Cho phép người dùng cập nhật ảnh đại diện thông qua Supabase Storage.
- Tự động đồng bộ hóa thông tin Profile ngay khi đăng nhập.
- Cung cấp sẵn các câu lệnh SQL để cấu hình Database và RLS trong tài liệu đi kèm.

---

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
