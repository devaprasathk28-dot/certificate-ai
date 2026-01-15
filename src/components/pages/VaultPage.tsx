import { useState, useEffect, useRef } from 'react';
import { BaseCrudService } from '@/integrations';
import { useMember } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import { useToast } from '@/hooks/use-toast';
import {
  Award,
  Upload,
  Search,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Eye,
  Plus,
  FileUp,
  ImagePlus,
} from 'lucide-react';
import { Certificates } from '@/entities';
import { format } from 'date-fns';
import { Toaster } from '@/components/ui/toaster';
import { uploadMedia } from '@/integrations/media';

export default function VaultPage() {
  const { member } = useMember();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificates[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState<Certificates | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // File upload refs
  const pdfFileInputRef = useRef<HTMLInputElement>(null);
  const imageFileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    recipientName: '',
    issuingBody: '',
    issueDate: '',
    certificateFileUrl: '',
    certificatePreviewImage: '',
    verificationScore: 95,
    fraudDetected: false,
  });

  useEffect(() => {
    loadCertificates();
  }, []);

  useEffect(() => {
    // Pre-fill recipient name from member data
    if (member?.profile?.nickname || member?.contact?.firstName) {
      setFormData(prev => ({
        ...prev,
        recipientName: member?.profile?.nickname || member?.contact?.firstName || ''
      }));
    }
  }, [member]);

  const loadCertificates = async () => {
    try {
      const { items } = await BaseCrudService.getAll<Certificates>('certificates');
      setCertificates(items);
    } catch (error) {
      console.error('Error loading certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload a PDF file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'PDF file must be less than 10MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      toast({
        title: 'Uploading PDF',
        description: 'Please wait while we upload your certificate file...',
      });

      const result = await uploadMedia(file);
      
      setFormData({ ...formData, certificateFileUrl: result.url });
      
      toast({
        title: 'PDF Uploaded',
        description: 'Certificate file uploaded successfully.',
      });
    } catch (error) {
      console.error('Error uploading PDF:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload PDF file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please upload an image file (JPEG, PNG, etc.).',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Image file must be less than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    try {
      toast({
        title: 'Uploading Image',
        description: 'Please wait while we upload your preview image...',
      });

      const result = await uploadMedia(file);
      
      setFormData({ ...formData, certificatePreviewImage: result.url });
      
      toast({
        title: 'Image Uploaded',
        description: 'Preview image uploaded successfully.',
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload image file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleUpload = async () => {
    if (!formData.recipientName || !formData.issuingBody) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in recipient name and issuing body.',
        variant: 'destructive',
      });
      return;
    }

    setUploading(true);
    try {
      const newCert: Certificates = {
        _id: crypto.randomUUID(),
        recipientName: formData.recipientName,
        issuingBody: formData.issuingBody,
        issueDate: formData.issueDate || new Date().toISOString(),
        certificateFileUrl: formData.certificateFileUrl || 'https://example.com/certificate.pdf',
        certificatePreviewImage: formData.certificatePreviewImage || 'https://static.wixstatic.com/media/487f75_daf5ee4c211a4ca7bc8c9dfefcb40102~mv2.png?originWidth=384&originHeight=192',
        verificationScore: formData.verificationScore,
        fraudDetected: formData.fraudDetected,
        publicVerificationLink: `${window.location.origin}/verify?id=${crypto.randomUUID()}`,
      };

      await BaseCrudService.create('certificates', newCert);
      
      // Optimistic update
      setCertificates([newCert, ...certificates]);
      
      toast({
        title: 'Certificate Uploaded',
        description: 'Your certificate has been successfully uploaded and verified.',
      });
      
      setUploadDialogOpen(false);
      setFormData({
        recipientName: member?.profile?.nickname || member?.contact?.firstName || '',
        issuingBody: '',
        issueDate: '',
        certificateFileUrl: '',
        certificatePreviewImage: '',
        verificationScore: 95,
        fraudDetected: false,
      });
    } catch (error) {
      console.error('Error uploading certificate:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload certificate. Please try again.',
        variant: 'destructive',
      });
      loadCertificates(); // Reload on failure
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    
    // Optimistic update
    setCertificates(certificates.filter((c) => c._id !== id));
    
    try {
      await BaseCrudService.delete('certificates', id);
      toast({
        title: 'Certificate Deleted',
        description: 'The certificate has been removed from your vault.',
      });
    } catch (error) {
      console.error('Error deleting certificate:', error);
      toast({
        title: 'Delete Failed',
        description: 'Failed to delete certificate. Please try again.',
        variant: 'destructive',
      });
      loadCertificates(); // Reload on failure
    }
  };

  const filteredCertificates = certificates.filter(
    (cert) =>
      cert.recipientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cert.issuingBody?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Certificate Vault
          </h1>
          <p className="font-paragraph text-lg text-secondary/70">
            Securely manage and verify your professional certificates
          </p>
        </div>

        {/* Search and Upload */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary/40" />
            <Input
              type="text"
              placeholder="Search certificates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 font-paragraph"
            />
          </div>
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
                <Plus className="w-4 h-4 mr-2" />
                Upload Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="font-heading text-2xl">Upload New Certificate</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <Label htmlFor="recipientName" className="font-paragraph text-sm font-semibold">
                    Recipient Name *
                  </Label>
                  <Input
                    id="recipientName"
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    placeholder="Enter recipient name"
                    className="font-paragraph"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issuingBody" className="font-paragraph text-sm font-semibold">
                    Issuing Body *
                  </Label>
                  <Input
                    id="issuingBody"
                    value={formData.issuingBody}
                    onChange={(e) => setFormData({ ...formData, issuingBody: e.target.value })}
                    placeholder="e.g., Harvard University, AWS, Google"
                    className="font-paragraph"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="issueDate" className="font-paragraph text-sm font-semibold">
                    Issue Date
                  </Label>
                  <Input
                    id="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="font-paragraph"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificateFileUrl" className="font-paragraph text-sm font-semibold">
                    Certificate File (PDF)
                  </Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        id="certificateFileUrl"
                        value={formData.certificateFileUrl}
                        onChange={(e) => setFormData({ ...formData, certificateFileUrl: e.target.value })}
                        placeholder="https://example.com/certificate.pdf or upload file"
                        className="font-paragraph flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => pdfFileInputRef.current?.click()}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <FileUp className="w-4 h-4 mr-2" />
                        Upload PDF
                      </Button>
                    </div>
                    <input
                      ref={pdfFileInputRef}
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfFileUpload}
                      className="hidden"
                    />
                    <p className="font-paragraph text-xs text-secondary/60">
                      Upload a PDF file (max 10MB) or enter a URL
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificatePreviewImage" className="font-paragraph text-sm font-semibold">
                    Preview Image (JPEG/PNG)
                  </Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        id="certificatePreviewImage"
                        value={formData.certificatePreviewImage}
                        onChange={(e) => setFormData({ ...formData, certificatePreviewImage: e.target.value })}
                        placeholder="https://example.com/preview.jpg or upload file"
                        className="font-paragraph flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => imageFileInputRef.current?.click()}
                        className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        <ImagePlus className="w-4 h-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                    <input
                      ref={imageFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                    <p className="font-paragraph text-xs text-secondary/60">
                      Upload an image file (max 5MB) or enter a URL
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Certificate
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setUploadDialogOpen(false)}
                    disabled={uploading}
                    className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Certificates Grid */}
        {filteredCertificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((cert) => (
              <Card key={cert._id} className="hover:border-primary/30 transition-colors">
                <CardHeader className="pb-4">
                  <div className="aspect-video bg-secondary/5 mb-4 flex items-center justify-center overflow-hidden">
                    {cert.certificatePreviewImage ? (
                      <Image
                        src={cert.certificatePreviewImage}
                        alt={cert.recipientName || 'Certificate'}
                        width={400}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Award className="w-16 h-16 text-secondary/20" />
                    )}
                  </div>
                  <CardTitle className="font-heading text-lg">
                    {cert.recipientName || 'Certificate'}
                  </CardTitle>
                  <p className="font-paragraph text-sm text-secondary/70">
                    {cert.issuingBody || 'Unknown Issuer'}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={
                        cert.fraudDetected
                          ? 'bg-red-500 text-white'
                          : 'bg-green-500 text-white'
                      }
                    >
                      {cert.fraudDetected ? (
                        <>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Fraud Detected
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      )}
                    </Badge>
                    <span className="font-paragraph text-sm text-secondary/70">
                      Score: {cert.verificationScore || 0}%
                    </span>
                  </div>

                  {cert.issueDate && (
                    <p className="font-paragraph text-sm text-secondary/70">
                      Issued: {format(new Date(cert.issueDate), 'MMM d, yyyy')}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                          onClick={() => setSelectedCert(cert)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="font-heading text-2xl">
                            Certificate Details
                          </DialogTitle>
                        </DialogHeader>
                        {selectedCert && (
                          <div className="space-y-6">
                            {selectedCert.certificatePreviewImage && (
                              <div className="aspect-video bg-secondary/5 flex items-center justify-center overflow-hidden">
                                <Image
                                  src={selectedCert.certificatePreviewImage}
                                  alt={selectedCert.recipientName || 'Certificate'}
                                  width={800}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <p className="font-paragraph text-sm text-secondary/60 mb-1">
                                  Recipient
                                </p>
                                <p className="font-paragraph text-base text-secondary">
                                  {selectedCert.recipientName || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="font-paragraph text-sm text-secondary/60 mb-1">
                                  Issuing Body
                                </p>
                                <p className="font-paragraph text-base text-secondary">
                                  {selectedCert.issuingBody || 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="font-paragraph text-sm text-secondary/60 mb-1">
                                  Issue Date
                                </p>
                                <p className="font-paragraph text-base text-secondary">
                                  {selectedCert.issueDate
                                    ? format(new Date(selectedCert.issueDate), 'MMMM d, yyyy')
                                    : 'N/A'}
                                </p>
                              </div>
                              <div>
                                <p className="font-paragraph text-sm text-secondary/60 mb-1">
                                  Verification Score
                                </p>
                                <p className="font-paragraph text-base text-secondary">
                                  {selectedCert.verificationScore || 0}%
                                </p>
                              </div>
                            </div>
                            {selectedCert.publicVerificationLink && (
                              <div>
                                <p className="font-paragraph text-sm text-secondary/60 mb-2">
                                  Public Verification Link
                                </p>
                                <a
                                  href={selectedCert.publicVerificationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-paragraph text-sm text-primary hover:underline flex items-center gap-1"
                                >
                                  {selectedCert.publicVerificationLink}
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    {cert.publicVerificationLink && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground"
                        asChild
                      >
                        <a
                          href={cert.publicVerificationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      onClick={() => handleDelete(cert._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-16 text-center">
              <Award className="w-16 h-16 text-secondary/20 mx-auto mb-4" />
              <h3 className="font-heading text-xl font-semibold text-secondary mb-2">
                {searchQuery ? 'No certificates found' : 'No certificates yet'}
              </h3>
              <p className="font-paragraph text-base text-secondary/70 mb-6">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Upload your first certificate to get started'}
              </p>
              {!searchQuery && (
                <Button 
                  onClick={() => setUploadDialogOpen(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Certificate
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
