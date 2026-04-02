import 'dotenv/config';
import { db } from './db';
import { categories } from './schema';

async function seed() {
  console.log('🌱 Seeding default categories...');

  // Các danh mục mẫu cho người dùng (id này nên là id của người dùng đầu tiên hoặc để trống nếu dùng chung)
  // Lưu ý: Trong Supabase, userId thường lấy từ auth.users. 
  // Để seeding hoạt động, tôi dùng một UUID giả định. 
  // Sau này bạn có thể thay đổi hoặc để logic tự tạo khi người dùng đăng ký.
  
  const defaultCategories = [
    { name: 'Ăn uống', type: 'expense' as const, icon: '🍔', userId: '00000000-0000-0000-0000-000000000000' },
    { name: 'Di chuyển', type: 'expense' as const, icon: '🚗', userId: '00000000-0000-0000-0000-000000000000' },
    { name: 'Mua sắm', type: 'expense' as const, icon: '🛍️', userId: '00000000-0000-0000-0000-000000000000' },
    { name: 'Lương', type: 'income' as const, icon: '💰', userId: '00000000-0000-0000-0000-000000000000' },
    { name: 'Thưởng', type: 'income' as const, icon: '🎁', userId: '00000000-0000-0000-0000-000000000000' },
  ];

  try {
    await db.insert(categories).values(defaultCategories);
    console.log('✅ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

seed();
