import { configureStore } from "@reduxjs/toolkit";
import filtroReducer from "./filtroSlice";
import sessaoReducer from "./sessaoSlice";

export const oStore = configureStore({
    reducer: {
        sessao: sessaoReducer,
        filtro: filtroReducer
    }
});
