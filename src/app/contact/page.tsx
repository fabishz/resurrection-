/**
 * Contact Page
 * Contact form with validation and backend integration
 */

'use client';

import { useState } from 'react';
import Header from '@/components/shared/Header';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import Toast from '@/components/ui/Toast';
import { useToast } from '@/hooks/useToast';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toasts, hideToast, success, error: showError } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900">
      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}

      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-black py-20 px-4 border-b border-neutral-800">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300">
            Have questions or feedback? We'd love to hear from you
          </p>
        </div>
      </div>

      <main className="flex-1 container mx-auto px-4 py-16 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-neutral-800 border-neutral-700">
              <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name ? 'border-red-500' : 'border-neutral-600'
                    } bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-halloween-orange transition-shadow`}
                    placeholder="Your name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                  )}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.email ? 'border-red-500' : 'border-neutral-600'
                    } bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-halloween-orange transition-shadow`}
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-white mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.subject ? 'border-red-500' : 'border-neutral-600'
                    } bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-halloween-orange transition-shadow`}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
                  )}
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.message ? 'border-red-500' : 'border-neutral-600'
                    } bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-halloween-orange transition-shadow resize-none`}
                    placeholder="Tell us what's on your mind..."
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                  )}
                  <p className="mt-1 text-xs text-neutral-500">
                    {formData.message.length} characters (minimum 10)
                  </p>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="primary"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-neutral-800 border-neutral-700">
              <div className="flex items-start gap-3 mb-4">
                <Icon name="info" size="lg" className="text-halloween-orange" />
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">Quick Response</h3>
                  <p className="text-sm text-neutral-400">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700">
              <h3 className="text-lg font-bold text-white mb-4">Other Ways to Reach Us</h3>
              <div className="space-y-4">
                <a
                  href="https://github.com/rss-renaissance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-300 hover:text-halloween-orange transition-colors"
                >
                  <Icon name="info" size="md" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://twitter.com/rss_renaissance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-neutral-300 hover:text-halloween-orange transition-colors"
                >
                  <Icon name="info" size="md" />
                  <span>Twitter</span>
                </a>
              </div>
            </Card>

            <Card className="bg-neutral-800 border-neutral-700">
              <h3 className="text-lg font-bold text-white mb-4">Before You Contact</h3>
              <p className="text-sm text-neutral-400 mb-3">
                Check out our FAQ page for quick answers to common questions.
              </p>
              <a
                href="/help"
                className="text-sm text-halloween-orange hover:text-halloween-purple transition-colors font-medium"
              >
                Visit FAQ →
              </a>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
