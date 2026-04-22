/**
 * @swagger
 * /api/partners:
 *   get:
 *     summary: List active partners
 *     description: Get all active partners (Public)
 *     tags: [Partners]
 *     responses:
 *       200:
 *         description: List of partners
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 partners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       name:
 *                         type: string
 *                       logo:
 *                         type: string
 *                         format: uri
 *                       website:
 *                         type: string
 *                         format: uri
 *                         nullable: true
 *                       description:
 *                         type: string
 *                         nullable: true
 *                       order:
 *                         type: integer
 *                       isActive:
 *                         type: boolean
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */

/**
 * @swagger
 * /api/admin/partners:
 *   get:
 *     summary: List all partners (Admin)
 *     description: Get all partners including inactive ones
 *     tags: [Partners]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of partners
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create partner
 *     description: Add a new partner (Admin only)
 *     tags: [Partners]
 *     security:
 *       - CookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - logo
 *             properties:
 *               name:
 *                 type: string
 *                 example: Partner Company
 *               logo:
 *                 type: string
 *                 format: uri
 *                 example: https://cdn.example.com/logo.png
 *               website:
 *                 type: string
 *                 format: uri
 *                 example: https://partner.com
 *               description:
 *                 type: string
 *                 example: Leading construction company
 *               order:
 *                 type: integer
 *                 default: 0
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Partner created
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/partners/{id}:
 *   get:
 *     summary: Get partner by ID (Admin)
 *     tags: [Partners]
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
 *         description: Partner details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Partner not found
 *   put:
 *     summary: Update partner
 *     tags: [Partners]
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
 *             type: object
 *     responses:
 *       200:
 *         description: Partner updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete partner
 *     tags: [Partners]
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
 *         description: Partner deleted
 *       401:
 *         description: Unauthorized
 */

export {}; // Make this a module
