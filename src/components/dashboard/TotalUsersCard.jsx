'use client';
import { User } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export function TotalUsersCard() {
  const t = useTranslations('TotalUsersCard');
  const [totalUsers, setTotalUsers] = useState(null);

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await fetch("/api/user/total");
        const data = await res.json();
        setTotalUsers(data.totalUsers ?? 0);
      } catch (error) {
        console.error("Failed to fetch total users:", error);
        setTotalUsers("Error");
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="mt-10 p-6 rounded-xl shadow-xl bg-gradient-to-r from-primary to-teal-600 text-primary-foreground flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">{t('title')}</h2>
        <p className="text-3xl font-bold mt-1 text-teal-100">
          {totalUsers === null ? t('loading') : totalUsers}
        </p>
      </div>
      <User className="h-10 w-10 text-teal-100 opacity-90" />
    </div>
  );
}
