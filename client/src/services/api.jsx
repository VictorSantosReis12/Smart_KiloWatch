// Web
// const BASE_URL = 'http://localhost:3000'

// IP
const BASE_URL = 'http://192.168.0.202:3000'

export async function cadastrarUsuario(nome, email, senha, ativarNotificacao) {
    const response = await fetch(`${BASE_URL}/usuario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha, ativarNotificacao })
    });
    return response.json();
}

export async function login(email, senha) {
    const response = await fetch(`${BASE_URL}/usuario/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
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

export async function excluirUsuario(userToken, idUsuario) {
    const response = await fetch(`${BASE_URL}/usuario/${idUsuario}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        }
    });

    return response.json();
}

export async function editarNotificacaoUsuario(userToken, idUsuario, ativarNotificacao) {
    const response = await fetch(`${BASE_URL}/usuario/setNotificacao/${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ ativarNotificacao })
    });
    return response.json();
}

export async function editarNomeUsuario(userToken, idUsuario, nome, email, senhaAtual) {
    const response = await fetch(`${BASE_URL}/usuario/setNome/${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ nome, email, senhaAtual })
    });
    return response.json();
}

export async function editarEmailUsuario(userToken, idUsuario, nome, email) {
    const response = await fetch(`${BASE_URL}/usuario/setEmail/${idUsuario}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ nome, email })
    });
    return response.json();
}

export async function editarUsuario(userToken, idUsuario, nome, email, senhaAtual, senhaNova, ativarNotificacao) {
    const response = await fetch(`${BASE_URL}/usuario/${idUsuario}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ nome, email, senhaAtual, senhaNova, ativarNotificacao })
    });
    return response.json();
}

export async function cadastrarResidencia(userToken, idUsuario, estado, cidade, rua, numero, complemento) {
    const response = await fetch(`${BASE_URL}/residencia`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ idUsuario, estado, cidade, rua, numero, complemento })
    });
    return response.json();
}

export async function listarResidenciasPorUsuario(userToken, idUsuario) {
    const response = await fetch(`${BASE_URL}/residencia/listarPorUsuario/${idUsuario}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function editarResidencia(userToken, idUsuario, estado, cidade, rua, numero, complemento, idResidencia) {
    const response = await fetch(`${BASE_URL}/residencia/${idResidencia}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ idUsuario, estado, cidade, rua, numero, complemento })
    });
    return response.json();
}

export async function excluirResidencia(userToken, idResidencia) {
    const response = await fetch(`${BASE_URL}/residencia/${idResidencia}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function enviarEmail(userToken, nome, email, assunto, mensagem) {
    const response = await fetch(`${BASE_URL}/suporte`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ nome, email, assunto, mensagem })
    });
    return response.json();
}

export async function listarMetasPorUsuario(userToken, idUsuario) {
    const response = await fetch(`${BASE_URL}/meta/listarPorUsuario/${idUsuario}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function cadastrarMeta(userToken, idUsuario, metaEnergia, metaAgua) {
    const response = await fetch(`${BASE_URL}/meta`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ idUsuario, metaEnergia, metaAgua })
    });
    return response.json();
}

export async function editarMeta(userToken, idMeta, idUsuario, metaEnergia, metaAgua, dataRegistro) {
    const response = await fetch(`${BASE_URL}/meta/${idMeta}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ idUsuario, metaEnergia, metaAgua, dataRegistro })
    });
    return response.json();
}