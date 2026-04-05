# Thiết kế: Quy chuẩn Clean Code và Clean Architecture

Tài liệu này xác định bộ quy tắc lập trình mới dành cho dự án FinWallet, tập trung vào tính dễ đọc, dễ bảo trì và mở rộng dựa trên các nguyên lý Clean Code và Clean Architecture.

## 1. Clean Architecture (Cấu trúc phân lớp)

Ứng dụng sẽ được tổ chức theo các lớp trách nhiệm sau:

### Lớp Giao diện (UI Layer)
- **Vị trí:** `src/components`, `src/pages`.
- **Trách nhiệm:** Hiển thị dữ liệu và gửi sự kiện từ người dùng.
- **Quy tắc:** Không gọi trực tiếp Supabase. Sử dụng các Custom Hooks để lấy và xử lý dữ liệu.

### Lớp Logic (Logic/Application Layer)
- **Vị trí:** `src/hooks`.
- **Trách nhiệm:** Chứa logic điều phối dữ liệu cho UI (State management, Data transformation).
- **Quy tắc:** Tách biệt logic phức tạp khỏi Component chính. Một Hook có thể kết hợp nhiều Service.

### Lớp Dữ liệu (Data/Infrastructure Layer)
- **Vị trí:** `src/lib`, `src/services`.
- **Trách nhiệm:** Tương tác với Database (Supabase), Local Storage, hoặc API bên thứ ba.
- **Quy tắc:** Đảm bảo các hàm ở lớp này là nguyên tử (atomic) và chỉ tập trung vào truy xuất dữ liệu.

### Lớp Thực thể (Domain Layer)
- **Vị trí:** `src/types`.
- **Trách nhiệm:** Định nghĩa các kiểu dữ liệu dùng chung (Types/Interfaces).

---

## 2. Clean Code (Quy tắc viết mã)

### Nguyên tắc SOLID
- **S (Single Responsibility):** Mỗi file, mỗi hàm chỉ giải quyết duy nhất một vấn đề.
- **D (Dependency Inversion):** Ưu tiên truyền cấu hình hoặc biến vào hàm thay vì hard-code bên trong.

### Quy tắc đặt tên (Naming)
- **Component:** `PascalCase` (VD: `TransactionItem`).
- **Hàm/Biến:** `camelCase` (VD: `totalAmount`).
- **Boolean:** Tiền tố `is`, `has`, `should` (VD: `isActive`, `hasError`).
- **Tên mang tính mô tả:** Tránh đặt tên kiểu `data`, `info`, `temp`.

### Kích thước và Cấu trúc
- **Độ dài hàm:** Khuyên dùng dưới 20-30 dòng.
- **Xử lý lỗi:** Luôn bọc các thao tác bất đồng bộ (Async) trong `try-catch` và trả về kết quả nhất quán (ví dụ: `{ data, error }`).
- **Không có Magic Numbers:** Sử dụng Constants để thay thế các con số có ý nghĩa đặc biệt.

---

## 3. Cập nhật vào gemini.md

Tôi sẽ thêm phần **CODE STANDARDS** vào đầu file `gemini.md` để AI luôn tuân thủ mỗi khi viết code mới hoặc refactor.

## Tiêu chí thành công
1. Code mới được phân tách rõ ràng giữa UI và Logic.
2. Tên biến và hàm rõ ràng, mang tính mô tả.
3. Không có logic database nằm trực tiếp trong file `.tsx` (ngoại trừ các file khởi tạo).
