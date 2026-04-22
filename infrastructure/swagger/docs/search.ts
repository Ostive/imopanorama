/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Semantic search
 *     description: Search properties using vector similarity with Qdrant (Public)
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *         example: modern apartment near airport
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 50
 *         description: Number of results
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Pagination offset
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by property type
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, SOLD, RENTED, RESERVED]
 *         description: Filter by status
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price
 *       - in: query
 *         name: minSize
 *         schema:
 *           type: number
 *         description: Minimum size (m²)
 *       - in: query
 *         name: maxSize
 *         schema:
 *           type: number
 *         description: Maximum size (m²)
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: Latitude for geo search
 *       - in: query
 *         name: lon
 *         schema:
 *           type: number
 *         description: Longitude for geo search
 *       - in: query
 *         name: radius
 *         schema:
 *           type: number
 *           default: 5
 *         description: Search radius in km (requires lat/lon)
 *     responses:
 *       200:
 *         description: Search results with similarity scores
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       score:
 *                         type: number
 *                         description: Similarity score (0-1)
 *                       property:
 *                         oneOf:
 *                           - $ref: '#/components/schemas/Property'
 *                           - $ref: '#/components/schemas/Terrain'
 *                 total:
 *                   type: integer
 *                 query:
 *                   type: string
 *       400:
 *         description: Invalid query parameters
 *       503:
 *         description: Search service unavailable (fallback to database search)
 */

/**
 * @swagger
 * /api/search/sync:
 *   get:
 *     summary: Sync search index
 *     description: Synchronize Qdrant vector database with properties (Admin only)
 *     tags: [Search]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Index synchronized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 indexed:
 *                   type: integer
 *                   description: Number of properties indexed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Sync failed
 */

export {}; // Make this a module
