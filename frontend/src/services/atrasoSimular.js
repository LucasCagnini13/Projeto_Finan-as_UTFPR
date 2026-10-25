export function atrasoSimular(nMilissegundos = 700) {
    return new Promise((resolver) => {
        setTimeout(resolver, nMilissegundos);
    });
}
