"use client";

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Car } from '@/types/car';

interface CarListProps {
  cars: Car[];
  selectedCar: Car | null;
  onCarSelect: (car: Car) => void;
}

export function CarList({ cars, selectedCar, onCarSelect }: CarListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCars = cars.filter(car => 
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.carOwnerFullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <CardHeader>
        <CardTitle>Pending Car Approvals</CardTitle>
        <Input 
          placeholder="Search by brand, model, or owner..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-2"
        />
      </CardHeader>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <CardContent>
          {filteredCars.length > 0 ? (
            filteredCars.map((car) => (
              <div
                key={car.id}
                className={`flex items-center p-2 my-2 rounded-lg cursor-pointer hover:bg-accent ${selectedCar?.id === car.id ? 'bg-accent' : ''}`}
                onClick={() => onCarSelect(car)}
              >
                <Avatar className="w-16 h-16 mr-4 rounded-md">
                  <AvatarImage src={car.carImageGallery[0]} alt={`${car.brand} ${car.model}`} className="object-cover" />
                  <AvatarFallback>{car.brand.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                  <div className="font-semibold">{`${car.brand} ${car.model} ${car.year}`}</div>
                  <p className="text-sm text-muted-foreground">{car.carOwnerFullName}</p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
            ))
          ) : (
            <div className="flex items-center justify-center h-full pt-10">
                <p className="text-muted-foreground">No pending car approvals.</p>
            </div>
          )}
        </CardContent>
      </ScrollArea>
    </div>
  );
}