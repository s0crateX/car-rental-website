"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Preloader } from '@/components/common/preloader';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Users, Car, FileText, DollarSign } from 'lucide-react';

interface User {
  id: string;
  fullName: string;
  email: string;
  profileImageUrl: string;
  createdAt: { toDate: () => Date };
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    pendingUserDocs: 0,
    pendingCarApprovals: 0,
  });
  const [recentUsers, setRecentUsers] = useState<User[]>([]);
  const [userGrowthData, setUserGrowthData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch users
        const usersQuery = query(collection(db, 'users'), where('userRole', 'in', ['customer', 'car_owner']));
        const usersSnapshot = await getDocs(usersQuery);
        const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
        setStats(prev => ({ ...prev, totalUsers: usersSnapshot.size }));
        setRecentUsers(usersData.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()).slice(0, 5));

        // Process user growth data
        const monthlyUserData = usersData.reduce((acc, user) => {
          const month = user.createdAt.toDate().toLocaleString('default', { month: 'short' });
          acc[month] = (acc[month] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const chartData = Object.keys(monthlyUserData).map(month => ({
          name: month,
          total: monthlyUserData[month],
        }));
        setUserGrowthData(chartData);

        // Fetch cars
        const carsQuery = query(collection(db, 'Cars'));
        const carsSnapshot = await getDocs(carsQuery);
        const pendingCars = carsSnapshot.docs.filter(doc => doc.data().verificationStatus === 'pending').length;
        setStats(prev => ({ ...prev, totalCars: carsSnapshot.size, pendingCarApprovals: pendingCars }));

        // Fetch pending user documents
        const pendingDocsUsers = usersData.filter(user => {
            const documents = (user as any).documents;
            if (!documents) return false;
            return Object.values(documents).some((doc: any) => doc.status === 'pending');
        });
        setStats(prev => ({ ...prev, pendingUserDocs: pendingDocsUsers.length }));

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-[calc(100vh-8rem)]"><Preloader className="w-24 h-24" /></div>;
  }



  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCars}</div>
            <p className="text-xs text-muted-foreground">Total cars in the fleet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingUserDocs}</div>
            <p className="text-xs text-muted-foreground">User documents awaiting verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCarApprovals}</div>
            <p className="text-xs text-muted-foreground">Cars awaiting approval</p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={userGrowthData}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div className="flex items-center" key={user.id}>
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profileImageUrl} alt="Avatar" />
                    <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-muted-foreground">
                    {user.createdAt.toDate().toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}