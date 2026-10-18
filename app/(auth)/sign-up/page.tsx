'use client';

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import InputField from "@/components/forms/InputField";
import ChoiceChips from "@/components/forms/ChoiceChips";
import PasswordRequirements from "@/components/forms/PasswordRequirements";
import { INVESTMENT_GOALS, PASSWORD_VALIDATION, PREFERRED_INDUSTRIES, RISK_TOLERANCE_OPTIONS } from "@/lib/constants";
import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import { signUpWithEmail } from "@/lib/actions/auth.actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import OpenDevSocietyBranding from "@/components/OpenDevSocietyBranding";
import SocialAuthButtons from "@/components/forms/SocialAuthButtons";
import React from "react";

const SignUp = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<SignUpFormData>({
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            country: 'BR',
            investmentGoals: 'Growth',
            riskTolerance: 'Medium',
            preferredIndustry: 'Technology'
        },
        mode: 'onBlur'
    },);

    const passwordValue = watch('password');

    const onSubmit = async (data: SignUpFormData) => {
        try {
            const result = await signUpWithEmail(data);
            if (result.success) {
                router.push('/dashboard');
                return;
            }
            toast.error('Falha no cadastro', {
                description: result.error ?? 'Não conseguimos criar sua conta.',
            });
        } catch (e) {
            console.error(e);
            toast.error('Falha no cadastro', {
                description: e instanceof Error ? e.message : 'Não foi possível criar a conta.'
            })
        }
    }

    return (
        <>
            <h1 className="form-title mb-2">Crie sua conta</h1>
            <p className="mb-8 text-faint">Gratuito e open source. Sem cartão de crédito.</p>

            <SocialAuthButtons />

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
                <section className="flex flex-col gap-4" aria-label="Conta">
                    <InputField
                        name="fullName"
                        label="Nome completo"
                        placeholder="Seu nome"
                        register={register}
                        error={errors.fullName}
                        validation={{ required: 'Informe seu nome completo', minLength: 2 }}
                    />
                    <InputField
                        name="email"
                        label="E-mail"
                        placeholder="voce@exemplo.com"
                        register={register}
                        error={errors.email}
                        validation={{
                            required: 'Informe o e-mail',
                            pattern: {
                                value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
                                message: 'Informe um e-mail válido'
                            }
                        }}
                    />
                    <div className="flex flex-col gap-2">
                        <InputField
                            name="password"
                            label="Senha"
                            placeholder="Pelo menos 8 caracteres"
                            type="password"
                            register={register}
                            error={errors.password}
                            validation={PASSWORD_VALIDATION}
                        />
                        <PasswordRequirements password={passwordValue ?? ''} />
                    </div>
                </section>

                <section className="flex flex-col gap-5 border-t border-line pt-6" aria-labelledby="personalize">
                    <div>
                        <p id="personalize" className="kicker text-brand-ink">Personalize</p>
                        <p className="mt-1 text-[13px] text-faint">Usado para personalizar seu e-mail de boas-vindas.</p>
                    </div>
                    <CountrySelectField
                        name="country"
                        label="País"
                        control={control}
                        error={errors.country}
                        required
                    />
                    <ChoiceChips name="investmentGoals" label="Objetivo de investimento" options={INVESTMENT_GOALS} control={control} />
                    <ChoiceChips name="riskTolerance" label="Tolerância a risco" options={RISK_TOLERANCE_OPTIONS} control={control} />
                    <ChoiceChips name="preferredIndustry" label="Setor preferido" options={PREFERRED_INDUSTRIES} control={control} />
                </section>

                <div className="flex flex-col gap-4">
                    <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full">
                        {isSubmitting ? 'Criando conta' : 'Criar conta'}
                    </Button>
                    <FooterLink text="Já tem conta?" linkText="Entrar" href="/sign-in" />
                </div>

                <OpenDevSocietyBranding outerClassName="flex justify-center" />
            </form>
        </>
    )
}
export default SignUp;
