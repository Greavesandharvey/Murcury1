import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
});

const passwordSchema = z.object({
  current_password: z.string().min(8, 'Password must be at least 8 characters'),
  new_password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const fetchProfile = async () => {
  const response = await fetch('/api/profile');
  if (!response.ok) throw new Error('Failed to fetch profile');
  return response.json();
};

const updateProfile = async (data: ProfileFormData) => {
  const response = await fetch('/api/profile', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update profile');
  return response.json();
};

const changePassword = async (data: { current_password: string; new_password: string }) => {
  const response = await fetch('/api/profile/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to change password');
  return response.json();
};

export default function Profile() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (profile) {
      profileForm.reset({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
      });
    }
  }, [profile, profileForm]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({ title: 'Profile updated successfully' });
    },
    onError: (error) => {
      toast({ title: 'Error updating profile', description: error.message, variant: 'destructive' });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast({ title: 'Password changed successfully' });
      passwordForm.reset();
    },
    onError: (error) => {
      toast({ title: 'Error changing password', description: error.message, variant: 'destructive' });
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    updateMutation.mutate(data);
  };

  const onPasswordSubmit = (data: PasswordFormData) => {
    passwordMutation.mutate({
      current_password: data.current_password,
      new_password: data.new_password,
    });
  };

  if (isLoading) return <div>Loading profile...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input id="first_name" {...profileForm.register('first_name')} />
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input id="last_name" {...profileForm.register('last_name')} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...profileForm.register('email')} />
            </div>
            <Button type="submit">Update Profile</Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="current_password">Current Password</Label>
              <Input id="current_password" type="password" {...passwordForm.register('current_password')} />
            </div>
            <div>
              <Label htmlFor="new_password">New Password</Label>
              <Input id="new_password" type="password" {...passwordForm.register('new_password')} />
            </div>
            <div>
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <Input id="confirm_password" type="password" {...passwordForm.register('confirm_password')} />
            </div>
            <Button type="submit">Change Password</Button>
          </form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Username: {profile?.username}</p>
          <p>Role: {profile?.role}</p>
          {/* Add more account settings here */}
        </CardContent>
      </Card>
    </div>
  );
}
