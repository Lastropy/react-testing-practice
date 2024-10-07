// This file is used to define our request handlers
import { http, HttpResponse } from 'msw';

export const handlers = [
    http.get('/categories', () => {
        return HttpResponse.json([
            {id:1, name: 'Electronics'},
            {id:2, name: 'Beauty'},
            {id:3, name: 'Gardening'},
        ])
    }),
    http.get('/products', () => {
        return HttpResponse.json([
            {id:1, name: 'Hand-held trimmer'},
            {id:2, name: 'Comb'},
            {id:3, name: 'Electric Toothbrush'},
        ])
    })
]
