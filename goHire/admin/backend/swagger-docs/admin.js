/**
 * @swagger
 * /api/admin/premium-users:
 *   get:
 *     summary: Get premium users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Premium users fetched successfully
 *       500:
 *         description: Internal server error
 *
 * /api/admin/company/proof/{proofId}:
 *   get:
 *     summary: Get company proof document by proof file ID
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: proofId
 *         required: true
 *         schema:
 *           type: string
 *         description: GridFS proof document ID
 *     responses:
 *       200:
 *         description: Proof document stream
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid proof document ID
 *       404:
 *         description: Proof document not found
 *       500:
 *         description: Failed to download document
 */
