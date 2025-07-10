// src/utils/protegerRotas.js
function protegerRotas(router, middleware, rotasPrivadas = []) {
    router.stack.forEach((layer) => {
        const rota = layer.route;

        if (!rota) return; // Pula se não for uma rota
        const caminho = rota.path;

        // Se a lista estiver vazia, aplica em todas. Se não, aplica só nas selecionadas.
        const deveProteger = rotasPrivadas.length === 0 || rotasPrivadas.includes(caminho);

        if (deveProteger) {
            rota.stack.unshift({
                handle: middleware,
                name: middleware.name,
                handleRequest: middleware,
            });
        }
    });
}

module.exports = protegerRotas;