import { QueryClient } from "@tanstack/react-query";

export const oConsultaCliente = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false
        }
    }
});
