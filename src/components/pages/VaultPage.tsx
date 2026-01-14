import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Image } from '@/components/ui/image';
import {
  Award,
  Upload,
  Search,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Trash2,
  Eye,
} from 'lucide-react';
import { Certificates } from '@/entities';
import { format } from 'date-fns';

export default function VaultPage() {
  const [certificates, setCertificates] = useState<Certificates[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCert, setSelectedCert] = useState<Certificates | null>(null);

  useEffect(() => {
    loadCertificates();
  }, []);

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

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      await BaseCrudService.delete('certificates', id);
      setCertificates(certificates.filter((c) => c._id !== id));
    } catch (error) {
      console.error('Error deleting certificate:', error);
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
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-8">
            <Upload className="w-4 h-4 mr-2" />
            Upload Certificate
          </Button>
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
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Certificate
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
}
