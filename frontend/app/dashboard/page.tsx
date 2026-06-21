'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { Trip } from '@/lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, logout, loading: authLoading } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchTrips();
    }
  }, [user, authLoading, router]);

  const fetchTrips = async () => {
    try {
      const response = await api.get<{ success: boolean; data: { trips: Trip[] } }>('/trips');
      setTrips(response.data.data.trips);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter(trip => trip._id !== id));
    } catch (error) {
      console.error('Failed to delete trip:', error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Travel Planner</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Hi, {user.name}</span>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">My Trips</h2>
            <p className="text-gray-600">Plan and manage your travel adventures</p>
          </div>
          <Link href="/trips/new">
            <Button size="lg">
              + Create New Trip
            </Button>
          </Link>
        </div>

        {trips.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-gray-400 mb-4 text-5xl">🌍</div>
              <h3 className="text-xl font-semibold mb-2">No trips yet</h3>
              <p className="text-gray-600 mb-4">
                Start planning your first adventure with AI assistance
              </p>
              <Link href="/trips/new">
                <Button>Create Your First Trip</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <Card key={trip._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{trip.destination}</CardTitle>
                      <CardDescription>
                        {trip.numberOfDays} {trip.numberOfDays === 1 ? 'day' : 'days'}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{trip.budgetType}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Budget:</span> ${trip.budget.total.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">Interests:</span>{' '}
                      {trip.interests.slice(0, 3).join(', ')}
                      {trip.interests.length > 3 && '...'}
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Link href={`/trips/${trip._id}`} className="flex-1">
                        <Button variant="default" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        onClick={() => deleteTrip(trip._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
