import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Search, Star, Wrench } from 'lucide-react';
import { Skills } from '@/entities';

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skills[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [proficiencyFilter, setProficiencyFilter] = useState('all');

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Skills>('skills');
      setSkills(items);
    } catch (error) {
      console.error('Error loading skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = Array.from(new Set(skills.map((s) => s.category).filter(Boolean)));
  const proficiencyLevels = Array.from(
    new Set(skills.map((s) => s.proficiencyLevel).filter(Boolean))
  );

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch =
      skill.skillName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter;
    const matchesProficiency =
      proficiencyFilter === 'all' || skill.proficiencyLevel === proficiencyFilter;
    return matchesSearch && matchesCategory && matchesProficiency;
  });

  const getProficiencyColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'expert':
        return 'bg-green-500 text-white';
      case 'advanced':
        return 'bg-primary text-primary-foreground';
      case 'intermediate':
        return 'bg-accentbluelight text-white';
      case 'beginner':
        return 'bg-secondary/20 text-secondary';
      default:
        return 'bg-secondary/10 text-secondary';
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
            Skills Analysis
          </h1>
          <p className="font-paragraph text-lg text-secondary/70">
            AI-extracted skills from your verified certificates
          </p>
        </div>

        {/* Filters */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary/40" />
            <Input
              type="text"
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 font-paragraph"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-12 font-paragraph">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category!}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={proficiencyFilter} onValueChange={setProficiencyFilter}>
            <SelectTrigger className="h-12 font-paragraph">
              <SelectValue placeholder="All Levels" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {proficiencyLevels.map((level) => (
                <SelectItem key={level} value={level!}>
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm font-medium text-secondary/70">
                Total Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="font-heading text-3xl font-bold text-secondary">
                  {skills.length}
                </div>
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm font-medium text-secondary/70">
                Core Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="font-heading text-3xl font-bold text-secondary">
                  {skills.filter((s) => s.isCoreSkill).length}
                </div>
                <Star className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-accentbluelight">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-sm font-medium text-secondary/70">
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="font-heading text-3xl font-bold text-secondary">
                  {categories.length}
                </div>
                <Wrench className="w-8 h-8 text-accentbluelight" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <Card key={skill._id} className="hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
                      {skill.skillName}
                      {skill.isCoreSkill && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skill.proficiencyLevel && (
                      <Badge className={getProficiencyColor(skill.proficiencyLevel)}>
                        {skill.proficiencyLevel}
                      </Badge>
                    )}
                    {skill.category && (
                      <Badge variant="outline" className="border-secondary/20 text-secondary">
                        {skill.category}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {skill.description && (
                    <p className="font-paragraph text-sm text-secondary/70 leading-relaxed">
                      {skill.description}
                    </p>
                  )}
                  {skill.relatedTools && (
                    <div>
                      <p className="font-paragraph text-xs text-secondary/60 mb-2">
                        Related Tools
                      </p>
                      <p className="font-paragraph text-sm text-secondary">{skill.relatedTools}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Brain className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-secondary mb-2">
                {searchQuery || categoryFilter !== 'all' || proficiencyFilter !== 'all'
                  ? 'No skills found'
                  : 'No skills extracted yet'}
              </h3>
              <p className="font-paragraph text-base text-secondary/70">
                {searchQuery || categoryFilter !== 'all' || proficiencyFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Upload certificates to extract your skills automatically'}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
