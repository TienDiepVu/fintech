# Kế hoạch thực thi: Cập nhật giao dịch tự động (Optimistic UI + Realtime)

> **Dành cho Agent:** Yêu cầu sử dụng SUB-SKILL: `superpowers:executing-plans` để thực hiện từng bước trong kế hoạch này. Các bước sử dụng cú pháp checkbox (`- [ ]`) để theo dõi tiến độ.

**Mục tiêu:** Cải thiện trải nghiệm người dùng bằng cách cập nhật giao diện ngay lập tức khi Thêm/Sửa/Xóa và đảm bảo tính chính xác bằng cách đồng bộ Realtime từ Supabase.

**Kiến trúc:** Sử dụng kỹ thuật Optimistic UI (cập nhật state trước khi gọi API) kết hợp với việc gọi lại hàm `fetchTransactions()` khi nhận được tín hiệu Realtime để đảm bảo dữ liệu luôn đầy đủ và chính xác (bao gồm cả các bảng JOIN).

**Công nghệ:** React, Supabase Realtime, TypeScript.

---

### Task 1: Cập nhật logic Realtime trong `useTransactions.ts`

**Files:**
- Modify: `src/hooks/useTransactions.ts`

- [ ] **Bước 1: Sửa đổi logic xử lý sự kiện trong `useEffect`**

Thay vì tự cập nhật mảng `transactions` bằng tay (dễ gây sai sót về sorting và thiếu dữ liệu JOIN), chúng ta sẽ gọi hàm `fetchTransactions()` khi có bất kỳ thay đổi nào.

```typescript
// Trong src/hooks/useTransactions.ts, phần useEffect cho Realtime
    const subscription = supabase
      .channel('transactions-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'transactions',
        filter: `user_id=eq.${user.id}` 
      }, 
      () => {
        // Chỉ cần gọi lại fetchTransactions để lấy dữ liệu chuẩn nhất từ DB
        fetchTransactions();
      })
      .subscribe();
```

- [ ] **Bước 2: Commit thay đổi**

```bash
git add src/hooks/useTransactions.ts
git commit -m "refactor: simplify realtime logic to refetch on changes"
```

### Task 2: Triển khai Optimistic UI cho hàm Xóa (Delete)

**Files:**
- Modify: `src/hooks/useTransactions.ts`

- [ ] **Bước 1: Cập nhật hàm `deleteTransaction` với logic Rollback**

```typescript
  const deleteTransaction = async (id: string) => {
    // Lưu lại trạng thái cũ để rollback nếu lỗi
    const previousTransactions = [...transactions];
    
    // Optimistic update: Xóa ngay lập tức khỏi UI
    setTransactions(prev => prev.filter(t => t.id !== id));

    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return { error: null };
    } catch (err) {
      // Rollback nếu có lỗi
      setTransactions(previousTransactions);
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      return { error: message };
    }
  };
```

- [ ] **Bước 2: Commit thay đổi**

```bash
git add src/hooks/useTransactions.ts
git commit -m "feat: implement optimistic UI for deleteTransaction"
```

### Task 3: Triển khai Optimistic UI cho hàm Thêm (Add)

**Files:**
- Modify: `src/hooks/useTransactions.ts`

- [ ] **Bước 1: Cập nhật hàm `addTransaction`**

```typescript
  const addTransaction = async (data: TransactionFormData) => {
    if (!user) return { error: 'Không tìm thấy người dùng' };
    
    const previousTransactions = [...transactions];
    
    // Tạo dữ liệu tạm thời (Optimistic)
    // Lưu ý: ID tạm thời dùng uuid v4 hoặc Date.now()
    const tempTransaction: Transaction = {
      id: crypto.randomUUID(),
      amount: data.amount, // Sẽ được format lại khi fetch thật
      type: data.type,
      category_id: data.category_id,
      note: data.note,
      date: data.date,
      user_id: user.id,
      created_at: new Date().toISOString(),
      // Tạm thời chưa có categories object, UI cần xử lý hiển thị fallback
    };

    setTransactions(prev => [tempTransaction, ...prev].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ));

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([{
          user_id: user.id,
          amount: parseFloat(data.amount),
          type: data.type,
          category_id: data.category_id,
          note: data.note,
          date: data.date,
        }]);
      
      if (error) throw error;
      return { error: null };
    } catch (err) {
      setTransactions(previousTransactions);
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      return { error: message };
    }
  };
```

- [ ] **Bước 2: Commit thay đổi**

```bash
git add src/hooks/useTransactions.ts
git commit -m "feat: implement optimistic UI for addTransaction"
```

### Task 4: Triển khai Optimistic UI cho hàm Sửa (Update)

**Files:**
- Modify: `src/hooks/useTransactions.ts`

- [ ] **Bước 1: Cập nhật hàm `updateTransaction`**

```typescript
  const updateTransaction = async (id: string, data: TransactionFormData) => {
    const previousTransactions = [...transactions];

    // Optimistic update
    setTransactions(prev => prev.map(t => 
      t.id === id 
        ? { ...t, ...data, amount: data.amount } 
        : t
    ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));

    try {
      const { error } = await supabase
        .from('transactions')
        .update({
          amount: parseFloat(data.amount),
          type: data.type,
          category_id: data.category_id,
          note: data.note,
          date: data.date,
        })
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (err) {
      setTransactions(previousTransactions);
      const message = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      return { error: message };
    }
  };
```

- [ ] **Bước 2: Commit thay đổi**

```bash
git add src/hooks/useTransactions.ts
git commit -m "feat: implement optimistic UI for updateTransaction"
```

### Task 5: Kiểm tra tổng thể

- [ ] **Kiểm tra Thêm/Sửa/Xóa giao dịch và quan sát UI cập nhật tức thì.**
- [ ] **Kiểm tra dữ liệu sau khi Realtime đồng bộ (khoảng 0.5s sau thao tác) để đảm bảo danh mục được hiển thị đúng.**
