
declare namespace InternalToken {

    interface Token {
        access: string;
        accessExpiredAt: number;
        refresh: string;
        refreshExpiredAt: number;
    }

}
