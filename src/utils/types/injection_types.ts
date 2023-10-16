export const Review_TYPES  = {
    ReviewService: Symbol("ReviewService"),
    ReviewRepository: Symbol("ReviewRepository"),
    ReviewController: Symbol("ReviewController"),
};
export const SSE_TYPES = {
    SSEController: Symbol("SSEController"),
    SSEService: Symbol("SSEService"),
}
export const Notification_TYPES = {
    NotificationController: Symbol("NotificationController"),
    NotificationService: Symbol("NotificationService"),
    NotificationRepository: Symbol("NotificationRepository"),

}
export const Auth_TYPES = {
    AuthController:Symbol("AuthController"),
    AuthService:Symbol("AuthService"),

}
export const User_TYPES = {
    UserController:Symbol("UserController"),
    UserService:Symbol("UserService"),
    UserRepository:Symbol("UserRepository")
}
export const Tag_Types = {
    TagController:Symbol("TagController"),
    TagService:Symbol("TagService"),
    TagRepository:Symbol("TagRepository")
}