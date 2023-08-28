import { AWSS3 } from '../utils/aws'

export class CatalogService {
	#db

	constructor(db) {
		this.#db = db
	}

	async generateCatalogJSON(owner) {
		const categories = this.#db.collection('categories')
		const products = this.#db.collection('products')
		let catalog = {
			owner: owner,
			catalog: [],
		}

		const allCategories = await categories.find({ owner: owner }).toArray()

		for (let categorie of allCategories) {
			const allCategorieProducts = await products
				.find({
					owner: owner,
					category: categorie.title,
				})
				.toArray()
			if (allCategorieProducts.length > 0) {
				catalog.catalog.push({
					category_title: categorie.title,
					category_description: categorie.description,
					itens: allCategorieProducts.map((product) => ({
						title: product.title,
						description: product.description,
						price: product.price,
					})),
				})
			}
		}

		return catalog
	}

	async uploadCatalogToS3(data) {
		const s3 = new AWSS3()

		await s3.uploadS3JSONFile(`catalog-${data.owner}.json`, data)
	}

	async getCatalogFromS3(owner) {
		const s3 = new AWSS3()
		const data = s3.getContentS3JSONFile(`catalog-${owner}.json`)
		return data
	}

	async generateCatalogAndUploadToS3(owner) {
		const catalogData = await this.generateCatalogJSON(owner)
		await this.uploadCatalogToS3(catalogData)
	}
}
