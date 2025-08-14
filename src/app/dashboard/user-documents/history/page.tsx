"use client";

import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy, Timestamp } from 'firebase/firestore';
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
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { format } from 'date-fns';
import { Preloader } from '@/components/common/preloader';
import { Download, ChevronDown, ChevronUp, Eye, X } from 'lucide-react';
import { ImageZoomModal } from '@/components/common/ImageZoomModal';
import Image from 'next/image';

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

export default function ApprovalHistoryPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set());
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    const usersRef = collection(db, 'users');
    const q = query(
      usersRef,
      where('userRole', '==', 'customer'),
      where('lastDocumentUpdate', '!=', null),
      orderBy('lastDocumentUpdate', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const processedUsers: User[] = [];
      
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as Omit<User, 'id'>;
        const documents = userData.documents as { [key: string]: Document };
        
        if (documents) {
          const hasProcessedDocument = Object.values(documents).some(
            (doc): doc is Document => doc && (doc.status === 'verified' || doc.status === 'rejected')
          );

          if (hasProcessedDocument) {
            processedUsers.push({
                id: doc.id,
                ...userData,
                lastDocumentUpdate: userData.lastDocumentUpdate || undefined
              });
          }
        }
      });
      
      setUsers(processedUsers);
      setFilteredUsers(processedUsers);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching users:', error);
      setLoading(false);
    });

    return () => unsubscribe();
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
    if (dateRange && dateRange.from && dateRange.to) {
      filtered = filtered.filter(user => {
        if (!user.lastDocumentUpdate) return false;
        const updateDate = user.lastDocumentUpdate.toDate();
        if (dateRange && dateRange.from && dateRange.to) {
          return updateDate >= dateRange.from && updateDate <= dateRange.to;
        }
        return false;
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
    link.setAttribute('download', `approval-history-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getUserStatus = (user: User) => {
    return Object.values(user.documents).every(doc => doc?.status === 'verified') ? 'verified' : 'rejected';
  };

  const openImageModal = (url: string, title: string) => {
    setSelectedImage({ url, title });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen"><Preloader className="w-24 h-24" /></div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold">Approval History</h1>
        <Button onClick={exportToCSV} variant="outline" className="w-full sm:w-auto">
          <Download className="w-4 h-4 mr-2" />
          Export to CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <Input
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
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
        <div className="sm:col-span-2 lg:col-span-1">
          <DatePickerWithRange
            value={dateRange}
            onChange={setDateRange}
          />
        </div>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg sm:text-xl">Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
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
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={user.profileImageUrl} alt={user.fullName} />
                              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium text-sm">{user.fullName}</div>
                              <div className="text-xs text-muted-foreground">{user.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getUserStatus(user) === 'verified' ? (
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                              Verified ✅
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Rejected ❌</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {user.lastDocumentUpdate
                            ? format(user.lastDocumentUpdate.toDate(), 'MMM dd, yyyy')
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleUserExpanded(user.id)}
                            className="text-xs"
                          >
                            {expandedUsers.has(user.id) ? (
                              <>Hide <ChevronUp className="w-3 h-3 ml-1" /></>
                            ) : (
                              <>View <ChevronDown className="w-3 h-3 ml-1" /></>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedUsers.has(user.id) && (
                        <TableRow>
                          <TableCell colSpan={4} className="p-0">
                            <div className="p-3 bg-muted/30 border-t">
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2">
                                {Object.entries(user.documents).map(([key, value]) => (
                                  <Card key={key} className="overflow-hidden">
                                    <CardHeader className="py-1.5 px-2">
                                      <CardTitle className="text-xs capitalize truncate">
                                        {key.replace(/_/g, ' ')}
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-2 pt-0">
                                      <div className="aspect-[3/2] bg-muted rounded-md mb-2 overflow-hidden relative group cursor-pointer" onClick={() => value && openImageModal(value.url, key.replace(/_/g, ' '))}>
                                        {value && (
                                          <>
                                            <Image 
                                              src={value.url} 
                                              alt={key.replace(/_/g, ' ')} 
                                              fill
                                              className="object-cover transition-transform group-hover:scale-105" 
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                              <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                          </>
                                        )}
                                      </div>
                                      <div className="space-y-1">
                                        <div className="flex items-center justify-center">
                                          <Badge
                                            variant={value?.status === 'verified' ? 'default' : 'destructive'}
                                            className={`text-xs ${value?.status === 'verified' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}`}
                                          >
                                            {value?.status}
                                          </Badge>
                                        </div>
                                        {value?.rejectionReason && (
                                          <div className="text-xs">
                                            <p className="text-muted-foreground text-center truncate" title={value.rejectionReason}>
                                              {value.rejectionReason}
                                            </p>
                                          </div>
                                        )}
                                        {value?.updatedAt && (
                                          <div className="text-xs text-muted-foreground text-center">
                                            {format(value.updatedAt.toDate(), 'MMM dd')}
                                          </div>
                                        )}
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            <ScrollArea className="h-[calc(100vh-16rem)] px-4">
              <div className="space-y-3 pb-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <Avatar className="w-10 h-10 flex-shrink-0">
                            <AvatarImage src={user.profileImageUrl} alt={user.fullName} />
                            <AvatarFallback className="text-sm">{user.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <div className="font-medium text-sm truncate">{user.fullName}</div>
                            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserExpanded(user.id)}
                          className="flex-shrink-0 p-1 h-8 w-8"
                        >
                          {expandedUsers.has(user.id) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Status:</span>
                          {getUserStatus(user) === 'verified' ? (
                            <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                              Verified ✅
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="text-xs">Rejected ❌</Badge>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.lastDocumentUpdate
                            ? format(user.lastDocumentUpdate.toDate(), 'MMM dd, yyyy')
                            : 'N/A'}
                        </div>
                      </div>

                      {/* Expanded Documents View */}
                      <Collapsible open={expandedUsers.has(user.id)}>
                        <CollapsibleContent className="mt-4 pt-4 border-t">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(user.documents).map(([key, value]) => (
                              <Card key={key} className="overflow-hidden">
                                <CardHeader className="py-2 px-3">
                                  <CardTitle className="text-xs capitalize">
                                    {key.replace(/_/g, ' ')}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="p-3 pt-0">
                                  <div className="aspect-[4/3] bg-muted rounded-md mb-2 overflow-hidden relative group cursor-pointer" onClick={() => value && openImageModal(value.url, key.replace(/_/g, ' '))}>
                                    {value && (
                                      <>
                                        <Image 
                                          src={value.url} 
                                          alt={key.replace(/_/g, ' ')} 
                                          fill
                                          className="object-cover transition-transform group-hover:scale-105" 
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                          <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                      <Badge
                                        variant={value?.status === 'verified' ? 'default' : 'destructive'}
                                        className={`text-xs ${value?.status === 'verified' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''}`}
                                      >
                                        {value?.status}
                                      </Badge>
                                    </div>
                                    {value?.rejectionReason && (
                                      <div className="text-xs">
                                        <p className="text-muted-foreground font-medium">Reason:</p>
                                        <p className="text-muted-foreground mt-1 break-words">{value.rejectionReason}</p>
                                      </div>
                                    )}
                                    {value?.updatedAt && (
                                      <div className="text-xs text-muted-foreground">
                                        {format(value.updatedAt.toDate(), 'MMM dd, HH:mm')}
                                      </div>
                                    )}
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              <p>No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Image Modal */}
      {selectedImage && (
        <ImageZoomModal
          isOpen={!!selectedImage}
          onClose={closeImageModal}
          imageUrl={selectedImage.url}
        />
      )}
    </div>
  );
}