'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import InputField from '@/components/forms/InputField';
import FooterLink from '@/components/forms/FooterLink';
import OpenDevSocietyBranding from '@/components/OpenDevSocietyBranding';
import { requestPasswordResetEmail } from '@/lib/actions/auth.actions';

type ForgotPasswordFormData = {
    email: string;
};

const ForgotPasswordPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>({
        defaultValues: {
            email: '',
        },
        mode: 'onBlur',
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        try {
            const result = await requestPasswordResetEmail(data);

            if (result.success) {
                toast.success('Se existir uma conta com esse e-mail, enviamos um link para redefinir a senha.');
                return;
            }

            toast.error('Redefinição de senha indisponível', {
                description: result.error ?? 'Não foi possível iniciar a redefinição de senha.',
            });
        } catch (error) {
            toast.error('Redefinição de senha indisponível', {
                description: error instanceof Error ? error.message : 'Não foi possível iniciar a redefinição de senha.',
            });
        }
    };

    return (
        <>
            <h1 className="form-title">Esqueceu sua senha?</h1>
            <p className="text-sm text-gray-400 mb-6">
                Informe seu e-mail e enviaremos um link para redefinir a senha.
            </p>

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
                            message: 'Informe um e-mail válido',
                        },
                    }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Enviando link' : 'Enviar link de redefinição'}
                </Button>

                <FooterLink text="Lembrou a senha?" linkText="Entrar" href="/sign-in" />
                <OpenDevSocietyBranding outerClassName="mt-10 flex justify-center" />
            </form>
        </>
    );
};

export default ForgotPasswordPage;
