// This file is used to define our request handlers
import { http, HttpResponse } from 'msw';
import { categoriesList, productsList } from './data';

export const handlers = [
    http.get('/categories', () => {
        return HttpResponse.json(categoriesList)
    }),
    http.get('/products', () => {
        return HttpResponse.json(productsList)
    }),
    http.get("/products/:id", ({params}) => {
        const id = parseInt(params.id as string);
        const product = productsList.find((p) => p.id === id)
        if(!product) {
            return new HttpResponse("null", {status: 400});
        }
        return HttpResponse.json(product);
    })
]
