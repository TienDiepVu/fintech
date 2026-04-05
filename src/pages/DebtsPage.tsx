import React, { useState, useMemo } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { useContacts } from '../hooks/useContacts';
import { Loader2, ArrowUpRight, ArrowDownLeft, ChevronRight, History, ArrowLeft, User } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function DebtsPage() {
  // Không sử dụng filter theo thời gian, lấy toàn bộ giao dịch của user
  // Bằng cách không truyền tham số vào useTransactions()
  const { transactions, monthlyStats, loading: loadingTransactions, hasMore, loadMore } = useTransactions();
  const { contacts, loading: loadingContacts } = useContacts();
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  // monthlyStats lúc này sẽ chứa allTransactions (toàn bộ giao dịch của user)
  const { allTransactions } = monthlyStats;

  // Tính toán số nợ dựa trên toàn bộ lịch sử giao dịch (allTransactions)
  const debtData = useMemo(() => {
    const data: Record<string, { owedToMe: number; iOwe: number }> = {};
    
    allTransactions.forEach(t => {
      if (!t.contact_id) return;
      
      if (!data[t.contact_id]) {
        data[t.contact_id] = { owedToMe: 0, iOwe: 0 };
      }

      const amount = Number(t.amount);
      const catName = t.categories?.name.toLowerCase() || '';

      if (catName.includes('cho vay')) {
        data[t.contact_id].owedToMe += amount;
      } else if (catName.includes('thu nợ')) {
        data[t.contact_id].owedToMe -= amount;
      } else if (catName.includes('vay') && !catName.includes('cho')) {
        data[t.contact_id].iOwe += amount;
      } else if (catName.includes('trả nợ')) {
        data[t.contact_id].iOwe -= amount;
      }
    });

    return data;
  }, [allTransactions]);

  const contactList = useMemo(() => {
    return contacts.map(c => ({
      ...c,
      ...debtData[c.id] || { owedToMe: 0, iOwe: 0 }
    })).filter(c => c.owedToMe !== 0 || c.iOwe !== 0);
  }, [contacts, debtData]);

  const iOweList = contactList.filter(c => c.iOwe > 0).sort((a, b) => b.iOwe - a.iOwe);
  const owedToMeList = contactList.filter(c => c.owedToMe > 0).sort((a, b) => b.owedToMe - a.owedToMe);

  const selectedContact = contacts.find(c => c.id === selectedContactId);
  // Lọc transactions theo contact đang chọn từ mảng transactions có phân trang
  // Lưu ý: Nếu muốn xem toàn bộ lịch sử nợ, có thể cần filter từ allTransactions
  const contactTransactions = transactions.filter(t => t.contact_id === selectedContactId);

  if (selectedContactId) {
    return (
      <div className="container max-w-2xl mx-auto p-4 space-y-6 pb-20 sm:pb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setSelectedContactId(null)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold">{selectedContact?.name}</h1>
            <p className="text-sm text-muted-foreground">Toàn bộ lịch sử vay nợ</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-rose-50 border-rose-100 dark:bg-rose-500/5 dark:border-rose-500/20">
            <CardContent className="p-4">
              <p className="text-xs text-rose-600 font-medium">Tôi nợ</p>
              <p className="text-lg font-bold text-rose-700 dark:text-rose-400">
                {new Intl.NumberFormat('vi-VN').format(debtData[selectedContactId]?.iOwe || 0)}đ
              </p>
            </CardContent>
          </Card>
          <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-500/5 dark:border-emerald-500/20">
            <CardContent className="p-4">
              <p className="text-xs text-emerald-600 font-medium">Nợ tôi</p>
              <p className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                {new Intl.NumberFormat('vi-VN').format(debtData[selectedContactId]?.owedToMe || 0)}đ
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <History className="w-4 h-4" /> Chi tiết giao dịch
          </h3>
          
          <div className="grid gap-3">
            {contactTransactions.length === 0 ? (
              <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed">
                <p className="text-sm text-muted-foreground">Chưa có giao dịch nào.</p>
              </div>
            ) : (
              contactTransactions.map(t => (
                <div key={t.id} className="flex items-center justify-between p-3 bg-card border rounded-xl shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      t.type === 'income' ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                    )}>
                      {t.type === 'income' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{t.categories?.name}</p>
                      {t.note && (
                        <p className="text-xs text-muted-foreground italic line-clamp-1 max-w-[200px]">
                          "{t.note}"
                        </p>
                      )}
                      <p className="text-[10px] text-muted-foreground opacity-70">
                        {format(new Date(t.date), 'dd/MM/yyyy')}
                      </p>
                    </div>
                  </div>
                  <p className={cn(
                    "font-bold",
                    t.type === 'income' ? "text-emerald-600" : "text-rose-600"
                  )}>
                    {t.type === 'income' ? '+' : '-'}{new Intl.NumberFormat('vi-VN').format(t.amount)}đ
                  </p>
                </div>
              ))
            )}
          </div>

          {hasMore && (
            <div className="flex justify-center pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={loadMore}
                disabled={loadingTransactions}
                className="text-xs text-primary"
              >
                {loadingTransactions ? 'Đang tải...' : 'Xem thêm lịch sử'}
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-6 pb-20 sm:pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quản lý vay nợ</h1>
      </div>

      <Tabs defaultValue="owe-me" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-muted rounded-xl">
          <TabsTrigger value="owe-me" className="rounded-lg font-medium">Nợ tôi ({owedToMeList.length})</TabsTrigger>
          <TabsTrigger value="i-owe" className="rounded-lg font-medium">Tôi nợ ({iOweList.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="owe-me" className="mt-6">
          {loadingTransactions && allTransactions.length === 0 ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : owedToMeList.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
              <p className="text-muted-foreground">Hiện không có ai nợ bạn.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {owedToMeList.map(contact => (
                <Card 
                  key={contact.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors border-emerald-100 dark:border-emerald-500/20"
                  onClick={() => setSelectedContactId(contact.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-500/10">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">Click để xem chi tiết</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="text-emerald-600 font-bold dark:text-emerald-400">
                        {new Intl.NumberFormat('vi-VN').format(contact.owedToMe)}đ
                      </p>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="i-owe" className="mt-6">
          {loadingTransactions && allTransactions.length === 0 ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : iOweList.length === 0 ? (
            <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed">
              <p className="text-muted-foreground">Bạn hiện không nợ ai.</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {iOweList.map(contact => (
                <Card 
                  key={contact.id} 
                  className="cursor-pointer hover:bg-muted/50 transition-colors border-rose-100 dark:border-rose-500/20"
                  onClick={() => setSelectedContactId(contact.id)}
                >
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-rose-600 dark:bg-rose-500/10">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold">{contact.name}</p>
                        <p className="text-xs text-muted-foreground">Click để xem chi tiết</p>
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <p className="text-rose-600 font-bold dark:text-rose-400">
                        {new Intl.NumberFormat('vi-VN').format(contact.iOwe)}đ
                      </p>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
