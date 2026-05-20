import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import { AlertaFeedback } from "../../AlertaFeedback";
import { SpinnerCentral } from "../../SpinnerCentral";
import { TabelaVazia } from "../../TabelaVazia";
import { BaseModal } from "../BaseModal";
import { ConfirmacaoModal } from "../ConfirmacaoModal";
import { UsuarioFormulario } from "./UsuarioFormulario";

export function UsuariosTabela({ dados }) {
  const {
    lista,
    perfis,
    carregando,
    salvando,
    erro,
    setErro,
    sucesso,
    setSucesso,
    atualizar,
    deletar,
  } = dados;

  const modal = useModalEdicao();
  const confirmacao = useConfirmacao();

  const handleSalvar = async (dadosFormulario) => {
    const ok = await atualizar(modal.itemAtual.id, dadosFormulario);

    if (ok) modal.fechar();
  };

  const handleConfirmarExclusao = async () => {
    const ok = await deletar(confirmacao.id);

    if (ok) confirmacao.cancelar();
  };

  return (
    <>
      <AlertaFeedback
        sucesso={sucesso}
        erro={erro}
        onFecharSucesso={() => setSucesso("")}
        onFecharErro={() => setErro("")}
      />

      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-people me-2 text-primary" aria-hidden="true" />
          Gerenciar usuários
        </h6>
        <span className="badge bg-primary bg-opacity-10 text-primary">
          {lista.length} usuário(s)
        </span>
      </div>

      {carregando ? (
        <SpinnerCentral />
      ) : lista.length === 0 ? (
        <TabelaVazia icone="bi-person-x" texto="Nenhum usuário encontrado." />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle small">
            <thead className="table-light">
              <tr>
                <th scope="col">Nome</th>
                <th scope="col">E-mail</th>
                <th scope="col">Função</th>
                <th scope="col">Perfis</th>
                <th scope="col" className="text-end">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {lista.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="fw-semibold">{usuario.nome}</td>
                  <td className="text-body-secondary">{usuario.email}</td>
                  <td>
                    {usuario.funcao ? (
                      <span className="sge-badge-tipo">{usuario.funcao}</span>
                    ) : (
                      <span className="text-body-secondary">—</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {(usuario.perfis ?? []).map((perfil) => (
                        <span
                          key={perfil.id ?? perfil.nome}
                          className="sge-badge-tipo"                        >
                          {perfil.nome ?? perfil}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        title="Editar"
                        aria-label={`Editar usuário ${usuario.nome}`}
                        onClick={() => modal.abrirEdicao(usuario)}
                        disabled={salvando}
                      >
                        <i className="bi bi-pencil" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        title="Excluir"
                        aria-label={`Excluir usuário ${usuario.nome}`}
                        onClick={() =>
                          confirmacao.confirmar(
                            usuario.id,
                            `Tem certeza que deseja remover "${usuario.nome}"?`,
                          )
                        }
                        disabled={salvando}
                      >
                        <i className="bi bi-trash3" aria-hidden="true" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal.estaAberto && (
        <BaseModal titulo="Editar usuário" onFechar={modal.fechar}>
          <UsuarioFormulario
            key={modal.itemAtual.id}
            valoresIniciais={modal.itemAtual}
            perfis={perfis}
            onSalvar={handleSalvar}
            onCancelar={modal.fechar}
            salvando={salvando}
          />
        </BaseModal>
      )}

      <ConfirmacaoModal
        aberto={confirmacao.aberto}
        titulo="Excluir usuário"
        mensagem={confirmacao.mensagem}
        textoBotao="Excluir"
        onConfirmar={handleConfirmarExclusao}
        onCancelar={confirmacao.cancelar}
        carregando={salvando}
      />
    </>
  );
}