import { createSlice } from "@reduxjs/toolkit";

const oEstadoInicial = {
    lAutenticado: false,
    oUsuario: null
};

const sessaoSlice = createSlice({
    name: "sessao",
    initialState: oEstadoInicial,
    reducers: {
        sessaoIniciar(oEstado, oAcao) {
            oEstado.lAutenticado = true;
            oEstado.oUsuario = oAcao.payload;
        },
        sessaoEncerrar(oEstado) {
            oEstado.lAutenticado = false;
            oEstado.oUsuario = null;
        }
    }
});

export const { sessaoIniciar, sessaoEncerrar } = sessaoSlice.actions;

export function sessaoAutenticadaObter(oEstado) {
    return oEstado.sessao.lAutenticado;
}

export function sessaoUsuarioObter(oEstado) {
    return oEstado.sessao.oUsuario;
}

export default sessaoSlice.reducer;
