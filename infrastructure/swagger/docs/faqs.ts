/**
 * @swagger
 * /api/faqs:
 *   get:
 *     summary: List FAQs
 *     description: Get all frequently asked questions (Public)
 *     tags: [FAQs]
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
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in question and answer
 *     responses:
 *       200:
 *         description: List of FAQs
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
 *                         $ref: '#/components/schemas/FAQ'
 *   post:
 *     summary: Create FAQ
 *     description: Create a new FAQ (Admin/Super Admin only)
 *     tags: [FAQs]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - question
 *               - answer
 *             properties:
 *               question:
 *                 type: string
 *               answer:
 *                 type: string
 *               category:
 *                 type: string
 *               order:
 *                 type: integer
 *                 default: 0
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: FAQ created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 faq:
 *                   $ref: '#/components/schemas/FAQ'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/faqs/{id}:
 *   get:
 *     summary: Get FAQ by ID
 *     description: Retrieve a specific FAQ
 *     tags: [FAQs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: FAQ details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 faq:
 *                   $ref: '#/components/schemas/FAQ'
 *       404:
 *         description: FAQ not found
 *   put:
 *     summary: Update FAQ
 *     description: Update an existing FAQ (Admin only)
 *     tags: [FAQs]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
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
 *             $ref: '#/components/schemas/FAQ'
 *     responses:
 *       200:
 *         description: FAQ updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: FAQ not found
 *   delete:
 *     summary: Delete FAQ
 *     description: Delete a FAQ (Admin only)
 *     tags: [FAQs]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: FAQ deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: FAQ not found
 */

/**
 * @swagger
 * /api/faqs/categories:
 *   get:
 *     summary: List FAQ categories
 *     description: Get all unique FAQ categories (Public)
 *     tags: [FAQs]
 *     responses:
 *       200:
 *         description: List of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 categories:
 *                   type: array
 *                   items:
 *                     type: string
 */

export {}; // Make this a module
