"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatEvents = exports.SocketEvents = void 0;
var SocketEvents;
(function (SocketEvents) {
    SocketEvents["CONNECT"] = "connect";
    SocketEvents["USER_ONLINE"] = "user:online";
    SocketEvents["DISCONNECT"] = "disconnect";
    SocketEvents["USER_OFFLINE"] = "user:offline";
})(SocketEvents || (exports.SocketEvents = SocketEvents = {}));
var ChatEvents;
(function (ChatEvents) {
    ChatEvents["JOIN"] = "chat:join";
    ChatEvents["SEND"] = "chat:send";
    ChatEvents["DELIVERED"] = "chat:delivered";
    ChatEvents["READ"] = "chat:read";
    ChatEvents["NEW_MESSAGE"] = "chat:new";
    ChatEvents["NOTIFICATION"] = "chat:notification";
    ChatEvents["STATUS_UPDARE"] = "chat:status";
    ChatEvents["ERROR"] = "chat:error";
    ChatEvents["UPDATE"] = "chat:update";
})(ChatEvents || (exports.ChatEvents = ChatEvents = {}));
