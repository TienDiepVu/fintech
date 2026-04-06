# Tính năng: Thông tin tài khoản

## Mô tả
Tính năng này cho phép người dùng xem thông tin chi tiết của tài khoản và thay đổi ảnh đại diện. Thông tin bao gồm:
- Họ và tên
- Email
- Số điện thoại
- Ngày sinh
- Địa chỉ
- Ảnh đại diện (có thể thay đổi)

Dữ liệu được lưu trữ trong bảng `profiles` và liên kết với bảng `auth.users` của Supabase. Ảnh đại diện được lưu trữ tại Supabase Storage bucket `avatars`.

## Cách hoạt động
1. Khi người dùng đăng nhập, `AuthContext` sẽ tự động fetch thông tin từ bảng `profiles`.
2. Trên `Header`, email người dùng được thay thế bằng cụm [Ảnh đại diện + Tên].
3. Khi click vào thông tin người dùng trên `Header`, một Pop-up (Dialog) sẽ hiện ra.
4. Trong Pop-up, người dùng có thể click vào ảnh đại diện để tải ảnh mới lên.

## Cấu trúc kỹ thuật
- **Database:** Bảng `profiles` với RLS (Row Level Security).
- **Storage:** Bucket `avatars` công khai (chỉ được upload bởi chính chủ).
- **Hook:** `useProfile` xử lý logic upload ảnh và cập nhật database.
- **Component:** 
  - `Avatar`: Hiển thị ảnh tròn hoặc initials.
  - `ProfileDialog`: Pop-up hiển thị thông tin.

## SQL Setup (Cần thực hiện trên Supabase)
```sql
-- 1. Tạo bảng profiles
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  phone text,
  birthday text,
  address text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Bật RLS
alter table public.profiles enable row level security;

-- 3. Tạo policy
create policy "Người dùng có thể xem profile của mình" on public.profiles
  for select using (auth.uid() = id);

create policy "Người dùng có thể cập nhật profile của mình" on public.profiles
  for update using (auth.uid() = id);

-- 4. Tự động tạo profile khi đăng ký (Trigger)
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Cấu hình Storage cho avatars
-- (Tạo bucket 'avatars' thủ công trên Supabase Dashboard và đặt là Public)
```

## Lịch sử thay đổi
- **2026-04-06 14:00:** Khởi tạo tính năng, thêm bảng `profiles`, hook `useProfile` và các UI components.
