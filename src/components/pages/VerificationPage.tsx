import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BaseCrudService } from '@/integrations';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { CheckCircle, AlertTriangle, Award, Calendar, Building } from 'lucide-react';
import { Certificates } from '@/entities';
import { format } from 'date-fns';

export default function VerificationPage() {
  const [searchParams] = useSearchParams();
  const certId = searchParams.get('id');
  const [certificate, setCertificate] = useState<Certificates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (certId) {
      loadCertificate(certId);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [certId]);

  const loadCertificate = async (id: string) => {
    try {
      const cert = await BaseCrudService.getById<Certificates>('certificates', id);
      setCertificate(cert);
    } catch (error) {
      console.error('Error loading certificate:', error);
      setError(true);
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

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-16 text-center">
              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="font-heading text-2xl font-bold text-secondary mb-2">
                Certificate Not Found
              </h2>
              <p className="font-paragraph text-base text-secondary/70">
                The certificate you're looking for doesn't exist or has been removed.
              </p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-[120rem] mx-auto px-6 lg:px-12 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-secondary mb-4">
              Certificate Verification
            </h1>
            <p className="font-paragraph text-lg text-secondary/70">
              Public verification powered by CertiVault AI
            </p>
          </div>

          {/* Verification Status */}
          <Card className="mb-8">
            <CardContent className="py-8">
              <div className="flex items-center justify-center gap-4">
                {certificate.fraudDetected ? (
                  <>
                    <AlertTriangle className="w-12 h-12 text-red-500" />
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-red-500 mb-1">
                        Fraud Detected
                      </h2>
                      <p className="font-paragraph text-base text-secondary/70">
                        This certificate has failed verification checks
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <div>
                      <h2 className="font-heading text-2xl font-bold text-green-500 mb-1">
                        Verified Certificate
                      </h2>
                      <p className="font-paragraph text-base text-secondary/70">
                        This certificate has been verified and authenticated
                      </p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Certificate Details */}
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Certificate Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Preview Image */}
              {certificate.certificatePreviewImage && (
                <div className="aspect-video bg-secondary/5 flex items-center justify-center overflow-hidden">
                  <Image
                    src={certificate.certificatePreviewImage}
                    alt={certificate.recipientName || 'Certificate'}
                    width={1000}
                    className="w-full h-full object-contain"
                  />
                </div>
              )}

              {/* Information Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <Award className="w-4 h-4" />
                    <span className="font-paragraph text-sm font-semibold">Recipient</span>
                  </div>
                  <p className="font-paragraph text-lg text-secondary pl-6">
                    {certificate.recipientName || 'Not specified'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <Building className="w-4 h-4" />
                    <span className="font-paragraph text-sm font-semibold">Issuing Body</span>
                  </div>
                  <p className="font-paragraph text-lg text-secondary pl-6">
                    {certificate.issuingBody || 'Not specified'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <Calendar className="w-4 h-4" />
                    <span className="font-paragraph text-sm font-semibold">Issue Date</span>
                  </div>
                  <p className="font-paragraph text-lg text-secondary pl-6">
                    {certificate.issueDate
                      ? format(new Date(certificate.issueDate), 'MMMM d, yyyy')
                      : 'Not specified'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-secondary/60">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-paragraph text-sm font-semibold">Verification Score</span>
                  </div>
                  <div className="pl-6">
                    <Badge
                      className={
                        (certificate.verificationScore || 0) >= 80
                          ? 'bg-green-500 text-white'
                          : (certificate.verificationScore || 0) >= 60
                          ? 'bg-yellow-500 text-white'
                          : 'bg-red-500 text-white'
                      }
                    >
                      {certificate.verificationScore || 0}% Confidence
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Download Link */}
              {certificate.certificateFileUrl && (
                <div className="pt-6 border-t border-secondary/10">
                  <a
                    href={certificate.certificateFileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-paragraph text-base text-primary hover:underline"
                  >
                    View Original Certificate →
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer Note */}
          <div className="text-center mt-8">
            <p className="font-paragraph text-sm text-secondary/60">
              This verification is powered by CertiVault AI's blockchain-based authentication system
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
