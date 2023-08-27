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
					itens: allCategorieProducts,
				})
			}
		}

		return catalog
	}
}
