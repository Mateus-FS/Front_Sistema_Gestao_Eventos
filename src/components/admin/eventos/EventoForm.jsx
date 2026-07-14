import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { eventoSchema } from "../../../utils/admin/eventoSchema";
import { paraInputDatetimeLocal } from "../../../utils/formatacoes";

const TIPOS_EVENTO = ["CURSO", "PALESTRA", "WORKSHOP"];

export default function EventoForm({
  valoresIniciais = {},
  salas = [],
  organizadores = [],
  onSalvar,
  onCancelar,
  salvando = false,
}) {
  const dataMinima = new Date().toISOString().slice(0, 16);
  const modoEdicao = Boolean(valoresIniciais.id);

  const schema = useMemo(() => eventoSchema(modoEdicao), [modoEdicao]);

  const salaIdInicial = String(
    valoresIniciais.salaId ?? valoresIniciais.sala?.id ?? ""
  );
  const salaInicial = salas.find((s) => String(s.id) === salaIdInicial);

  const [blocoSelecionado, setBlocoSelecionado] = useState(
    salaInicial?.bloco ?? ""
  );

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm(
    {
      resolver: zodResolver(schema),
      defaultValues: {
        titulo: valoresIniciais.titulo ?? "",
        descricao: valoresIniciais.descricao ?? "",
        tipoEvento: valoresIniciais.tipoEvento ?? "",
        dataInicio: paraInputDatetimeLocal(valoresIniciais.dataInicio),
        dataTermino: paraInputDatetimeLocal(valoresIniciais.dataTermino),
        salaId: salaIdInicial,
        organizadorId: String(
          valoresIniciais.organizadorId ?? valoresIniciais.organizador?.id ?? ""
        ),
      },
    });

  const dataInicio = watch("dataInicio");

  const blocos = useMemo(() => {
    const unicos = new Set(salas.map((s) => s.bloco).filter(Boolean));
    return Array.from(unicos).sort();
  }, [salas]);

  const salasDoBloco = useMemo(
    () => salas.filter((s) => !blocoSelecionado || s.bloco === blocoSelecionado),
    [salas, blocoSelecionado]
  );

  const handleBlocoChange = (e) => {
    setBlocoSelecionado(e.target.value);
    setValue("salaId", "");
  };

  const onSubmit = (data) => onSalvar(data);

  const onInvalid = () => {
    toast.warning("Preencha todos os campos obrigatórios.");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="row g-3" noValidate>
      <div className="col-12">
        <label htmlFor="evento-titulo" className="form-label fw-semibold small">
          Título *
        </label>
        <input
          id="evento-titulo"
          className={`form-control sge-input${errors.titulo ? " is-invalid" : ""}`}
          disabled={salvando}
          placeholder="Nome do evento"
          {...register("titulo")}
        />
        {errors.titulo && (
          <div className="invalid-feedback">{errors.titulo.message}</div>
        )}
      </div>

      <div className="col-12">
        <label htmlFor="evento-descricao" className="form-label fw-semibold small">
          Descrição
        </label>
        <textarea
          id="evento-descricao"
          className={`form-control sge-input${errors.descricao ? " is-invalid" : ""}`}
          rows={3}
          disabled={salvando}
          placeholder="Descrição do evento"
          {...register("descricao")}
        />
        {errors.descricao && (
          <div className="invalid-feedback">{errors.descricao.message}</div>
        )}
      </div>

      <div className="col-md-4">
        <label htmlFor="evento-tipo" className="form-label fw-semibold small">
          Tipo *
        </label>
        <select
          id="evento-tipo"
          className={`form-select sge-input${errors.tipoEvento ? " is-invalid" : ""}`}
          disabled={salvando}
          {...register("tipoEvento")}
        >
          <option value="">Selecione...</option>
          {TIPOS_EVENTO.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>
        {errors.tipoEvento && (
          <div className="invalid-feedback">{errors.tipoEvento.message}</div>
        )}
      </div>

      <div className="col-md-4">
        <label htmlFor="evento-inicio" className="form-label fw-semibold small">
          Início *
        </label>
        <input
          id="evento-inicio"
          type="datetime-local"
          className={`form-control sge-input${errors.dataInicio ? " is-invalid" : ""}`}
          disabled={salvando}
          min={modoEdicao ? undefined : dataMinima}
          {...register("dataInicio")}
        />
        {errors.dataInicio && (
          <div className="invalid-feedback">{errors.dataInicio.message}</div>
        )}
      </div>

      <div className="col-md-4">
        <label htmlFor="evento-termino" className="form-label fw-semibold small">
          Término *
        </label>
        <input
          id="evento-termino"
          type="datetime-local"
          className={`form-control sge-input${errors.dataTermino ? " is-invalid" : ""}`}
          disabled={salvando}
          min={dataInicio || dataMinima}
          {...register("dataTermino")}
        />
        {errors.dataTermino && (
          <div className="invalid-feedback">{errors.dataTermino.message}</div>
        )}
      </div>

      <div className="col-md-3">
        <label htmlFor="evento-bloco" className="form-label fw-semibold small">
          Bloco
        </label>
        <select
          id="evento-bloco"
          className="form-select sge-input"
          disabled={salvando}
          value={blocoSelecionado}
          onChange={handleBlocoChange}
        >
          <option value="">Todos os blocos</option>
          {blocos.map((bloco) => (
            <option key={bloco} value={bloco}>
              {bloco}
            </option>
          ))}
        </select>
        <div className="form-text">Filtra as salas abaixo.</div>
      </div>

      <div className="col-md-3">
        <label htmlFor="evento-sala" className="form-label fw-semibold small">
          Sala *
        </label>
        <select
          id="evento-sala"
          className={`form-select sge-input${errors.salaId ? " is-invalid" : ""}`}
          disabled={salvando}
          {...register("salaId")}
        >
          <option value="">Selecione...</option>
          {salasDoBloco.map((sala) => (
            <option key={sala.id} value={String(sala.id)}>
              {sala.nome} ({sala.capacidade} lugares)
            </option>
          ))}
        </select>
        {errors.salaId && (
          <div className="invalid-feedback">{errors.salaId.message}</div>
        )}
      </div>

      <div className="col-md-6">
        <label htmlFor="evento-organizador" className="form-label fw-semibold small">
          Organizador
        </label>
        <select
          id="evento-organizador"
          className={`form-select sge-input${errors.organizadorId ? " is-invalid" : ""}`}
          disabled={salvando}
          {...register("organizadorId")}
        >
          <option value="">Selecione...</option>
          {organizadores.map((usuario) => (
            <option key={usuario.id} value={String(usuario.id)}>
              {usuario.nome}
            </option>
          ))}
        </select>
        {errors.organizadorId && (
          <div className="invalid-feedback">{errors.organizadorId.message}</div>
        )}
      </div>

      <div className="col-12 d-flex gap-2 justify-content-end pt-2">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={onCancelar}
          disabled={salvando}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn sge-btn-login btn-sm text-white"
          disabled={salvando}
        >
          {salvando ? (
            <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true" />
          ) : (
            <i className="bi bi-check-lg me-1" aria-hidden="true" />
          )}
          {modoEdicao ? "Salvar alterações" : "Criar evento"}
        </button>
      </div>
    </form>
  );
}