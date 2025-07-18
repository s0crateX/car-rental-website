"use client";

import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { format } from 'date-fns';
import { Preloader } from '@/components/common/preloader';
import { Download } from 'lucide-react';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface Document {
  url: string;
  status: string;
  rejectionReason?: string;
  updatedAt?: Timestamp;
}

interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: string;
  documents: {
    [key: string]: Document | undefined;
  };
  lastDocumentUpdate?: Timestamp;
}

type FilterStatus = 'all' | 'verified' | 'rejected';

export default function OwnerApprovalHistoryPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('userRole', '==', 'car_owner'),
        where('lastDocumentUpdate', '!=', null),
        orderBy('lastDocumentUpdate', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const processedUsers: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        const documents = userData.documents;
        
        if (documents) {
          const hasProcessedDocument = Object.values(documents).some(
            (doc) => doc.status === 'verified' || doc.status === 'rejected'
          );

          if (hasProcessedDocument) {
            processedUsers.push({
              id: doc.id,
              ...userData,
              lastDocumentUpdate: userData.lastDocumentUpdate || null
            });
          }
        }
      });
      
      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = [...users];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(user => {
        const documents = Object.values(user.documents);
        return documents.every(doc => doc?.status === filterStatus);
      });
    }

    // Apply date range filter
    if (dateRange?.from && dateRange?.to) {
      filtered = filtered.filter(user => {
        if (!user.lastDocumentUpdate) return false;
        const updateDate = user.lastDocumentUpdate.toDate();
        return updateDate >= dateRange.from && updateDate <= dateRange.to;
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, filterStatus, dateRange]);

  const toggleUserExpanded = (userId: string) => {
    const newExpanded = new Set(expandedUsers);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedUsers(newExpanded);
  };

  const exportToCSV = () => {
    const headers = ['Full Name', 'Email', 'Status', 'Last Update'];
    const data = filteredUsers.map(user => [
      user.fullName,
      user.email,
      Object.values(user.documents).every(doc => doc?.status === 'verified') ? 'Verified' : 'Rejected',
      user.lastDocumentUpdate ? format(user.lastDocumentUpdate.toDate(), 'PPpp') : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `owner-approval-history-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Preloader className="w-24 h-24" /></div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Owner Approval History</h1>
        <Button onClick={exportToCSV} variant="outline" className="w-full md:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export to CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex-1">
          <Select value={filterStatus} onValueChange={(value: FilterStatus) => setFilterStatus(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="rejected">Rejected Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <DatePickerWithRange
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Car Owners ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-20rem)]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <React.Fragment key={user.id}>
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={user.profileImageUrl} alt={user.fullName} />
                            <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {Object.values(user.documents).every(doc => doc?.status === 'verified') ? (
                          <Badge variant="success">Verified ✅</Badge>
                        ) : (
                          <Badge variant="destructive">Rejected ❌</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.lastDocumentUpdate
                          ? format(user.lastDocumentUpdate.toDate(), 'PPpp')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleUserExpanded(user.id)}>
                          {expandedUsers.has(user.id) ? 'Hide Details' : 'View Details'}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedUsers.has(user.id) && (
                      <TableRow>
                        <TableCell colSpan={4} className="p-0">
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3 bg-muted/50">
                            {Object.entries(user.documents).map(([key, value]) => (
                              <Card key={key} className="overflow-hidden">
                                <CardHeader className="py-2">
                                  <CardTitle className="text-sm capitalize">{key.replace(/_/g, ' ')}</CardTitle>
                                </CardHeader>
                                <CardContent className="p-2">
                                  <TransformWrapper>
                                    <TransformComponent>
                                      <img src={value?.url} alt={key} className="object-cover w-full rounded-md h-32" />
                                    </TransformComponent>
                                  </TransformWrapper>
                                  <div className="mt-4 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="text-sm font-medium">Status:</span>
                                      <Badge
                                        variant={value?.status === 'verified' ? 'success' : 'destructive'}
                                      >
                                        {value?.status}
                                      </Badge>
                                    </div>
                                    {value?.rejectionReason && (
                                      <div className="text-sm text-muted-foreground">
                                        <span className="font-medium">Rejection Reason:</span>
                                        <p className="mt-1">{value.rejectionReason}</p>
                                      </div>
                                    )}
                                    {value?.updatedAt && (
                                      <div className="text-sm text-muted-foreground">
                                        <span className="font-medium">Updated At:</span>
                                        <p className="mt-1">{format(value.updatedAt.toDate(), 'PPpp')}</p>
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}