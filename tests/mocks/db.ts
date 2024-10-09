import { factory, manyOf, oneOf, primaryKey } from '@mswjs/data'
import {faker} from '@faker-js/faker'

// Will act as data generator for our mock data
export const db = factory({
    product:  {
        id: primaryKey(() => faker.number.int({min:1, max: 100})),
        name: faker.commerce.productName,
        price: () => faker.number.float({min: 1, max: 100}),
        categoryId: () => faker.number.int({min:1, max: 100}),
        category: oneOf('category')
    },
    category: {
        id: primaryKey(() => faker.number.int({min:1, max: 100})),
        name: faker.commerce.department,
        products: manyOf('product')
    }
})