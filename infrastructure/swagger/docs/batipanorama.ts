/**
 * @swagger
 * /api/bati-projects:
 *   get:
 *     summary: List construction projects
 *     description: Get all BatiPanorama construction projects (Public)
 *     tags: [BatiPanorama]
 *     parameters:
 *       - in: query
 *         name: published
 *         schema:
 *           type: boolean
 *         description: Filter by published status
 *     responses:
 *       200:
 *         description: List of projects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 projects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BatiProject'
 *   post:
 *     summary: Create project
 *     description: Create a new construction project (Admin/Super Admin only)
 *     tags: [BatiPanorama]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BatiProject'
 *     responses:
 *       201:
 *         description: Project created
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */

/**
 * @swagger
 * /api/bati-projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     description: Retrieve project details (Public)
 *     tags: [BatiPanorama]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Project details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 project:
 *                   $ref: '#/components/schemas/BatiProject'
 *       404:
 *         description: Project not found
 *   put:
 *     summary: Update project
 *     tags: [BatiPanorama]
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
 *             $ref: '#/components/schemas/BatiProject'
 *     responses:
 *       200:
 *         description: Project updated
 *       401:
 *         description: Unauthorized
 *   delete:
 *     summary: Delete project
 *     tags: [BatiPanorama]
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
 *         description: Project deleted
 *       401:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/bati-services:
 *   get:
 *     summary: List construction services
 *     description: Get all BatiPanorama services (Public)
 *     tags: [BatiPanorama]
 *     responses:
 *       200:
 *         description: List of services
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 services:
 *                   type: array
 *                   items:
 *                     type: object
 *   post:
 *     summary: Create service
 *     tags: [BatiPanorama]
 *     security:
 *       - CookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Service created
 */

/**
 * @swagger
 * /api/bati-services/{id}:
 *   get:
 *     summary: Get service by ID
 *     tags: [BatiPanorama]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Service details
 *   put:
 *     summary: Update service
 *     tags: [BatiPanorama]
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
 *         description: Service updated
 *   delete:
 *     summary: Delete service
 *     tags: [BatiPanorama]
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
 *         description: Service deleted
 */

/**
 * @swagger
 * /api/bati-process:
 *   get:
 *     summary: List process steps
 *     description: Get construction process steps (Public)
 *     tags: [BatiPanorama]
 *     responses:
 *       200:
 *         description: List of process steps
 *   post:
 *     summary: Create process step
 *     tags: [BatiPanorama]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       201:
 *         description: Process step created
 */

/**
 * @swagger
 * /api/bati-quotes:
 *   get:
 *     summary: List quote requests (Admin)
 *     description: Get all quote requests (Admin only)
 *     tags: [BatiPanorama]
 *     security:
 *       - CookieAuth: []
 *     responses:
 *       200:
 *         description: List of quotes
 *       401:
 *         description: Unauthorized
 *   post:
 *     summary: Submit quote request
 *     description: Request a construction quote (Public)
 *     tags: [BatiPanorama]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - projectType
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               projectType:
 *                 type: string
 *               budget:
 *                 type: string
 *               timeline:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Quote request submitted
 *       400:
 *         description: Validation error
 */

/**
 * @swagger
 * /api/bati-quotes/{id}:
 *   get:
 *     summary: Get quote by ID (Admin)
 *     tags: [BatiPanorama]
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
 *         description: Quote details
 *   put:
 *     summary: Update quote status (Admin)
 *     tags: [BatiPanorama]
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
 *         description: Quote updated
 *   delete:
 *     summary: Delete quote (Admin)
 *     tags: [BatiPanorama]
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
 *         description: Quote deleted
 */

export {}; // Make this a module
