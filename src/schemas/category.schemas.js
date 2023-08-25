import { z } from 'zod'

export const createCategorySchema = z.object({
	title: z.string().nonempty(),
	owner: z.string().nonempty(),
	description: z.string().nonempty(),
})

export const updateCategorySchema = createCategorySchema.partial()
