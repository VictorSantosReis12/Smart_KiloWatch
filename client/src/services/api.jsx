const BASE_URL = "http://192.168.0.17:3000"
// const BASE_URL = "http://localhost:3000"

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