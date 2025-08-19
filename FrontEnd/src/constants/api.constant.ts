export const API = {
  Auth: {
    SIGNUP_URL: "/auth/signup",
    LOGIN_URL: "/auth/login",
    LOGOUT_URL: "/auth/logout",
    VERIFY_EMAIL_URL: "/auth/verify-email",
    REFRESH_TOKEN_URL: "/auth/refresh-token",
    AUTH_URL: "/auth/me",
    FORGOT_PASSWORD_URL: "/auth/forgot-password",
    RESET_PASSWORD_URL: "/auth/reset-password",
  },
  USER: {
    FETCH_USER_PROFILE: "/users/me",
    UPDATE_USER_PROFILE: (id: string) => `/users/me/${id}`,
    CHANGE_PASSWORD: (id: string) => `/users/${id}/change-password`,
    UPDATE_PROFILE_PICTURE: (id: string) => `/users/${id}/profile-picture`,
    PUT_PRESIGNED_URL: "/users/s3-presigned-url",
    GET_PRESIGNED_URL: "/users/s3-getPresigned-url",
    UPDATE_MENTOR_PROFILE: (id: string) => `/users/${id}/mentor-profile`,
    UPDATE_PROFILE_DATA: (id: string) => `/users/${id}/profile-data`,
  },
  SHARED: {
    UPLOAD_PUT_PRESIGNED_URL: "/shared/s3/presigned-url/upload",
    DOWNLOAD_GET_PRESIGNED_URL: "/shared/s3/presigned-url/download",
  },
  ADMIN: {
    FETCH_ALL_USERS: "/admin/users",
    GET_USER_PROFILE: (id: string) => `/admin/users/${id}`,
    BLOCK_USER: (id: string) => `/admin/users/${id}/block`,
    APPROVE_MENTOR: (id: string) => `/admin/users/${id}/approve`,
  },
  CATEGORY: {
    CREATE_CATEGORY: `/categories`,
    LIST_CATEGORIES: `/categories`,
    EDIT_CATEGORY: (id: string) => `/categories/${id}`,
  },
  COURSE: {
    CREATE_COURSE: "/courses",
    FETCH_COURSES: "/courses",
    ADD_OR_UPDATE_SESSION: (courseId: string, updatePart: string) =>
      `/courses/${courseId}?course_part=${updatePart}`,
    GET_COURSE: (id: string) => `/courses/${id}`,
    GET_MENTOR_DRAFTED_COURSE: `/courses/drafted-courses`,
    ADD_SESSION: (id: string) => `/courses/${id}/sessions`,
    ADD_LECTURE: (id: string, sessionId: string) =>
      `/courses/${id}/sessions/${sessionId}`,
    EDIT_LECTURE: (courseId: string, sessionId: string, lectureId: string) =>
      `/courses/${courseId}/sessions/${sessionId}/lectures/${lectureId}`,
    UPDATE_BASE_COURSE_INFO:(courseId:string)=>`/courses/${courseId}`
  },
};
