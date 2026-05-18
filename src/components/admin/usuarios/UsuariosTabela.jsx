import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import { AlertaFeedback } from "../../AlertaFeedback";
import { SpinnerCentral } from "../../SpinnerCentral";
import { TabelaVazia } from "../../TabelaVazia";
import { ConfirmacaoModal } from "../ConfirmacaoModal";
import { BaseModal } from "../BaseModal";
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

  const handleSalvar = async (form) => {
    const ok = await atualizar(modal.itemAtual.id, form);
    if (ok) modal.fechar();
  };

  const handleDeletar = async () => {
    await deletar(confirmacao.id);
    confirmacao.cancelar();
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
          <i className="bi bi-people me-2 text-primary" />
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
                <th>Nome</th>
                <th>E-mail</th>
                <th>Função</th>
                <th>Perfis</th>
                <th className="text-end">Ações</th>
              </tr>
            </thead>
            <tbody>
              {lista.map((u) => (
                <tr key={u.id}>
                  <td className="fw-semibold">{u.nome}</td>
                  <td className="text-body-secondary">{u.email}</td>
                  <td>
                    {u.funcao ? (
                      <span className="sge-badge-tipo">{u.funcao}</span>
                    ) : (
                      <span className="text-body-secondary">—</span>
                    )}
                  </td>
                  <td>
                    <div className="d-flex flex-wrap gap-1">
                      {(u.perfis ?? []).map((p) => (
                        <span
                          key={p.id ?? p.nome ?? p}
                          className="badge bg-secondary bg-opacity-10 text-secondary rounded-pill"
                        >
                          {p.nome ?? p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-end">
                    <div className="d-flex gap-1 justify-content-end">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        title="Editar"
                        onClick={() => modal.abrirEdicao(u)}
                      >
                        <i className="bi bi-pencil" />
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        title="Deletar"
                        onClick={() =>
                          confirmacao.confirmar(
                            u.id,
                            `Tem certeza que deseja remover "${u.nome}"?`,
                          )
                        }
                      >
                        <i className="bi bi-trash3" />
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
            inicial={modal.itemAtual}
            perfisLista={perfis}
            onSalvar={handleSalvar}
            onCancelar={modal.fechar}
            carregando={salvando}
          />
        </BaseModal>
      )}

      <ConfirmacaoModal
        aberto={confirmacao.aberto}
        titulo="Deletar usuário"
        mensagem={confirmacao.mensagem}
        textoBotao="Deletar"
        onConfirmar={handleDeletar}
        onCancelar={confirmacao.cancelar}
        carregando={salvando}
      />
    </>
  );
}
