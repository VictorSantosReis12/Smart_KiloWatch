// Web
const BASE_URL = 'http://localhost:3000'

// IP
// const BASE_URL = 'http://10.1.90.69:3000'

export async function cadastrarUsuario(nome, email, senha, ativarNotificacao) {
    const response = await fetch(`${BASE_URL}/usuario`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({nome, email, senha, ativarNotificacao})
    });
    return response.json();
}

export async function login(email, senha) {
    const response = await fetch(`${BASE_URL}/usuario/login`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, senha})
    });
    return response.json();
}

export async function buscarUsuarioPorEmail(email) {
    const response = await fetch(`${BASE_URL}/usuario/listarPorEmail?email=${email}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });

    const result = await response.json();
    return result.data;
}