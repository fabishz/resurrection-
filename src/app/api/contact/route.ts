import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import type { ApiError } from '@/types/api';

// Request validation schema
const ContactRequestSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
});

/**
 * POST /api/contact
 * Handle contact form submissions
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request
    const validation = ContactRequestSchema.safeParse(body);
    if (!validation.success) {
      const error: ApiError = {
        success: false,
        error: 'Invalid request data',
        code: 'VALIDATION_ERROR',
        details: validation.error.issues.map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      };
      return NextResponse.json(error, { status: 400 });
    }

    const { name, email, subject, message } = validation.data;

    console.log('[Contact] New message received:', {
      name,
      email,
      subject,
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    // TODO: In production, implement one of the following:
    // 1. Send email via SendGrid, AWS SES, or similar service
    // 2. Store in database for admin review
    // 3. Send to Slack/Discord webhook
    // 4. Create ticket in support system

    // For now, just log and return success
    // Example email sending (commented out):
    /*
    await sendEmail({
      to: 'support@rss-renaissance.com',
      from: email,
      subject: `Contact Form: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        Subject: ${subject}
        
        Message:
        ${message}
      `,
    });
    */

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[Contact] Error:', error);

    const apiError: ApiError = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send message',
      code: 'CONTACT_ERROR',
    };

    return NextResponse.json(apiError, { status: 500 });
  }
}
