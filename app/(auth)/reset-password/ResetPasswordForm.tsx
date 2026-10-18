'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import FooterLink from '@/components/forms/FooterLink';
import InputField from '@/components/forms/InputField';
import PasswordRequirements from '@/components/forms/PasswordRequirements';
import OpenDevSocietyBranding from '@/components/OpenDevSocietyBranding';
import { Button } from '@/components/ui/button';
import { resetPasswordWithToken } from '@/lib/actions/auth.actions';
import { PASSWORD_VALIDATION } from '@/lib/constants';

type ResetPasswordFormData = {
    newPassword: string;
    confirmPassword: string;
};

const ResetPasswordForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token') ?? '';
    const error = searchParams.get('error');

    const {
        register,
        watch,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>({
        defaultValues: {
            newPassword: '',
            confirmPassword: '',
        },
        mode: 'onBlur',
    });

    const newPassword = watch('newPassword');

    useEffect(() => {
        if (error === 'INVALID_TOKEN') {
            toast.error('O link de redefinição é inválido ou expirou.');
        }
    }, [error]);

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            toast.error('O link de redefinição é inválido ou expirou.');
            return;
        }

        try {
            const result = await resetPasswordWithToken({
                token,
                newPassword: data.newPassword,
            });

            if (result.success) {
                toast.success('Senha atualizada. Você já pode entrar.');
                router.push('/sign-in');
                return;
            }

            toast.error('Falha ao redefinir a senha', {
                description: result.error ?? 'Não foi possível redefinir sua senha.',
            });
        } catch (error) {
            toast.error('Falha ao redefinir a senha', {
                description: error instanceof Error ? error.message : 'Não foi possível redefinir sua senha.',
            });
        }
    };

    return (
        <>
            <h1 className="form-title">Escolha uma nova senha</h1>
            <p className="text-sm text-gray-400 mb-6">
                Digite uma nova senha para sua conta.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <InputField
                    name="newPassword"
                    label="Nova senha"
                    placeholder="Digite a nova senha"
                    type="password"
                    register={register}
                    error={errors.newPassword}
                    validation={PASSWORD_VALIDATION}
                />
                <PasswordRequirements password={newPassword ?? ''} />

                <InputField
                    name="confirmPassword"
                    label="Confirmar senha"
                    placeholder="Confirme a nova senha"
                    type="password"
                    register={register}
                    error={errors.confirmPassword}
                    validation={{
                        required: 'Confirme a nova senha',
                        validate: (value: string) =>
                            value === newPassword || 'As senhas não coincidem',
                    }}
                />

                <Button type="submit" disabled={isSubmitting} className="yellow-btn w-full mt-5">
                    {isSubmitting ? 'Redefinindo senha' : 'Redefinir senha'}
                </Button>

                <FooterLink text="Precisa de um novo link?" linkText="Pedir outro" href="/forgot-password" />
                <OpenDevSocietyBranding outerClassName="mt-10 flex justify-center" />
            </form>
        </>
    );
};

export default ResetPasswordForm;
