import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { TrendingUp, DollarSign, Briefcase, Target } from 'lucide-react';
import { CareerRecommendations } from '@/entities';

export default function CareersPage() {
  const [careers, setCareers] = useState<CareerRecommendations[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCareers();
  }, []);

  const loadCareers = async () => {
    try {
      const { items } = await BaseCrudService.getAll<CareerRecommendations>('careerrecommendations');
      setCareers(items);
    } catch (error) {
      console.error('Error loading careers:', error);
    } finally {
      setLoading(false);
    }
  };

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
            Career Recommendations
          </h1>
          <p className="font-paragraph text-lg text-secondary/70">
            AI-powered career paths based on your verified skills and certificates
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm font-medium text-secondary/70">
                Career Paths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="font-heading text-3xl font-bold text-secondary">
                  {careers.length}
                </div>
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm font-medium text-secondary/70">
                Match Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="font-heading text-3xl font-bold text-secondary">85%</div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accentbluelight">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm font-medium text-secondary/70">
                Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="font-heading text-3xl font-bold text-secondary">
                  {careers.length * 3}
                </div>
                <Briefcase className="w-8 h-8 text-accentbluelight" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Careers Grid */}
        {careers.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {careers.map((career) => (
              <Card key={career._id} className="hover:border-primary/30 transition-colors overflow-hidden">
                {career.careerImage && (
                  <div className="aspect-video bg-secondary/5 overflow-hidden">
                    <Image
                      src={career.careerImage}
                      alt={career.title || 'Career'}
                      width={800}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-heading text-2xl">{career.title}</CardTitle>
                  {career.averageSalaryRange && (
                    <div className="flex items-center gap-2 text-green-600 mt-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-paragraph text-sm font-semibold">
                        {career.averageSalaryRange}
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  {career.description && (
                    <div>
                      <h3 className="font-heading text-sm font-semibold text-secondary/70 mb-2">
                        Overview
                      </h3>
                      <p className="font-paragraph text-base text-secondary/80 leading-relaxed">
                        {career.description}
                      </p>
                    </div>
                  )}

                  {career.requiredSkills && (
                    <div>
                      <h3 className="font-heading text-sm font-semibold text-secondary/70 mb-3">
                        Required Skills
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {career.requiredSkills.split(',').map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-primary/30 text-primary"
                          >
                            {skill.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {career.jobMarketOutlook && (
                    <div>
                      <h3 className="font-heading text-sm font-semibold text-secondary/70 mb-2">
                        Job Market Outlook
                      </h3>
                      <p className="font-paragraph text-base text-secondary/80 leading-relaxed">
                        {career.jobMarketOutlook}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <TrendingUp className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-secondary mb-2">
                No career recommendations yet
              </h3>
              <p className="font-paragraph text-base text-secondary/70">
                Upload certificates and build your skill profile to receive personalized career recommendations
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
