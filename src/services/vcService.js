import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../mock_data/trust_list.json');

export async function getTrustList() {
    try {

        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error reading trust list:", error);
        throw error;
    }
}

export async function addProvider(provider) {
    const trustlist = await getTrustList();
    if (!trustlist) {
        throw new Error('Trust list not found');
    }
    if (!trustlist.entities) {
        trustlist.entities = [];
    }
    trustlist.entities.push(provider);

    const updatedJsonString = JSON.stringify(trustlist, null, 2);
    await fs.writeFile(filePath, updatedJsonString, 'utf8');

    return provider;
}

export async function statusActionProviderbyID(id, action) {
    const trustlist = await getTrustList();
    if (!trustlist) {
        throw new Error('Trust list not found');
    }

    const provider = trustlist.entities.find(e => e.id === id);
    if (!provider) throw new Error('id not found');

    provider.status = action;

    const updatedJsonString = JSON.stringify(trustlist, null, 2);

    await fs.writeFile(filePath, updatedJsonString, 'utf8')

    return provider
}

export async function addService(id, data) {
    const trustlist = await getTrustList();
    const provider = trustlist.entities.find(e => e.id === id)
    if (!trustlist) {
        throw new Error('Trust list not found');
    }
    if (!trustlist.entities.services) {
        trustlist.entities.services = [];
    }
    provider.services.push(data);

    const updatedJsonString = JSON.stringify(trustlist, null, 2);

    await fs.writeFile(filePath, updatedJsonString, 'utf8')

    return provider

}

export async function statusActionServicebyID(id, status) {
    const trustlist = await getTrustList();
    if (!trustlist) {
        throw new Error('Trust list not found');
    }

    const targetEntity = trustlist.entities.find(e => e.services.some(s => s.service_id === id))

    if (!targetEntity) throw new Error('service not found!')

    const service = targetEntity.services.find(s => s.service_id === id)

    if (!service) throw new Error('service not found!')

    service.status = status

    const updatedJsonString = JSON.stringify(trustlist, null, 2);

    await fs.writeFile(filePath, updatedJsonString, 'utf8')

    return service

}

export async function resetTrustlist() {
    const trustlist = await getTrustList();
    if (!trustlist) {
        throw new Error('Trust list not found');
    }
    trustlist.entities = [
        {
            "id": "iss-12354",
            "name_th": "บริษัท A จำกัด (ผู้รับรอง)",
            "name_en": "A Company Limited (Issuer)",
            "status": "revoked",
            "services": [
                {
                    "service_id": "srv-iss-12354-01",
                    "did": "did:web:issuer.acompany.com",
                    "type": "credential_issuer",
                    "credential_type": "ThaiNationalID",
                    "signing_pubkey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0iss...",
                    "issueble_claim": [
                        "citizen_id",
                        "name_th",
                        "name_en"
                    ],
                    "status": "revoked",
                    "valid_from": "2026-09-08T00:00:00Z",
                    "valid_until": "2027-09-08T00:00:00Z"
                }
            ]
        },
        {
            "id": "ver-56789",
            "name_th": "บริษัท B จำกัด (ผู้ตรวจสอบ)",
            "name_en": "B Company Limited (Verifier)",
            "status": "active",
            "services": [
                {
                    "service_id": "srv-ver-56789-01",
                    "did": "did:web:verifier.bcompany.com",
                    "type": "verifier",
                    "signing_pubkey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0ver...",
                    "client_id": "https://client.bcompany.com/callback",
                    "credential_type": "ThaiNationalID",
                    "use_case": [
                        {
                            "use_case_id": "uc-bank-opening-01",
                            "purpose_th": "เปิดบัญชีธนาคารออนไลน์",
                            "purpose_en": "Online Bank Account Opening",
                            "allowed_claims": [
                                "citizen_id",
                                "name_th",
                                "name_en",
                                "date_of_birth"
                            ]
                        }
                    ],
                    "status": "active",
                    "valid_from": "2026-09-08T00:00:00Z",
                    "valid_until": "2027-09-08T00:00:00Z"
                }
            ]
        },
        {
            "id": "wal-98765",
            "name_th": "บริษัท C จำกัด (ผู้ให้บริการวอลเล็ต)",
            "name_en": "C Company Limited (Wallet Provider)",
            "status": "active",
            "services": [
                {
                    "service_id": "srv-wal-98765-01",
                    "did": "did:web:wallet.ccompany.com",
                    "type": "wallet_provider",
                    "signing_pubkey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0wal...",
                    "status": "active",
                    "valid_from": "2026-09-08T00:00:00Z",
                    "valid_until": "2027-09-08T00:00:00Z"
                }
            ]
        }
    ];

    trustlist.issued = new Date().toISOString();

    await fs.writeFile(filePath, JSON.stringify(trustlist, null, 2), 'utf8');

    return trustlist;
}
