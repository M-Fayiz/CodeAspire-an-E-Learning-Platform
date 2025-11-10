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
    GOOGLE_AUTH: (role: string) => `/api/v1/auth/google?role:${role}`,
  },
  USER: {
    FETCH_USER_PROFILE: (id: string) => `/users/me/${id}`,
    UPDATE_USER_PROFILE: (id: string) => `/users/me/${id}`,
    CHANGE_PASSWORD: (id: string) => `/users/${id}/change-password`,
    UPDATE_PROFILE_PICTURE: (id: string) => `/users/${id}/profile-picture`,
    PUT_PRESIGNED_URL: "/users/s3-presigned-url",
    GET_PRESIGNED_URL: "/users/s3-getPresigned-url",
    UPDATE_MENTOR_PROFILE: (mentorId: string) =>
      `/users/${mentorId}/mentor-profile`,
    UPDATE_PROFILE_DATA: (id: string) => `/users/${id}/profile-data`,
    GET_USER_PROFILE: (id: string) => `/users/${id}/profile`,
  },
  SHARED: {
    UPLOAD_PUT_PRESIGNED_URL: "/shared/s3/presigned-url/upload",
    DOWNLOAD_GET_PRESIGNED_URL: "/shared/s3/presigned-url/download",
  },
  ADMIN: {
    FETCH_ALL_USERS: "/admin/users",
    GET_USER_PROFILE: (userId: string) => `/admin/users/${userId}`,
    BLOCK_USER: (id: string) => `/admin/users/${id}/block`,
    APPROVE_MENTOR: (id: string) => `/admin/users/${id}/approve`,
    DASHBOARD_CARD: `/admin/dashboard/cards`,
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
    GET_MENTOR_DRAFTED_COURSE: `/courses/my-courses`,
    ADD_SESSION: (id: string) => `/courses/${id}/sessions`,
    ADD_LECTURE: (id: string, sessionId: string) =>
      `/courses/${id}/sessions/${sessionId}`,
    EDIT_LECTURE: (courseId: string, sessionId: string, lectureId: string) =>
      `/courses/${courseId}/sessions/${sessionId}/lectures/${lectureId}`,
    UPDATE_BASE_COURSE_INFO: (courseId: string) => `/courses/${courseId}`,
    PUBLISH_COURSE: (courseId: string) => `/courses/publish/${courseId}`,
    ADMIN_COURSE_LIST: "/courses/admin-courses",
    COURSE_DETAILS: (courseId: string) => `/courses/${courseId}`,
    APPROVE_CURSE: (courseId: string) => `/courses/admin/approve/${courseId}`,
    REJECT_COURSE: (courseId: string) => `/courses/admin/reject/${courseId}`,
    LIST_COURSE_FOR_SLOT: (mentorId: string) => `/courses/mentor/${mentorId}`,
  },
  PAYMENT: {
    CREATE_PAYMENT_INTENT: "/orders/create-checkout-session",
    GET_PAYMENT_DATA: (sessionsId: string) => `/orders/stripe/${sessionsId}`,
  },
  ENROLLEMENT: {
    GET_ENROLLED_COURSE: (learnerId: string) => `/enrollements/${learnerId}`,
    GET_ENROLLD_COURSE_DETAILS: (enrolledId: string) =>
      `/enrollements/course/${enrolledId}`,
    UPDATE_PROGRESS: (enrolledId: string) => `/enrollements/${enrolledId}`,
    ADD_RATING: (enrolledId: string) => `/enrollements/${enrolledId}/rating`,
    GET_COURSE_DASHBOARD: (courseId: string, mentorId: string) =>
      `/enrollements/course/${courseId}/mentor/${mentorId}`,
    GET_FILTERED_GRAPH: (courseId: string) =>
      `/enrollements/course/${courseId}/chart`,
    GET_MENTOR_DASH_DATA: (mentorId: string) =>
      `/enrollements/mentor/${mentorId}/dashboard`,
  },
  REVIEW: {
    ADD_REVIEW: "/reviews/",
    GET_REVIEWS: (courseId: string) => `/reviews/${courseId}`,
  },
  NOTIFICATION: {
    GET_NOTIFICATION: (userId: string) => `/notifications/${userId}`,
    READ_NOTIFICATION: (notifyId: string) => `/notifications/${notifyId}`,
  },
  CHAT: {
    CREATE_CHAT: `/chats/get-or-create`,
    LIST_USERS: (senderId: string) => `/chats/users/${senderId}`,
    GET_MESSAGE: (chatId: string, limit = 30) =>
      `/chats/${chatId}/messages?limit=${limit}`,
  },
  SLOTS: {
    CREATE_SLOTS: `/slots/create`,
    GET_MENTOR_SLOTS:(mentorId:string)=>`/slots/${mentorId}`,
    UPDATE_SLOT:(slotId:string)=>`/slots/${slotId}`,
    GET_COURSE_SLOT:(courseId:string)=>`/slots/course/${courseId}`
  },
  SLOT_BOOK:{
    BOOK_SLOT:`/slot-booking/create`
  }
};
