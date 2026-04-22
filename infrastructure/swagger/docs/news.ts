/**
 * @swagger
 * /api/news:
 *   get:
 *     summary: List published news
 *     description: Get all published news articles (Public)
 *     tags: [News]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [ACTUALITE, CONSEIL, MARCHE, PROJET, EVENEMENT, AUTRE]
 *         description: Filter by category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of articles to return
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in title and content
 *     responses:
 *       200:
 *         description: List of news articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 news:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/News'
 */

/**
 * @swagger
 * /api/news/{slug}:
 *   get:
 *     summary: Get news by slug
 *     description: Retrieve a news article by its URL slug (Public)
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *         description: URL-friendly slug of the news article
 *     responses:
 *       200:
 *         description: News article details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 news:
 *                   $ref: '#/components/schemas/News'
 *       404:
 *         description: News article not found
 */

/**
 * @swagger
 * /api/news/id/{id}:
 *   get:
 *     summary: Get news by ID
 *     description: Retrieve a news article by its ID (Public)
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: News article details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 news:
 *                   $ref: '#/components/schemas/News'
 *       404:
 *         description: News article not found
 */

/**
 * @swagger
 * /api/admin/news:
 *   get:
 *     summary: List all news (Admin)
 *     description: Get all news articles including unpublished ones
 *     tags: [News]
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
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: isPublished
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: List of news articles
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
 *                         $ref: '#/components/schemas/News'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   post:
 *     summary: Create news article
 *     description: Create a new news article (Admin only)
 *     tags: [News]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       201:
 *         description: News created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/admin/news/{id}:
 *   get:
 *     summary: Get news by ID (Admin)
 *     tags: [News]
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
 *         description: News article details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: News not found
 *   put:
 *     summary: Update news article
 *     tags: [News]
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
 *             $ref: '#/components/schemas/News'
 *     responses:
 *       200:
 *         description: News updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: News not found
 *   delete:
 *     summary: Delete news article
 *     tags: [News]
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
 *         description: News deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: News not found
 */

export {}; // Make this a module
