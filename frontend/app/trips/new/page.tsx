'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert } from '@/components/ui/alert';
import api from '@/lib/api';

const INTEREST_OPTIONS = [
  'Food',
  'Culture',
  'Adventure',
  'Shopping',
  'Nature',
  'History',
  'Nightlife',
  'Relaxation',
  'Photography',
  'Sports'
];

export default function NewTripPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    destination: '',
    numberOfDays: 3,
    budgetType: 'Medium' as 'Low' | 'Medium' | 'High',
    interests: [] as string[]
  });

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.interests.length === 0) {
      setError('Please select at least one interest');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/trips', formData);
      const tripId = response.data.data.trip._id;
      router.push(`/trips/${tripId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create trip. Please try again.');
      setLoading(false);
    }
  };

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
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Create New Trip</CardTitle>
            <CardDescription>
              Tell us about your travel plans and we&apos;ll generate a personalized itinerary
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  {error}
                </Alert>
              )}

              {/* Destination */}
              <div className="space-y-2">
                <Label htmlFor="destination">Destination *</Label>
                <Input
                  id="destination"
                  placeholder="e.g., Tokyo, Paris, New York"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  required
                />
              </div>

              {/* Number of Days */}
              <div className="space-y-2">
                <Label htmlFor="numberOfDays">Number of Days *</Label>
                <Input
                  id="numberOfDays"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.numberOfDays}
                  onChange={(e) => setFormData({ ...formData, numberOfDays: parseInt(e.target.value) })}
                  required
                />
              </div>

              {/* Budget Type */}
              <div className="space-y-2">
                <Label htmlFor="budgetType">Budget Type *</Label>
                <Select
                  value={formData.budgetType}
                  onValueChange={(value: 'Low' | 'Medium' | 'High') => 
                    setFormData({ ...formData, budgetType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low - Budget-friendly</SelectItem>
                    <SelectItem value="Medium">Medium - Comfortable</SelectItem>
                    <SelectItem value="High">High - Luxury</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interests */}
              <div className="space-y-3">
                <Label>Interests * (Select at least one)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {INTEREST_OPTIONS.map((interest) => (
                    <div key={interest} className="flex items-center space-x-2">
                      <Checkbox
                        id={interest}
                        checked={formData.interests.includes(interest)}
                        onCheckedChange={() => handleInterestToggle(interest)}
                      />
                      <label
                        htmlFor={interest}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {interest}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Generating your trip... This may take a minute
                  </span>
                ) : (
                  'Generate Trip with AI'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
