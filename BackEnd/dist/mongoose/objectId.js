"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseObjectId = void 0;
const mongoose_1 = require("mongoose");
const parseObjectId = (id) => {
    if (!mongoose_1.Types.ObjectId.isValid(id))
        return null;
    return new mongoose_1.Types.ObjectId(id);
};
exports.parseObjectId = parseObjectId;
