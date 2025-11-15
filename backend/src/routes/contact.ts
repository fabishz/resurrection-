/**
 * Contact Routes - API endpoints for contact form
 */

import { FastifyPluginAsync } from 'fastify';
import { ContactSchema } from '../types/api';

const contactRoutes: FastifyPluginAsync = async (fastify) => {
  /**
   * POST /api/v1/contact
   * Submit a contact form message
   */
  fastify.post('/', async (request, reply) => {
    try {
      const body = ContactSchema.parse(request.body);
      const { name, email, subject, message } = body;

      const { database, logger } = request.services;

      // Get client metadata
      const ipAddress = request.ip;
      const userAgent = request.headers['user-agent'];

      // Save contact to database
      const contact = await database.createContact({
        name,
        email,
        subject,
        message,
        ipAddress,
        userAgent,
      });

      logger.info({
        contactId: contact.id,
        email,
        subject,
      }, 'Contact form submitted');

      // TODO: Send email notification (implement email service)
      // await emailService.sendContactNotification(contact);

      return reply.code(201).send({
        success: true,
        message: 'Thank you for contacting us! We will get back to you soon.',
        contactId: contact.id,
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to submit contact form');

      if (err.message.includes('validation')) {
        return reply.code(400).send({
          success: false,
          error: 'Invalid form data',
          details: err.message,
        });
      }

      return reply.code(500).send({
        success: false,
        error: 'Failed to submit contact form',
      });
    }
  });

  /**
   * GET /api/v1/contact
   * Get all contact submissions (admin only - TODO: add auth)
   */
  fastify.get('/', async (request, reply) => {
    try {
      const { database } = request.services;

      const contacts = await database.prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50,
      });

      return reply.send({
        success: true,
        data: contacts.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          subject: c.subject,
          message: c.message,
          status: c.status,
          createdAt: c.createdAt.toISOString(),
        })),
      });
    } catch (error) {
      const err = error as Error;
      request.services.logger.error({ error: err.message }, 'Failed to fetch contacts');

      return reply.code(500).send({
        success: false,
        error: 'Failed to fetch contacts',
      });
    }
  });
};

export default contactRoutes;
