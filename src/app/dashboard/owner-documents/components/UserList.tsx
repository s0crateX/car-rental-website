"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

// A simplified User interface for this component's needs
interface User {
  id: string;
  fullName: string;
  profileImageUrl: string;
}

interface UserListProps {
  users: User[];
  selectedUser: User | null;
  onUserSelect: (user: User) => void;
  className?: string;
}

export function UserList({ users, selectedUser, onUserSelect, className }: UserListProps) {
  return (
    <div className={className}>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        <CardContent>
          {users.length > 0 ? (
            users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center p-2 my-2 rounded-lg cursor-pointer hover:bg-accent ${
                  selectedUser?.id === user.id ? 'bg-accent' : ''
                }`}
                onClick={() => onUserSelect(user)}
              >
                <Avatar className="w-10 h-10 mr-4">
                  <AvatarImage src={user.profileImageUrl} alt={user.fullName} />
                  <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{user.fullName}</span>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full pt-10">
                <p className="text-muted-foreground">No pending approvals.</p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </div>
  );
}