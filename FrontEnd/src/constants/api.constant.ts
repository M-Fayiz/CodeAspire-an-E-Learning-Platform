

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
        FETCH_USER_PROFILE:'/users/me',
        UPDATE_USER_PROFILE:(id:string)=>`/users/me/${id}`,
        CHANGE_PASSWORD:(id:string)=>`/users/${id}/change-password`,
        UPDATE_PROFILE_PICTURE:(id:string)=>`/users/${id}/profile-picture`,
        PUT_PRESIGNED_URL:'/users/s3-presigned-url',
        GET_PRESIGNED_URL:'/users/s3-getPresigned-url',
        UPDATE_MENTOR_PROFILE:(id:string)=>`/users/${id}/mentor-profile`,
    },
    ADMIN:{
        FETCH_ALL_USERS:'/admin/users',
        GET_USER_PROFILE:(id:string)=>`/admin/users/${id}`,
        BLOCK_USER:(id:string)=>`/admin/users/${id}/block`,
        APPROVE_MENTOR:(id:string)=>`/admin/users/${id}/approve`,
    },
    CATEGORY:{
        CREATE_CATEGORY:`/categories`,
        LIST_CATEGORIES:`/categories`,
        EDIT_CATEGORY:(id:string)=>`/categories/${id}`
    },
    COURSE:{
        CREATE_COURSE:'/courses'
    }
}
