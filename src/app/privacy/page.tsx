/**
 * Privacy Policy Page
 */

import Header from '@/components/shared/Header';
import Card from '@/components/ui/Card';

export const metadata = {
  title: 'Privacy Policy | RSS Renaissance',
  description: 'Privacy Policy for RSS Renaissance',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black py-16 px-4 border-b border-neutral-800">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
            Privacy Policy
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
                <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                <p>
                  RSS Renaissance ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Service. Please read this privacy policy carefully.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                
                <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.1 Information You Provide</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contact information (name, email) when you contact us</li>
                  <li>RSS feed URLs you add to the Service</li>
                  <li>Feedback and correspondence you send to us</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.2 Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Browser type and version</li>
                  <li>Device information</li>
                  <li>IP address (anonymized)</li>
                  <li>Usage data (pages visited, features used)</li>
                  <li>Performance and error logs</li>
                </ul>

                <h3 className="text-xl font-semibold text-white mb-3 mt-4">2.3 Local Storage</h3>
                <p>
                  We use browser local storage to cache feed data and articles for offline access. This data remains on your device and is not transmitted to our servers unless necessary for the Service to function.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                <p className="mb-3">We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve the Service</li>
                  <li>Process and respond to your inquiries</li>
                  <li>Generate AI summaries of articles</li>
                  <li>Detect and prevent technical issues</li>
                  <li>Analyze usage patterns to improve user experience</li>
                  <li>Send important service updates (with your consent)</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>
                <p className="mb-3">We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Service Providers:</strong> We may share data with trusted third-party service providers (e.g., OpenAI for AI summaries, hosting providers) who assist in operating the Service</li>
                  <li><strong>Legal Requirements:</strong> We may disclose information if required by law or in response to valid legal requests</li>
                  <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred</li>
                  <li><strong>With Your Consent:</strong> We may share information with your explicit consent</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">5. AI and Third-Party Services</h2>
                <p>
                  We use OpenAI's API to generate article summaries. When you request a summary, the article content is sent to OpenAI's servers for processing. OpenAI's use of this data is governed by their privacy policy. We do not send personally identifiable information with summary requests.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
                <p>
                  We retain your information only for as long as necessary to provide the Service and fulfill the purposes outlined in this Privacy Policy. You can delete your local data at any time by clearing your browser's local storage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">8. Your Privacy Rights</h2>
                <p className="mb-3">Depending on your location, you may have the following rights:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request access to your personal information</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your information</li>
                  <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                  <li><strong>Opt-out:</strong> Opt-out of certain data collection practices</li>
                </ul>
                <p className="mt-3">
                  To exercise these rights, please contact us through our Contact page.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">9. Cookies and Tracking</h2>
                <p>
                  We use essential cookies and local storage to provide the Service. We do not use tracking cookies for advertising purposes. You can control cookie settings through your browser preferences.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">10. Children's Privacy</h2>
                <p>
                  The Service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">11. International Data Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using the Service, you consent to such transfers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">12. Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued use of the Service after such changes constitutes acceptance of the updated Privacy Policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-4">13. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us through our Contact page.
                </p>
              </section>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
