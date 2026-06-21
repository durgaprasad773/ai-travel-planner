'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import api from '@/lib/api';
import { Trip, Activity } from '@/lib/types';

export default function TripDetailPage({ params }: { params: { id: string } }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'hotels'>('itinerary');
  
  // Add activity dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [newActivity, setNewActivity] = useState<Partial<Activity>>({
    name: '',
    description: '',
    time: '',
    cost: 0
  });

  // Regenerate day dialog state
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [regenerateRequirements, setRegenerateRequirements] = useState('');
  const [regenerateLoading, setRegenerateLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchTrip();
    }
  }, [user, params.id]);

  const fetchTrip = async () => {
    try {
      const response = await api.get<{ success: boolean; data: { trip: Trip } }>(`/trips/${params.id}`);
      setTrip(response.data.data.trip);
    } catch (error) {
      console.error('Failed to fetch trip:', error);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async () => {
    if (!trip || selectedDay === null) return;

    try {
      await api.post(`/trips/${trip._id}/days/${selectedDay}/activities`, newActivity);
      await fetchTrip();
      setAddDialogOpen(false);
      setNewActivity({ name: '', description: '', time: '', cost: 0 });
    } catch (error) {
      console.error('Failed to add activity:', error);
    }
  };

  const handleRemoveActivity = async (dayNumber: number, activityIndex: number) => {
    if (!trip) return;
    if (!confirm('Are you sure you want to remove this activity?')) return;

    try {
      await api.delete(`/trips/${trip._id}/days/${dayNumber}/activities/${activityIndex}`);
      await fetchTrip();
    } catch (error) {
      console.error('Failed to remove activity:', error);
    }
  };

  const handleRegenerateDay = async () => {
    if (!trip || selectedDay === null) return;

    setRegenerateLoading(true);
    try {
      await api.post(`/trips/${trip._id}/days/${selectedDay}/regenerate`, {
        requirements: regenerateRequirements
      });
      await fetchTrip();
      setRegenerateDialogOpen(false);
      setRegenerateRequirements('');
    } catch (error) {
      console.error('Failed to regenerate day:', error);
    } finally {
      setRegenerateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading trip...</p>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Travel Planner</h1>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Trip Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-4xl font-bold mb-2">{trip.destination}</h2>
              <p className="text-gray-600 text-lg">
                {trip.numberOfDays} {trip.numberOfDays === 1 ? 'day' : 'days'} • {trip.budgetType} Budget
              </p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              ${trip.budget.total.toLocaleString()}
            </Badge>
          </div>
          <div className="flex gap-2 flex-wrap">
            {trip.interests.map((interest) => (
              <Badge key={interest} variant="outline">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          <button
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'itinerary'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('itinerary')}
          >
            Itinerary
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'budget'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('budget')}
          >
            Budget
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'hotels'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            onClick={() => setActiveTab('hotels')}
          >
            Hotels
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            {trip.itinerary.map((day) => (
              <Card key={day.day}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Day {day.day}: {day.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedDay(day.day)}
                          >
                            + Add Activity
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Activity to Day {day.day}</DialogTitle>
                            <DialogDescription>
                              Add a custom activity to your itinerary
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="activityName">Activity Name</Label>
                              <Input
                                id="activityName"
                                value={newActivity.name}
                                onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
                              />
                            </div>
                            <div>
                              <Label htmlFor="activityDescription">Description</Label>
                              <Textarea
                                id="activityDescription"
                                value={newActivity.description}
                                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="activityTime">Time (optional)</Label>
                                <Input
                                  id="activityTime"
                                  placeholder="e.g., 10:00 AM"
                                  value={newActivity.time}
                                  onChange={(e) => setNewActivity({ ...newActivity, time: e.target.value })}
                                />
                              </div>
                              <div>
                                <Label htmlFor="activityCost">Cost (optional)</Label>
                                <Input
                                  id="activityCost"
                                  type="number"
                                  placeholder="USD"
                                  value={newActivity.cost}
                                  onChange={(e) => setNewActivity({ ...newActivity, cost: parseFloat(e.target.value) })}
                                />
                              </div>
                            </div>
                            <Button onClick={handleAddActivity} className="w-full">
                              Add Activity
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => setSelectedDay(day.day)}
                          >
                            🔄 Regenerate
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Regenerate Day {day.day}</DialogTitle>
                            <DialogDescription>
                              Provide specific requirements for regenerating this day
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="requirements">Requirements</Label>
                              <Textarea
                                id="requirements"
                                placeholder="e.g., More outdoor activities, Include a museum visit"
                                value={regenerateRequirements}
                                onChange={(e) => setRegenerateRequirements(e.target.value)}
                              />
                            </div>
                            <Button
                              onClick={handleRegenerateDay}
                              className="w-full"
                              disabled={regenerateLoading}
                            >
                              {regenerateLoading ? 'Regenerating...' : 'Regenerate Day'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {day.activities.map((activity, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{activity.name}</h4>
                              {activity.time && (
                                <Badge variant="outline" className="text-xs">
                                  {activity.time}
                                </Badge>
                              )}
                              {activity.cost && (
                                <Badge variant="secondary" className="text-xs">
                                  ${activity.cost}
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600 text-sm">{activity.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveActivity(day.day, index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            ✕
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'budget' && (
          <Card>
            <CardHeader>
              <CardTitle>Budget Breakdown</CardTitle>
              <CardDescription>Estimated costs for your trip</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">✈️ Flights</span>
                  <span className="text-lg">${trip.budget.flights.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">🏨 Accommodation</span>
                  <span className="text-lg">${trip.budget.accommodation.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">🍽️ Food</span>
                  <span className="text-lg">${trip.budget.food.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">🎭 Activities</span>
                  <span className="text-lg">${trip.budget.activities.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b">
                  <span className="font-medium">💼 Miscellaneous</span>
                  <span className="text-lg">${trip.budget.miscellaneous.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-blue-50 px-4 rounded-lg">
                  <span className="font-bold text-lg">Total Estimated Budget</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ${trip.budget.total.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'hotels' && (
          <div className="grid md:grid-cols-2 gap-6">
            {trip.hotels.map((hotel, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{hotel.name}</CardTitle>
                    {hotel.rating && (
                      <Badge variant="secondary">⭐ {hotel.rating}/5</Badge>
                    )}
                  </div>
                  <CardDescription>{hotel.category}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Price Range:</span>
                      <span className="text-green-600">{hotel.priceRange}</span>
                    </div>
                    {hotel.description && (
                      <p className="text-gray-600 text-sm">{hotel.description}</p>
                    )}
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
