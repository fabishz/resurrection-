/**
 * Terms of Service Page
 */

import Header from '@/components/shared/Header';
import Card from '@/components/ui/Card';

export const metadata = {
  title: 'Terms of Service | RSS Renaissance',
  description: 'Terms of Service for RSS Renaissance',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black py-16 px-4 border-b border-neutral-800">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Terms of Service
          </h1>
          <p className="text-lg text-neutral-300">
            Last updated: November 14, 2025
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <Card className="bg-neutral-800 border-neutral-700">
          <div className="prose prose-invert max-w-none">
            <div className="space-y-8 text-neutral-300">
              <section>
                <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using RSS Renaissance ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                <p>
                  RSS Renaissance is an intelligent RSS feed reader that provides AI-powered article summaries, feed management, and content organization features. The Service is provided "as is" and we reserve the right to modify, suspend, or discontinue any aspect of the Service at any time.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
                <p className="mb-3">You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate information when using the Service</li>
                  <li>Use the Service only for lawful purposes</li>
                  <li>Not attempt to gain unauthorized access to any part of the Service</li>
                  <li>Not use the Service to distribute spam, malware, or harmful content</li>
                  <li>Not abuse or overload the Service's infrastructure</li>
                  <li>Respect intellectual property rights of content creators</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are owned by RSS Renaissance and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws. RSS feeds and articles accessed through the Service remain the property of their respective owners.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. AI-Generated Content</h2>
                <p>
                  The Service uses artificial intelligence to generate article summaries. While we strive for accuracy, AI-generated summaries may contain errors or inaccuracies. Users should verify important information by reading the original articles. We are not responsible for decisions made based solely on AI-generated summaries.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Privacy</h2>
                <p>
                  Your use of the Service is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding your personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, RSS Renaissance shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Your use or inability to use the Service</li>
                  <li>Any unauthorized access to or use of our servers</li>
                  <li>Any interruption or cessation of transmission to or from the Service</li>
                  <li>Any bugs, viruses, or other harmful code</li>
                  <li>Any errors or omissions in any content</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Disclaimer of Warranties</h2>
                <p>
                  The Service is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, either express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
                <p>
                  We reserve the right to terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will immediately cease.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the Service after such modifications constitutes acceptance of the updated Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which RSS Renaissance operates, without regard to its conflict of law provisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
                <p>
                  If you have any questions about these Terms, please contact us through our Contact page.
                </p>
              </section>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
