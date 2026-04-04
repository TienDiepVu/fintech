# Quản lý Vay nợ (Debt Management)

## Mô tả
Tính năng này giúp người dùng theo dõi các khoản vay và nợ đối với các đối tượng (người quen, đối tác) cụ thể. Hệ thống tự động tính toán tổng số tiền nợ dựa trên các giao dịch được gán cho từng đối tượng.

### Cách thức hoạt động:
1.  **Danh bạ (Contacts):** Người dùng tạo danh sách những người có liên quan đến các khoản vay nợ.
2.  **Giao dịch (Transactions):** Khi tạo một giao dịch, nếu danh mục thuộc loại vay nợ (Vay, Cho vay, Thu nợ, Trả nợ), hệ thống yêu cầu chọn một người từ danh bạ.
3.  **Tính toán:**
    *   **Nợ tôi (Owed to me):** Tăng khi có giao dịch "Cho vay" và giảm khi có giao dịch "Thu nợ".
    *   **Tôi nợ (I owe):** Tăng khi có giao dịch "Vay" và giảm khi có giao dịch "Trả nợ".

## Hướng dẫn sử dụng
1.  Truy cập mục **Danh bạ** để thêm tên những người bạn thường xuyên giao dịch vay nợ.
2.  Truy cập **Tổng quan**, nhấn **Lưu giao dịch**:
    *   Chọn loại **Tiền chi** và danh mục **Cho vay** -> Chọn đối tượng.
    *   Chọn loại **Tiền thu** và danh mục **Vay** -> Chọn đối tượng.
3.  Truy cập mục **Vay nợ** để xem tổng hợp:
    *   Tab **Nợ tôi**: Danh sách những người đang nợ bạn.
    *   Tab **Tôi nợ**: Danh sách những người bạn đang nợ.
    *   Click vào từng người để xem lịch sử giao dịch chi tiết.

## Cấu hình Database (SQL)
Nếu bạn cài đặt từ đầu, hãy chạy lệnh sau trong SQL Editor của Supabase để hỗ trợ Realtime:
```sql
-- Cho phép Realtime cho bảng contacts và transactions
alter publication supabase_realtime add table contacts;
alter publication supabase_realtime add table transactions;
```

## Lịch sử thay đổi
- **2026-04-04:** Khởi tạo tính năng Quản lý Vay nợ (Bảng contacts, cập nhật transactions, giao diện Debts và Contacts).
