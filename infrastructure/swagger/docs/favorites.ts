/**
 * @swagger
 * /api/favorites:
 *   get:
 *     summary: Get user's favorites
 *     description: List all properties favorited by the authenticated user
 *     tags: [Favorites]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 favorites:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         format: uuid
 *                       propertyId:
 *                         type: string
 *                         format: uuid
 *                       userId:
 *                         type: string
 *                         format: uuid
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       property:
 *                         $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Add to favorites
 *     description: Add a property to user's favorites
 *     tags: [Favorites]
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
 *               - propertyId
 *             properties:
 *               propertyId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the property to favorite
 *     responses:
 *       201:
 *         description: Added to favorites
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 favorite:
 *                   type: object
 *       400:
 *         description: Already in favorites
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Clear all favorites
 *     description: Remove all items from user's favorites
 *     tags: [Favorites]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: All favorites cleared
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/favorites/{propertyId}:
 *   get:
 *     summary: Check if favorited
 *     description: Check if a specific property is in user's favorites
 *     tags: [Favorites]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Favorite status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isFavorite:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Remove from favorites
 *     description: Remove a specific property from user's favorites
 *     tags: [Favorites]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: propertyId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Removed from favorites
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Not in favorites
 */

export {}; // Make this a module
