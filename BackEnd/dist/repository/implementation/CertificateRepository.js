"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateRepository = void 0;
const certificate_model_1 = require("../../models/certificate.model");
const baseRepository_1 = require("../baseRepository");
class CertificateRepository extends baseRepository_1.BaseRepository {
    constructor() {
        super(certificate_model_1.CertificateModel);
    }
    async createCertificate(certificateDatas) {
        return await this.create(certificateDatas);
    }
    async listCertificate(learnerId) {
        return await this.find({ learnerId: learnerId });
    }
    async learnerTotalCertificate(learnerId) {
        return await this.countDocuments({ learnerId: learnerId });
    }
}
exports.CertificateRepository = CertificateRepository;
