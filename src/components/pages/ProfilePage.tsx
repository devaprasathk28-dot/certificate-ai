import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Calendar, Shield } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { member } = useMember();

  const getInitials = () => {
    const firstName = member?.contact?.firstName || '';
    const lastName = member?.contact?.lastName || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || 'U';
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'BLOCKED':
        return 'bg-red-500';
      default:
        return 'bg-secondary/20';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <div className="mb-8">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-secondary mb-4">
            Profile
          </h1>
          <p className="font-paragraph text-lg text-secondary/70">
            Manage your account information and settings
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="w-24 h-24 mb-4">
                  <AvatarImage src={member?.profile?.photo?.url} alt="Profile" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-heading">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <h2 className="font-heading text-2xl font-semibold text-secondary mb-2">
                  {member?.profile?.nickname ||
                    `${member?.contact?.firstName || ''} ${member?.contact?.lastName || ''}`.trim() ||
                    'User'}
                </h2>
                {member?.profile?.title && (
                  <p className="font-paragraph text-sm text-secondary/70 mb-3">
                    {member.profile.title}
                  </p>
                )}
                <Badge className={`${getStatusColor(member?.status)} text-white`}>
                  {member?.status || 'UNKNOWN'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Information Card */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-heading text-xl">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Email */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <Mail className="w-4 h-4" />
                    <span className="font-paragraph text-sm font-semibold">Email</span>
                  </div>
                  <p className="font-paragraph text-base text-secondary pl-6">
                    {member?.loginEmail || 'Not provided'}
                  </p>
                  {member?.loginEmailVerified && (
                    <Badge variant="outline" className="ml-6 text-xs">
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Name */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <User className="w-4 h-4" />
                    <span className="font-paragraph text-sm font-semibold">Full Name</span>
                  </div>
                  <p className="font-paragraph text-base text-secondary pl-6">
                    {`${member?.contact?.firstName || ''} ${member?.contact?.lastName || ''}`.trim() ||
                      'Not provided'}
                  </p>
                </div>

                {/* Member Since */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <Calendar className="w-4 h-4" />
                    <span className="font-paragraph text-sm font-semibold">Member Since</span>
                  </div>
                  <p className="font-paragraph text-base text-secondary pl-6">
                    {member?._createdDate
                      ? format(new Date(member._createdDate), 'MMMM d, yyyy')
                      : 'Unknown'}
                  </p>
                </div>

                {/* Last Login */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <Shield className="w-4 h-4" />
                    <span className="font-paragraph text-sm font-semibold">Last Login</span>
                  </div>
                  <p className="font-paragraph text-base text-secondary pl-6">
                    {member?.lastLoginDate
                      ? format(new Date(member.lastLoginDate), 'MMMM d, yyyy')
                      : 'Unknown'}
                  </p>
                </div>
              </div>

              {/* Phone Numbers */}
              {member?.contact?.phones && member.contact.phones.length > 0 && (
                <div className="space-y-2 pt-4 border-t border-secondary/10">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <span className="font-paragraph text-sm font-semibold">Phone Numbers</span>
                  </div>
                  <div className="space-y-1">
                    {member.contact.phones.map((phone, index) => (
                      <p key={index} className="font-paragraph text-base text-secondary pl-6">
                        {phone}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
