'use client';

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import { signInWithEmail } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OpenDevSocietyBranding from "@/components/OpenDevSocietyBranding";
import SocialAuthButtons from "@/components/forms/SocialAuthButtons";
import React from "react";

const SignIn = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInFormData>({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: SignInFormData) => {
        try {
            const result = await signInWithEmail(data);
            if (result.success) {
                router.push('/dashboard');
                return;
            }
            toast.error('Falha ao entrar', {
                description: result.error ?? 'E-mail ou senha inválidos.',
            });
        } catch (e) {
            console.error(e);
            toast.error('Falha ao entrar', {
                description: e instanceof Error ? e.message : 'Não foi possível entrar.'
            })
        }
    }

    return (
        <>
            <h1 className="form-title mb-2">Bem-vindo de volta</h1>
            <p className="mb-8 text-faint">Entre para ver sua watchlist e seus alertas.</p>

            <SocialAuthButtons />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

                <InputField
                    name="password"
                    label="Senha"
                    placeholder="Digite sua senha"
                    type="password"
                    register={register}
                    error={errors.password}
                    validation={{ required: 'Informe a senha', minLength: 8 }}
                />

                <div className="flex justify-end">
                    <Link href="/forgot-password" className="footer-link text-sm">
                        Esqueceu a senha?
                    </Link>
                </div>

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Entrando' : 'Entrar'}
                </Button>

                <FooterLink text="Ainda não tem conta?" linkText="Criar conta" href="/sign-up" />
                <OpenDevSocietyBranding outerClassName="mt-10 flex justify-center" />
            </form>
        </>
    );
};
export default SignIn;
