declare namespace CloudApi {
    interface LoginResult {
        id: string
    }
    interface GetUserByIdResult {
        id: string,
        name: string,
        alias: string,
        avatar: string,
        balance: number,
        visits: number,
        wallet: Array<any>,
    }
    interface UpdateUserInfoResult {
        id: string,
        name: string,
        alias: string,
        avatar: string,
        balance: number,
    }
}