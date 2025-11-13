// Web
// const BASE_URL = 'http://localhost:3000'

// IP
const BASE_URL = 'http://192.168.0.10:3000'

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

export async function cadastrarEletrodomestico(userToken, idUsuario, tipo, marca, modelo, imagem, consumoKwhMes, consumoKwhHora, manterTempo) {
    const response = await fetch(`${BASE_URL}/eletrodomestico`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ idUsuario, tipo, marca, modelo, imagem, consumoKwhMes, consumoKwhHora, manterTempo })
    });
    return response.json();
}

export async function editarEletrodomestico(userToken, idEletrodomestico, idUsuario, tipo, marca, modelo, imagem, consumoKwhMes, consumoKwhHora, manterTempo) {
    const response = await fetch(`${BASE_URL}/eletrodomestico/${idEletrodomestico}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ idUsuario, tipo, marca, modelo, imagem, consumoKwhMes, consumoKwhHora, manterTempo })
    });
    return response.json();
}

export async function excluirEletrodomestico(userToken, idEletrodomestico) {
    const response = await fetch(`${BASE_URL}/eletrodomestico/${idEletrodomestico}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function editarManterTempoEletrodomestico(userToken, idEletrodomestico, manterTempo) {
    const response = await fetch(`${BASE_URL}/eletrodomestico/setManterTempo/${idEletrodomestico}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ manterTempo })
    });
    return response.json();
}

export async function cadastrarConsumoEnergia(userToken, idEletrodomestico, tempo, tipo) {
    const response = await fetch(`${BASE_URL}/consumoEnergia`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ idEletrodomestico, tempo, tipo })
    });
    return response.json();
}

export async function editarTempoConsumoEnergia(userToken, idConsumoEnergia, tempo) {
    const response = await fetch(`${BASE_URL}/consumoEnergia/setTempo/${idConsumoEnergia}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ tempo })
    });
    return response.json();
}

export async function editarTipoConsumoEnergia(userToken, idConsumoEnergia, tipo) {
    const response = await fetch(`${BASE_URL}/consumoEnergia/setTipo/${idConsumoEnergia}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ tipo })
    });
    return response.json();
}

export async function excluirConsumoEnergia(userToken, idConsumoEnergia) {
    const response = await fetch(`${BASE_URL}/consumoEnergia/${idConsumoEnergia}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function listarEletrodomesticosPorUsuario(userToken, idUsuario) {
    const response = await fetch(`${BASE_URL}/eletrodomestico/listarPorUsuario/${idUsuario}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function selecionarEletrodomesticoPorId(userToken, idEletrodomestico) {
    const response = await fetch(`${BASE_URL}/eletrodomestico/selecionarPorId/${idEletrodomestico}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function listarConsumoEnergiaPorEletrodomestico(userToken, idEletrodomestico) {
    const response = await fetch(`${BASE_URL}/consumoEnergia/listarPorEletrodomestico/${idEletrodomestico}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function listarConsumoEnergiaPorUsuario(userToken, idUsuario) {
    try {
        const eletrosResp = await listarEletrodomesticosPorUsuario(userToken, idUsuario);

        if (!eletrosResp.success || !Array.isArray(eletrosResp.data)) {
            return { success: false, message: "Erro ao buscar eletrodomésticos", data: [] };
        }

        const eletros = eletrosResp.data;

        const lista = await Promise.all(
            eletros.map(async (item) => {
                const consumoResp = await listarConsumoEnergiaPorEletrodomestico(userToken, item.id_eletrodomestico);

                return consumoResp.success
                    ? consumoResp.data.map(consumo => ({
                        id_eletrodomestico: item.id_eletrodomestico,
                        tipo: item.tipo,
                        marca: item.marca,
                        modelo: item.modelo,
                        imagem: item.imagem,
                        consumo_kwh_hora: item.consumo_kwh_hora,
                        consumo_kwh_mes: item.consumo_kwh_mes,
                        manter_tempo: item.manter_tempo,
                        tempo: consumo.tempo,
                        tipoTempo: consumo.tipo,
                        data_registro: consumo.data_registro,
                    }))
                    : [];
            })
        );

        const consumosFlattened = lista.flat();

        return { success: true, message: "Todos os consumos de energia do usuário listados com sucesso!", data: consumosFlattened };
    } catch (err) {
        console.error("Erro em listarConsumoEnergiaPorUsuario:", err);
        return { success: false, message: "Erro interno ao listar consumos de energia por usuário", data: [] };
    }
}

export async function cadastrarAtividade(userToken, idUsuario, nome, imagem, litrosMinuto, isTempoUso, manterTempoUso) {
    const response = await fetch(`${BASE_URL}/atividade`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ idUsuario, nome, imagem, litrosMinuto, isTempoUso, manterTempoUso })
    });
    return response.json();
}

export async function editarAtividade(userToken, idAtividade, idUsuario, nome, imagem, litrosMinuto, manterTempoUso) {
    const response = await fetch(`${BASE_URL}/atividade/${idAtividade}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ idUsuario, nome, imagem, litrosMinuto, manterTempoUso })
    });
    return response.json();
}

export async function excluirAtividade(userToken, idAtivdade) {
    const response = await fetch(`${BASE_URL}/atividade/${idAtivdade}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function editarLitrosMinutoAtividade(userToken, idAtividade, litrosMinuto) {
    const response = await fetch(`${BASE_URL}/atividade/setLitrosMinuto/${idAtividade}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ litrosMinuto })
    });
    return response.json();
}

export async function editarManterTempoUsoAtividade(userToken, idAtividade, manterTempoUso) {
    const response = await fetch(`${BASE_URL}/atividade/setManterTempoUso/${idAtividade}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${userToken}`
        },
        body: JSON.stringify({ manterTempoUso })
    });
    return response.json();
}

export async function cadastrarConsumoAgua(userToken, idAtividade, tempoUso, tipo) {
    const response = await fetch(`${BASE_URL}/consumoAgua`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ idAtividade, tempoUso, tipo })
    });
    return response.json();
}

export async function editarTempoConsumoAgua(userToken, idConsumoAgua, tempoUso) {
    const response = await fetch(`${BASE_URL}/consumoAgua/setTempoUso/${idConsumoAgua}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ tempoUso })
    });
    return response.json();
}

export async function editarTipoConsumoAgua(userToken, idConsumoAgua, tipo) {
    const response = await fetch(`${BASE_URL}/consumoAgua/setTipo/${idConsumoAgua}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({ tipo })
    });
    return response.json();
}

export async function excluirConsumoAgua(userToken, idConsumoAgua) {
    const response = await fetch(`${BASE_URL}/consumoAgua/${idConsumoAgua}`, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function listarAtividadesPorUsuario(userToken, idUsuario) {
    const response = await fetch(`${BASE_URL}/atividade/listarPorUsuario/${idUsuario}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function selecionarAtividadePorId(userToken, idAtividade) {
    const response = await fetch(`${BASE_URL}/atividade/selecionarPorId/${idAtividade}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function listarConsumoAguaPorAtividade(userToken, idAtividade) {
    const response = await fetch(`${BASE_URL}/consumoAgua/listarPorAtividade/${idAtividade}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function listarConsumoAguaPorUsuario(userToken, idUsuario) {
    try {
        const atividadesResp = await listarAtividadesPorUsuario(userToken, idUsuario);

        if (!atividadesResp.success || !Array.isArray(atividadesResp.data)) {
            return { success: false, message: "Erro ao buscar atividades", data: [] };
        }

        const atividades = atividadesResp.data;

        const lista = await Promise.all(
            atividades.map(async (item) => {
                const consumoResp = await listarConsumoAguaPorAtividade(userToken, item.id_atividade);

                return consumoResp.success
                    ? consumoResp.data.map(consumo => ({
                        id_atividade: item.id_atividade,
                        nome: item.nome,
                        imagem: item.imagem,
                        consumo_litros_minuto: item.litros_minuto,
                        is_tempo_uso: item.is_tempo_uso,
                        manter_tempo_uso: item.manter_tempo_uso,
                        tempo_uso: consumo.tempo_uso,
                        tipoTempo: consumo.tipo,
                        data_registro: consumo.data_registro,
                    }))
                    : [];
            })
        );

        const consumosFlattened = lista.flat();

        return { success: true, message: "Todos os consumos de água do usuário listados com sucesso!", data: consumosFlattened };
    } catch (err) {
        console.error("Erro em listarConsumoAguaPorUsuario:", err);
        return { success: false, message: "Erro interno ao listar consumos de água por usuário", data: [] };
    }
}

export async function listarCustosPorUsuario(userToken, idUsuario) {
    const response = await fetch(`${BASE_URL}/custo/listarPorUsuario/${idUsuario}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        }
    });
    return response.json();
}

export async function editarCusto(userToken, idCusto, idUsuario, valorEnergiaSemImposto, valorEnergiaComImposto, valorAguaSemImposto, valorAguaComImposto, dataRegistro) {
    const response = await fetch(`${BASE_URL}/custo/${idCusto}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
            idUsuario,
            valorEnergiaSemImpostos: valorEnergiaSemImposto,
            valorEnergiaComImpostos: valorEnergiaComImposto,
            valorAguaSemImpostos: valorAguaSemImposto,
            valorAguaComImpostos: valorAguaComImposto,
            dataRegistro
        })
    });
    return response.json();
}