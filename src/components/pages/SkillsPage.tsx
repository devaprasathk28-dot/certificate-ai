import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Brain, Search, Star, Wrench, Plus, Trash2 } from 'lucide-react';
import { Skills } from '@/entities';
import { Toaster } from '@/components/ui/toaster';

export default function SkillsPage() {
  const { toast } = useToast();
  const [skills, setSkills] = useState<Skills[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [proficiencyFilter, setProficiencyFilter] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    skillName: '',
    description: '',
    category: '',
    proficiencyLevel: 'Intermediate',
    relatedTools: '',
    isCoreSkill: false,
  });

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

  const handleAddSkill = async () => {
    if (!formData.skillName || !formData.category) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in skill name and category.',
        variant: 'destructive',
      });
      return;
    }

    setAdding(true);
    try {
      const newSkill: Skills = {
        _id: crypto.randomUUID(),
        skillName: formData.skillName,
        description: formData.description,
        category: formData.category,
        proficiencyLevel: formData.proficiencyLevel,
        relatedTools: formData.relatedTools,
        isCoreSkill: formData.isCoreSkill,
      };

      await BaseCrudService.create('skills', newSkill);
      
      // Optimistic update
      setSkills([newSkill, ...skills]);
      
      toast({
        title: 'Skill Added',
        description: 'Your skill has been successfully added to your profile.',
      });
      
      setAddDialogOpen(false);
      setFormData({
        skillName: '',
        description: '',
        category: '',
        proficiencyLevel: 'Intermediate',
        relatedTools: '',
        isCoreSkill: false,
      });
    } catch (error) {
      console.error('Error adding skill:', error);
      toast({
        title: 'Add Failed',
        description: 'Failed to add skill. Please try again.',
        variant: 'destructive',
      });
      loadSkills(); // Reload on failure
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    
    // Optimistic update
    setSkills(skills.filter((s) => s._id !== id));
    
    try {
      await BaseCrudService.delete('skills', id);
      toast({
        title: 'Skill Deleted',
        description: 'The skill has been removed from your profile.',
      });
    } catch (error) {
      console.error('Error deleting skill:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete skill. Please try again.',
        variant: 'destructive',
      });
      loadSkills(); // Reload on failure
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
        <div className="grid md:grid-cols-4 gap-4 mb-8">
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

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12">
                <Plus className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">Add New Skill</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="skillName" className="font-paragraph text-sm font-semibold">
                    Skill Name *
                  </Label>
                  <Input
                    id="skillName"
                    value={formData.skillName}
                    onChange={(e) => setFormData({ ...formData, skillName: e.target.value })}
                    placeholder="e.g., Python Programming, Project Management"
                    className="font-paragraph"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category" className="font-paragraph text-sm font-semibold">
                    Category *
                  </Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Programming, Design, Management"
                    className="font-paragraph"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proficiencyLevel" className="font-paragraph text-sm font-semibold">
                    Proficiency Level
                  </Label>
                  <Select
                    value={formData.proficiencyLevel}
                    onValueChange={(value) => setFormData({ ...formData, proficiencyLevel: value })}
                  >
                    <SelectTrigger className="font-paragraph">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="font-paragraph text-sm font-semibold">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your experience with this skill..."
                    className="font-paragraph min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relatedTools" className="font-paragraph text-sm font-semibold">
                    Related Tools/Technologies
                  </Label>
                  <Input
                    id="relatedTools"
                    value={formData.relatedTools}
                    onChange={(e) => setFormData({ ...formData, relatedTools: e.target.value })}
                    placeholder="e.g., VS Code, Git, Docker"
                    className="font-paragraph"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isCoreSkill"
                    checked={formData.isCoreSkill}
                    onChange={(e) => setFormData({ ...formData, isCoreSkill: e.target.checked })}
                    className="w-4 h-4 text-primary border-secondary/20 rounded focus:ring-primary"
                  />
                  <Label htmlFor="isCoreSkill" className="font-paragraph text-sm cursor-pointer">
                    Mark as Core Skill
                  </Label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleAddSkill}
                    disabled={adding}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {adding ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Skill
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setAddDialogOpen(false)}
                    disabled={adding}
                    className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
              <Card key={skill._id} className="hover:border-primary/30 transition-colors relative">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="font-heading text-lg flex items-center gap-2">
                      {skill.skillName}
                      {skill.isCoreSkill && (
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      )}
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteSkill(skill._id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50 -mt-2 -mr-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
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
              <p className="font-paragraph text-base text-secondary/70 mb-6">
                {searchQuery || categoryFilter !== 'all' || proficiencyFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Add skills manually or upload certificates to extract them automatically'}
              </p>
              {!searchQuery && categoryFilter === 'all' && proficiencyFilter === 'all' && (
                <Button 
                  onClick={() => setAddDialogOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Skill
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
      <Toaster />
    </div>
  );
}
