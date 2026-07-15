import { useState } from "react";
import { useConfirmacao } from "../../../hooks/ui/useConfirmacao";
import { useModalEdicao } from "../../../hooks/ui/useModalEdicao";
import SpinnerCentral from "../../shared/SpinnerCentral";
import TabelaVazia from "../../shared/TabelaVazia";
import BaseModal from "../BaseModal";
import ConfirmacaoModal from "../ConfirmacaoModal";
import UsuarioForm from "./UsuarioForm";

const ITENS_POR_PAGINA = 5;

export default function UsuariosTabela({ dados }) {
  const { lista, perfis, carregando, salvando, atualizar, deletar } = dados;

  const [pagina, setPagina] = useState(1);

  const modal = useModalEdicao();
  const confirmacao = useConfirmacao();

  const totalPaginas = Math.ceil(lista.length / ITENS_POR_PAGINA);
  const listaPaginada = lista.slice(
    (pagina - 1) * ITENS_POR_PAGINA,
    pagina * ITENS_POR_PAGINA
  );

  const handleSalvar = async (dadosFormulario) => {
    await atualizar(modal.itemAtual.id, dadosFormulario);
    modal.fechar();
  };

  const handleConfirmarExclusao = async () => {
    await deletar(confirmacao.id);
    confirmacao.cancelar();
  };

  return (
    <>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h6 className="fw-bold text-body-emphasis mb-0">
          <i className="bi bi-people me-2 text-primary" aria-hidden="true" />
          Gerenciar usuários
        </h6>
        {/* <span className="badge bg-primary bg-opacity-10 text-primary">
          {lista.length} usuário(s)
        </span> */}
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
              {listaPaginada.map((usuario) => (
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
                          className="sge-badge-tipo"
                        >
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
          <div className="d-flex justify-content-between align-items-center mt-2 me-2">
            <span className="badge bg-primary bg-opacity-10 text-primary">
              {lista.length} usuário(s)
            </span>

            {totalPaginas > 1 && (
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setPagina((p) => p - 1)}
                  disabled={pagina === 1}
                >
                  <i className="bi bi-chevron-left" />
                </button>
                <span className="small text-body-secondary">
                  {pagina} / {totalPaginas}
                </span>
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setPagina((p) => p + 1)}
                  disabled={pagina === totalPaginas}
                >
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {modal.estaAberto && (
        <BaseModal titulo="Editar usuário" onFechar={modal.fechar}>
          <UsuarioForm
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