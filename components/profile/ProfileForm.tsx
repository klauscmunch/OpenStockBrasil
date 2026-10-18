'use client';

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import InputField from "@/components/forms/InputField";
import ChoiceChips from "@/components/forms/ChoiceChips";
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import { INVESTMENT_GOALS, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { updateProfile, type ProfileInput } from "@/lib/actions/profile.actions";

export default function ProfileForm({ initial }: { initial: ProfileInput }) {
    const router = useRouter();
    const { register, control, handleSubmit, formState: { errors, isSubmitting, isDirty }, reset } = useForm<ProfileInput>({
        defaultValues: initial,
        mode: 'onBlur',
    });

    const onSubmit = async (values: ProfileInput) => {
        const result = await updateProfile(values);
        if (!result.success) {
            toast.error('Não foi possível salvar', { description: result.error });
            return;
        }
        toast.success('Perfil salvo');
        reset(values);
        router.refresh();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 p-4">
            <InputField
                name="name"
                label="Nome"
                placeholder="Seu nome"
                register={register}
                error={errors.name}
                validation={{ required: 'Informe o nome', minLength: { value: 2, message: 'Pelo menos 2 caracteres' } }}
            />
            <CountrySelectField name="country" label="País" control={control} error={errors.country} required />
            <ChoiceChips name="investmentGoals" label="Objetivo de investimento" options={INVESTMENT_GOALS} control={control} />
            <ChoiceChips name="riskTolerance" label="Tolerância a risco" options={RISK_TOLERANCE_OPTIONS} control={control} />
            <ChoiceChips name="preferredIndustry" label="Setor preferido" options={PREFERRED_INDUSTRIES} control={control} />
            <div className="flex items-center gap-3 pt-1">
                <button type="submit" disabled={isSubmitting || !isDirty} className="btn btn-primary">
                    {isSubmitting ? 'Salvando' : 'Salvar alterações'}
                </button>
                {!isDirty && <span className="text-[13px] text-faint">Tudo salvo</span>}
            </div>
        </form>
    );
}
