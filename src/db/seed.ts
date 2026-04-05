import 'dotenv/config';
import { db } from './db';
import { categories } from './schema';
import { eq, and } from 'drizzle-orm';

async function seed() {
  console.log('🌱 Seeding default categories...');

  // LƯU Ý: Bạn cần thay ID này bằng ID thực tế của user trong Supabase
  // Hoặc script này sẽ tạo danh mục dùng chung (nếu RLS cho phép)
  const TARGET_USER_ID = process.env.VITE_USER_ID || '00000000-0000-0000-0000-000000000000';

  const defaultCategories = [
    { name: 'Ăn uống', type: 'expense' as const, icon: '🍔', userId: TARGET_USER_ID },
    { name: 'Di chuyển', type: 'expense' as const, icon: '🚗', userId: TARGET_USER_ID },
    { name: 'Mua sắm', type: 'expense' as const, icon: '🛍️', userId: TARGET_USER_ID },
    { name: 'Cho vay', type: 'expense' as const, icon: '💸', userId: TARGET_USER_ID },
    { name: 'Trả nợ', type: 'expense' as const, icon: '💳', userId: TARGET_USER_ID },
    { name: 'Lương', type: 'income' as const, icon: '💰', userId: TARGET_USER_ID },
    { name: 'Thưởng', type: 'income' as const, icon: '🎁', userId: TARGET_USER_ID },
    { name: 'Vay', type: 'income' as const, icon: '🏦', userId: TARGET_USER_ID },
    { name: 'Thu nợ', type: 'income' as const, icon: '🔙', userId: TARGET_USER_ID },
  ];

  try {
    for (const cat of defaultCategories) {
      // Kiểm tra xem danh mục đã tồn tại chưa để tránh trùng lặp
      const existing = await db
        .select()
        .from(categories)
        .where(
          and(
            eq(categories.name, cat.name),
            eq(categories.userId, cat.userId)
          )
        )
        .limit(1);

      if (existing.length === 0) {
        await db.insert(categories).values(cat);
        console.log(`✅ Added category: ${cat.name}`);
      } else {
        console.log(`🟡 Category already exists: ${cat.name}`);
      }
    }
    console.log('✨ Seeding completed!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit(0);
  }
}

seed();
