import { useState, useEffect } from 'react';
import { useMember } from '@/integrations';
import { BaseCrudService } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Award,
  Shield,
  TrendingUp,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Upload,
} from 'lucide-react';
import { Certificates, Skills, CareerRecommendations } from '@/entities';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function DashboardPage() {
  const { member } = useMember();
  const [certificates, setCertificates] = useState<Certificates[]>([]);
  const [skills, setSkills] = useState<Skills[]>([]);
  const [careers, setCareers] = useState<CareerRecommendations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [certsData, skillsData, careersData] = await Promise.all([
        BaseCrudService.getAll<Certificates>('certificates'),
        BaseCrudService.getAll<Skills>('skills'),
        BaseCrudService.getAll<CareerRecommendations>('careerrecommendations'),
      ]);
      setCertificates(certsData.items);
      setSkills(skillsData.items);
      setCareers(careersData.items);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifiedCount = certificates.filter((c) => !c.fraudDetected).length;
  const fraudCount = certificates.filter((c) => c.fraudDetected).length;
  const avgScore =
    certificates.length > 0
      ? Math.round(
          certificates.reduce((sum, c) => sum + (c.verificationScore || 0), 0) / certificates.length
        )
      : 0;

  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryData = Object.entries(skillsByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const proficiencyData = skills.reduce((acc, skill) => {
    const level = skill.proficiencyLevel || 'Unknown';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const proficiencyChartData = Object.entries(proficiencyData).map(([name, count]) => ({
    name,
    count,
  }));

  const COLORS = ['#5C5CF6', '#6E6EFF', '#121212', '#5C5CF6'];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-secondary mb-4">
            Dashboard
          </h1>
          <p className="font-paragraph text-lg text-secondary/70">
            Welcome back, {member?.profile?.nickname || member?.contact?.firstName || 'User'}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm font-medium text-secondary/70">
                Total Certificates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="font-heading text-3xl font-bold text-secondary">
                  {certificates.length}
                </div>
                <Award className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm font-medium text-secondary/70">
                Verified
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="font-heading text-3xl font-bold text-secondary">
                  {verifiedCount}
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm font-medium text-secondary/70">
                Fraud Detected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="font-heading text-3xl font-bold text-secondary">{fraudCount}</div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accentbluelight">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm font-medium text-secondary/70">
                Avg. Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="font-heading text-3xl font-bold text-secondary">{avgScore}%</div>
                <BarChart3 className="w-8 h-8 text-accentbluelight" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Skills by Proficiency */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Skills by Proficiency Level</CardTitle>
            </CardHeader>
            <CardContent>
              {proficiencyChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={proficiencyChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="name" className="font-paragraph text-xs" />
                    <YAxis className="font-paragraph text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e5e5',
                        borderRadius: '4px',
                      }}
                    />
                    <Bar dataKey="count" fill="#5C5CF6" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-secondary/50 font-paragraph">
                  No skills data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Skills by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-xl">Skills by Category</CardTitle>
            </CardHeader>
            <CardContent>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-secondary/50 font-paragraph">
                  No category data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link to="/vault" className="block">
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Certificate
                </Button>
              </Link>
              <Link to="/skills" className="block">
                <Button
                  variant="outline"
                  className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground h-12"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  View Skills
                </Button>
              </Link>
              <Link to="/careers" className="block">
                <Button
                  variant="outline"
                  className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground h-12"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Career Paths
                </Button>
              </Link>
              <Link to="/vault" className="block">
                <Button
                  variant="outline"
                  className="w-full border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground h-12"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Verify Certificates
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Certificates */}
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-xl">Recent Certificates</CardTitle>
          </CardHeader>
          <CardContent>
            {certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.slice(0, 5).map((cert) => (
                  <div
                    key={cert._id}
                    className="flex items-center justify-between p-4 border border-secondary/10 hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 flex items-center justify-center">
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-heading text-base font-semibold text-secondary">
                          {cert.recipientName || 'Certificate'}
                        </h3>
                        <p className="font-paragraph text-sm text-secondary/70">
                          {cert.issuingBody || 'Unknown Issuer'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        className={
                          cert.fraudDetected
                            ? 'bg-red-500 text-white'
                            : 'bg-green-500 text-white'
                        }
                      >
                        {cert.fraudDetected ? 'Fraud Detected' : 'Verified'}
                      </Badge>
                      <span className="font-paragraph text-sm text-secondary/70">
                        Score: {cert.verificationScore || 0}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Award className="w-12 h-12 text-secondary/20 mx-auto mb-4" />
                <p className="font-paragraph text-base text-secondary/50 mb-4">
                  No certificates uploaded yet
                </p>
                <Link to="/vault">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Upload Your First Certificate
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
}
