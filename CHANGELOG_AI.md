# AI TASKS LOG

### Ngày/Giờ: 4/2/2026 12:35 AM
### Task: Thiết lập Drizzle ORM và Schema Database (Quản lý thu chi)
### Các file đã thay đổi:
- `package.json`: Thêm dependencies (`drizzle-orm`, `drizzle-kit`, `postgres`, `tsx`) và scripts.
- `drizzle.config.ts`: File cấu hình migration.
- `src/db/schema.ts`: Định nghĩa schema DB cho Categories và Transactions.
- `src/db/db.ts`: Thiết lập kết nối database instance.
- `src/db/seed.ts`: Script nạp dữ liệu danh mục mẫu.

### Chi tiết:
- Cài đặt hệ thống Drizzle ORM để quản lý DB bằng TypeScript.
- Thiết kế bảng `categories` hỗ trợ phân loại Thu/Chi với Icon.
- Thiết kế bảng `transactions` liên kết chặt chẽ với categories và hệ thống User của Supabase.
- Cấu trúc sẵn sàng cho việc mở rộng (Budgets, Reports).
