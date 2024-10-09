import { delay, http, HttpResponse } from "msw";
import { server } from "./mocks/server";

export const simulateDelay = (route: string) => {
    server.use(
        http.get(route, async () => {
            await delay();
            return HttpResponse.json([]);
        })
    );
};

export const simulateDataFetchingFail = (route: string) => {
    server.use(http.get(route, () => HttpResponse.error()));
};