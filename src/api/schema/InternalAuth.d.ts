
declare namespace InternalAuth {

    interface LoginBySmsOtpForm {
        smsOtpID: string;
        code: string;
        referralCode?: string;
    }

    interface LoginByEmailOtpForm {
        otpID: string;
        code: string;
        referralCode?: string;
    }

    interface LoginByPassword {
        account: string;
        password: string;
    }

    interface RetrieveLoginPasswordForm {
        otpID: string;
        newPassword: string;
        code: string;
    }

    interface GoogleLoginForm {
        oauthState: string;
        code: string;
        scope: string;
        authUser: string;
        prompt: string;
        referralCode?: string;
    }

    interface RefreshTokenForm {
        refreshToken: string;
    }

}
