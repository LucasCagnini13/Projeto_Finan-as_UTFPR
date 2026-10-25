import { createSlice } from "@reduxjs/toolkit";

const oEstadoInicial = {
    cPeriodoInicio: "",
    cPeriodoFim: "",
    nCategoriaId: null,
    cTipo: "",
    cValorMin: "",
    cValorMax: "",
    lModalAberto: false
};

const filtroSlice = createSlice({
    name: "filtro",
    initialState: oEstadoInicial,
    reducers: {
        filtroDefinir(oEstado, oAcao) {
            oEstado.cPeriodoInicio = oAcao.payload.cPeriodoInicio || "";
            oEstado.cPeriodoFim = oAcao.payload.cPeriodoFim || "";
            oEstado.nCategoriaId = oAcao.payload.nCategoriaId || null;
            oEstado.cTipo = oAcao.payload.cTipo || "";
            oEstado.cValorMin = oAcao.payload.cValorMin || "";
            oEstado.cValorMax = oAcao.payload.cValorMax || "";
            oEstado.lModalAberto = false;
        },
        filtroLimpar(oEstado) {
            oEstado.cPeriodoInicio = "";
            oEstado.cPeriodoFim = "";
            oEstado.nCategoriaId = null;
            oEstado.cTipo = "";
            oEstado.cValorMin = "";
            oEstado.cValorMax = "";
            oEstado.lModalAberto = false;
        },
        filtroModalDefinir(oEstado, oAcao) {
            oEstado.lModalAberto = oAcao.payload;
        }
    }
});

export const { filtroDefinir, filtroLimpar, filtroModalDefinir } = filtroSlice.actions;

export function filtroObter(oEstado) {
    return oEstado.filtro;
}

export default filtroSlice.reducer;
