/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload images
 *     description: Upload single or multiple images to BunnyCDN (Admin/Agent only)
 *     tags: [Media]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Image files to upload (JPEG, PNG, WebP, GIF)
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 *                     format: uri
 *                   description: CDN URLs of uploaded images
 *                 paths:
 *                   type: array
 *                   items:
 *                     type: string
 *                   description: Storage paths
 *       400:
 *         description: Invalid file format or size
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       413:
 *         description: File too large (max 10MB per file)
 *   get:
 *     summary: List images
 *     description: List images in a directory (Admin/Agent only)
 *     tags: [Media]
 *     security:
 *       - CookieAuth: []
 *     parameters:
 *       - in: query
 *         name: directory
 *         schema:
 *           type: string
 *         description: Directory path
 *     responses:
 *       200:
 *         description: List of images
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 images:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       url:
 *                         type: string
 *                         format: uri
 *                       path:
 *                         type: string
 *                       size:
 *                         type: integer
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete image
 *     description: Delete an image by path (Admin/Agent only)
 *     tags: [Media]
 *     security:
 *       - CookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - path
 *             properties:
 *               path:
 *                 type: string
 *                 description: Image path to delete
 *     responses:
 *       200:
 *         description: Image deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Image not found
 *   put:
 *     summary: Update/replace image
 *     description: Replace an existing image (Admin/Agent only)
 *     tags: [Media]
 *     security:
 *       - CookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               path:
 *                 type: string
 *                 description: Existing image path to replace
 *     responses:
 *       200:
 *         description: Image replaced
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/admin/upload:
 *   post:
 *     summary: Admin upload proxy
 *     description: Upload images via admin interface (Admin/Agent only)
 *     tags: [Media]
 *     security:
 *       - CookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded
 *       401:
 *         description: Unauthorized
 *   get:
 *     summary: List images (Admin)
 *     tags: [Media]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: List of images
 *   put:
 *     summary: Update images (Admin)
 *     tags: [Media]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Images updated
 *   delete:
 *     summary: Delete images (Admin)
 *     tags: [Media]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: Images deleted
 */

/**
 * @swagger
 * /api/admin/images:
 *   get:
 *     summary: List all images (Admin)
 *     description: Get a list of all uploaded images (Admin only)
 *     tags: [Media]
 *     security:
 *       - CookieAuth: []
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
 *           default: 50
 *     responses:
 *       200:
 *         description: List of images
 *       401:
 *         description: Unauthorized
 */

export {}; // Make this a module
