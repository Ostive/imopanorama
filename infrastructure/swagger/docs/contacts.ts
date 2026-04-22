/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Submit contact form
 *     description: Submit a simple contact form (Public, rate limited)
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               message:
 *                 type: string
 *                 example: I'm interested in your properties
 *               phone:
 *                 type: string
 *                 example: '+261 34 XX XX XX XX'
 *               recaptchaToken:
 *                 type: string
 *                 description: reCAPTCHA token (optional)
 *     responses:
 *       200:
 *         description: Contact form submitted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *       429:
 *         description: Rate limit exceeded
 */

/**
 * @swagger
 * /api/contacts:
 *   get:
 *     summary: List contacts
 *     description: Get all contact submissions (Admin/Super Admin only)
 *     tags: [Contacts]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *       - in: query
 *         name: isRead
 *         schema:
 *           type: boolean
 *         description: Filter by read status
 *       - in: query
 *         name: propertyId
 *         schema:
 *           type: string
 *         description: Filter by property ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, email, message
 *     responses:
 *       200:
 *         description: List of contacts
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/PaginatedResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create contact
 *     description: Create a contact inquiry (Public/Authenticated)
 *     tags: [Contacts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - message
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               message:
 *                 type: string
 *               propertyId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional property reference
 *     responses:
 *       201:
 *         description: Contact created
 *       400:
 *         description: Validation error
 *       429:
 *         description: Rate limit exceeded
 */

/**
 * @swagger
 * /api/contacts/{id}:
 *   get:
 *     summary: Get contact by ID
 *     description: Get contact details (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Contact details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 contact:
 *                   $ref: '#/components/schemas/Contact'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 *   put:
 *     summary: Update contact
 *     description: Update contact details (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact updated
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/contacts/{id}/read:
 *   put:
 *     summary: Mark contact as read
 *     description: Mark a contact inquiry as read (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Contact marked as read
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Contact not found
 */

/**
 * @swagger
 * /api/contacts/count:
 *   get:
 *     summary: Get contact count
 *     description: Get total number of contacts (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Contact count
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 */

/**
 * @swagger
 * /api/contacts/stats:
 *   get:
 *     summary: Get contact statistics
 *     description: Get contact statistics (Admin only)
 *     tags: [Contacts]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Contact statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 */

/**
 * @swagger
 * /api/contacts/user:
 *   get:
 *     summary: Get user's own contacts
 *     description: Get contacts submitted by the authenticated user
 *     tags: [Contacts]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: User's contacts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 contacts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Contact'
 */

export {}; // Make this a module
