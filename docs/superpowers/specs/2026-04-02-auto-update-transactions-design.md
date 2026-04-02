# Tài liệu thiết kế: Hệ thống Cập nhật Giao dịch Tự động (Auto-Update Transactions)

**Ngày:** 2026-04-02
**Trạng thái:** Đang chờ duyệt

## 1. Mục tiêu (Goals)
- Đảm bảo dữ liệu giao dịch (transactions) luôn được cập nhật mới nhất trên giao diện sau khi người dùng thực hiện Thêm/Sửa/Xóa.
- Mang lại trải nghiệm "mượt mà" (không độ trễ) bằng kỹ thuật Optimistic UI.
- Đảm bảo tính chính xác của dữ liệu thông qua cơ chế đồng bộ Realtime của Supabase.

## 2. Phân tích vấn đề hiện tại
- Hook `useTransactions` hiện đang sử dụng cơ chế Realtime (`postgres_changes`) nhưng lại tự ý cập nhật mảng local. Điều này dẫn đến:
    - Thiếu thông tin Danh mục (`categories`) vì Realtime chỉ trả về dữ liệu của bảng `transactions`.
    - Dữ liệu có thể bị sai lệch thứ tự sắp xếp sau khi cập nhật.
    - Chưa có cơ chế "Optimistic UI" khiến người dùng cảm thấy có độ trễ nhỏ khi thao tác.

## 3. Giải pháp thiết kế (Proposed Design)

### Cơ chế Optimistic UI + Realtime Sync
1.  **Optimistic UI:** Khi người dùng thực hiện một hành động (ví dụ: Xóa), chúng ta sẽ cập nhật `state` của React ngay lập tức để ẩn/xóa giao dịch đó khỏi danh sách.
2.  **Server Action:** Gửi yêu cầu thực tế lên Supabase.
3.  **Error Handling (Rollback):** Nếu bước 2 thất bại, chúng ta sẽ khôi phục lại danh sách cũ và hiển thị thông báo lỗi.
4.  **Realtime Synchronization:** Thay vì tự cập nhật mảng local từ payload của Realtime, chúng ta sẽ gọi lại hàm `fetchTransactions()` mỗi khi có sự kiện thay đổi (`INSERT`, `UPDATE`, `DELETE`) từ Database. Việc này đảm bảo:
    - Lấy được đầy đủ thông tin JOIN (như bảng `categories`).
    - Thứ tự sắp xếp luôn đúng theo logic của Database.

### Các file sẽ thay đổi
- `src/hooks/useTransactions.ts`: Thay đổi logic xử lý Realtime và các hàm `addTransaction`, `updateTransaction`, `deleteTransaction`.

## 4. Kế hoạch thực hiện (Step-by-step Plan)

### Bước 1: Cập nhật logic Realtime trong `useTransactions`
- Sửa đổi listener `supabase.channel('transactions-changes')`.
- Thay đổi logic từ việc xử lý `payload` sang việc gọi đơn giản hàm `fetchTransactions()`.

### Bước 2: Triển khai Optimistic UI cho hàm Xóa (Delete)
- Lưu lại bản sao của danh sách giao dịch hiện tại.
- Cập nhật state xóa giao dịch ngay lập tức.
- Thực hiện gọi API Supabase. Nếu lỗi, khôi phục lại bản sao.

### Bước 3: Triển khai Optimistic UI cho hàm Thêm (Add)
- Tạo một giao dịch "tạm thời" để hiển thị ngay lập tức.
- Sau khi Supabase phản hồi thành công hoặc Realtime bắn tín hiệu, dữ liệu thật sẽ thay thế dữ liệu tạm.

### Bước 4: Triển khai Optimistic UI cho hàm Sửa (Update)
- Cập nhật thông tin giao dịch trong state ngay khi nhấn lưu.
- Xử lý rollback nếu lỗi.

## 5. Kiểm thử (Verification Plan)
- **Thêm mới:** Nhấn thêm, giao dịch xuất hiện ngay lập tức, sau 0.5s thông tin "Danh mục" được load đầy đủ từ server.
- **Xóa:** Nhấn xóa, giao dịch biến mất ngay lập tức.
- **Sửa:** Nhấn lưu, thông tin mới hiển thị ngay.
- **Mất mạng/Lỗi server:** Thực hiện thao tác, sau đó giao diện quay lại trạng thái cũ và hiện thông báo lỗi.
