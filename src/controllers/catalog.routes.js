import { DatabaseConfig } from '../configs/database'
import { CatalogService } from '../services/catalog.service'

export async function testCatalog(req, res) {
	const catalogService = new CatalogService(DatabaseConfig.getDatabase())
	return res.json(await catalogService.getCatalogFromS3(req.params.owner))
}
