import { z } from 'zod'

export const createProductSchema = z.object({
	title: z.string().nonempty(),
	owner: z.string().nonempty(),
	description: z.string().nonempty(),
	category: z.string().nonempty(),
	price: z.number().nonnegative(),
})

export const updateProductSchema = createProductSchema.partial()
