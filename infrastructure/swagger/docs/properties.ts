/**
 * @swagger
 * /api/properties:
 *   get:
 *     summary: List properties
 *     description: Get paginated list of properties with advanced filtering
 *     tags: [Properties]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *       - in: query
 *         name: propertyType
 *         schema:
 *           type: string
 *           enum: [APARTMENT, HOUSE, VILLA, STUDIO, DUPLEX, TRIPLEX, PENTHOUSE, LOFT, TOWNHOUSE, COMMERCIAL, OFFICE, WAREHOUSE, LAND, BUILDING, PARKING, GARAGE, SHOP, RESTAURANT, HOTEL, INDUSTRIAL, AGRICULTURAL, MIXED_USE, VACATION_HOME, OTHER]
 *         description: Filter by property type
 *       - in: query
 *         name: transactionType
 *         schema:
 *           type: string
 *           enum: [SALE, RENT, LEASE]
 *         description: Filter by transaction type
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [AVAILABLE, SOLD, RENTED, RESERVED, UNAVAILABLE]
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
 *         name: minBedrooms
 *         schema:
 *           type: integer
 *         description: Minimum number of bedrooms
 *       - in: query
 *         name: maxBedrooms
 *         schema:
 *           type: integer
 *         description: Maximum number of bedrooms
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Text search in title and description
 *       - in: query
 *         name: isFeatured
 *         schema:
 *           type: boolean
 *         description: Filter featured properties
 *       - in: query
 *         name: amenities
 *         schema:
 *           type: string
 *         description: Comma-separated amenities list
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, size_asc, size_desc, date_desc, date_asc]
 *           default: date_desc
 *         description: Sort order
 *       - in: query
 *         name: view
 *         schema:
 *           type: string
 *           enum: [list, full]
 *           default: list
 *         description: Response detail level
 *     responses:
 *       200:
 *         description: List of properties
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
 *                         $ref: '#/components/schemas/Property'
 *   post:
 *     summary: Create property
 *     description: Create a new property (Admin, Agent, Super Admin only)
 *     tags: [Properties]
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
 *               - title
 *               - description
 *               - propertyType
 *               - transactionType
 *               - price
 *               - city
 *             properties:
 *               title:
 *                 type: string
 *                 example: Beautiful 3-bedroom apartment in Ivato
 *               description:
 *                 type: string
 *                 example: Spacious modern apartment with great view
 *               propertyType:
 *                 type: string
 *                 enum: [APARTMENT, HOUSE, VILLA, STUDIO, DUPLEX, TRIPLEX, PENTHOUSE, LOFT, TOWNHOUSE, COMMERCIAL, OFFICE, WAREHOUSE, LAND, BUILDING, PARKING, GARAGE, SHOP, RESTAURANT, HOTEL, INDUSTRIAL, AGRICULTURAL, MIXED_USE, VACATION_HOME, OTHER]
 *                 example: APARTMENT
 *               transactionType:
 *                 type: string
 *                 enum: [SALE, RENT, LEASE]
 *                 example: SALE
 *               price:
 *                 type: number
 *                 example: 250000000
 *               city:
 *                 type: string
 *                 example: Antananarivo
 *               address:
 *                 type: string
 *                 example: Ivato, près de l'aéroport
 *               size:
 *                 type: number
 *                 example: 120.5
 *               bedrooms:
 *                 type: integer
 *                 example: 3
 *               bathrooms:
 *                 type: integer
 *                 example: 2
 *               status:
 *                 type: string
 *                 enum: [AVAILABLE, SOLD, RENTED, RESERVED, UNAVAILABLE]
 *                 default: AVAILABLE
 *               isFeatured:
 *                 type: boolean
 *                 default: false
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               coverImage:
 *                 type: string
 *                 format: uri
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: [parking, pool, garden, security]
 *     responses:
 *       201:
 *         description: Property created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 property:
 *                   $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Forbidden - insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/properties/{id}:
 *   get:
 *     summary: Get property by ID
 *     description: Retrieve detailed property information
 *     tags: [Properties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Property ID
 *     responses:
 *       200:
 *         description: Property details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 property:
 *                   $ref: '#/components/schemas/Property'
 *       404:
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Update property
 *     description: Update property details (Admin, Agent, Super Admin only)
 *     tags: [Properties]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Property'
 *     responses:
 *       200:
 *         description: Property updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 property:
 *                   $ref: '#/components/schemas/Property'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   delete:
 *     summary: Delete property
 *     description: Delete a property (Admin, Super Admin only)
 *     tags: [Properties]
 *     security:
 *       - CookieAuth: []
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Property deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Property not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

export {}; // Make this a module
