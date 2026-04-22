/**
 * @swagger
 * /api/analytics/track:
 *   post:
 *     summary: Track analytics event
 *     description: Track page views, events, or session end (Public)
 *     tags: [Analytics]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [pageview, event, session_end]
 *                 description: Type of analytics event
 *               path:
 *                 type: string
 *                 description: Page path (for pageview)
 *                 example: /proprietes/123
 *               title:
 *                 type: string
 *                 description: Page title (for pageview)
 *               referrer:
 *                 type: string
 *                 description: Referrer URL
 *               eventName:
 *                 type: string
 *                 description: Event name (for event type)
 *                 example: property_view
 *               eventData:
 *                 type: object
 *                 description: Additional event data
 *               sessionId:
 *                 type: string
 *                 description: Session identifier
 *               duration:
 *                 type: integer
 *                 description: Session duration in ms (for session_end)
 *     responses:
 *       200:
 *         description: Event tracked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid event data
 */

/**
 * @swagger
 * /api/analytics/data:
 *   get:
 *     summary: Get analytics data
 *     description: Retrieve aggregated analytics data (Admin only)
 *     tags: [Analytics]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics range
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics range
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [pageview, event, session]
 *         description: Filter by event type
 *       - in: query
 *         name: path
 *         schema:
 *           type: string
 *         description: Filter by page path
 *     responses:
 *       200:
 *         description: Analytics data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     pageviews:
 *                       type: integer
 *                     uniqueVisitors:
 *                       type: integer
 *                     avgSessionDuration:
 *                       type: number
 *                     topPages:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           path:
 *                             type: string
 *                           views:
 *                             type: integer
 *                     topEvents:
 *                       type: array
 *                       items:
 *                         type: object
 *                     deviceStats:
 *                       type: object
 *                     browserStats:
 *                       type: object
 *                     locationStats:
 *                       type: object
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

export {}; // Make this a module
