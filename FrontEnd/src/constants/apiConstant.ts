

export const API={
    Auth:{
        SIGNUP_URL:'/auth/signup',
        LOGIN_URL:'/auth/login',
        LOGOUT_URL:'/auth/logout',
        VERIFY_EMAIL_URL:'/auth/verify-email',
        REFRESH_TOKEN_URL:'/auth/refresh-token',
        AUTH_URL:'/auth/me',
        FORGOT_PASSWORD_URL:'/auth/forgot-password',
        RESET_PASSWORD_URL:'/auth/reset-password'
    },
    USER:{
        FETCH_USER_PROFILE:'/user/profile',
        CHANGE_PASSWORD:(id:string)=>`/user/change-password/${id}`,
        UPDATE_PROFILE_PICTURE:(id:string)=>`/user/profile-picture/${id}`,
        PUT_PRESIGNED_URL:'/user/s3-presigned-url',
        GET_PRESIGNED_URL:'/user/s3-getPresigned-url',
        UPDATE_MENTOR_DATA:(id:string)=>`/user/profile/${id}`,
    },
    ADMIN:{
        FETCH_ALL_USERS:'/admin/users',
        BLOCK_USER:(id:string)=>`/admin/user/${id}`,
        USER_PROFILE:(id:string)=>`/admin/user/${id}`
    },
}
