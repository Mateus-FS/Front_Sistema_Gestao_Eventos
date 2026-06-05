import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MeuPerfilSchema } from "../../../utils/usuario/meuPerfilSchema";
import FuncaoSelect from "../../shared/FuncaoSelect";
import NomeInput from "../../shared/NomeInput";
import SenhaConfirmacaoInput from "../../shared/SenhaConfirmacaoInput";
import SenhaInput from "../../shared/SenhaInput";

export default function MeuPerfilForm({ usuario, onSalvar, salvando }) {
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(MeuPerfilSchema),
        defaultValues: {
            nome: "",
            funcao: "",
            senha: "",
            confirmarSenha: "",
        },
    });

    useEffect(() => {
        if (usuario) {
            reset({
                nome: usuario.nome ?? "",
                funcao: usuario.funcao ?? "",
                senha: "",
                confirmarSenha: "",
            });
        }
    }, [usuario, reset]);

    const PERFIL_IDS = {
        ADMIN: 1,
        USER: 2,
    };

    const onSubmit = (data) => {
        console.log("funcao:", data.funcao);
        onSalvar({
            nome: data.nome,
            funcao: data.funcao,
            email: usuario.email,
            senha: data.senha || usuario.senha,
            perfisIds: usuario.perfis.map((p) => PERFIL_IDS[p]).filter(Boolean),
        });
    };

    const onInvalid = () => {
        toast.warning("Preencha todos os campos obrigatórios.");
    };

    return (
        <div className="card sge-card border-0 shadow-sm">
            <div className="card-body p-4">
                <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="d-flex flex-column gap-3" noValidate>
                    <NomeInput
                        registration={register("nome")}
                        error={errors.nome?.message}
                    />

                    <FuncaoSelect
                        registration={register("funcao")}
                        error={errors.funcao?.message}
                    />

                    <SenhaInput
                        label="Nova senha"
                        registration={register("senha")}
                        error={errors.senha?.message}
                        mostrarSenha={mostrarSenha}
                        toggleSenha={() => setMostrarSenha((v) => !v)}
                        autoComplete="new-password"
                        disabled={salvando}
                    />

                    <SenhaConfirmacaoInput
                        registration={register("confirmarSenha")}
                        error={errors.confirmarSenha?.message}
                        mostrarSenha={mostrarConfirmacao}
                        toggleSenha={() => setMostrarConfirmacao((v) => !v)}
                        disabled={salvando}
                    />

                    <button
                        type="submit"
                        disabled={salvando}
                        className="btn btn-primary sge-btn-login w-100"
                    >
                        {salvando ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-check-lg me-1" aria-hidden="true" />
                                Salvar alterações
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}