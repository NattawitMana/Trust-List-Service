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

// SSI Self-Sovereign Identity
export async function addSSI(ssi) {
    const trustlist = await getTrustList();
    if (!trustlist) {
        throw new Error('Trust list not found');
    }
    if (!trustlist.entities) {
        trustlist.entities = [];
    }
    trustlist.entities.push(ssi);

    const updatedJsonString = JSON.stringify(trustlist, null, 2);
    await fs.writeFile(filePath, updatedJsonString, 'utf8');
    return ssi;
}

export async function statusActionSSIbyID(id, action) {
    const trustlist = await getTrustList();
    if (!trustlist) {
        throw new Error('Trust list not found');
    }

    const entity = trustlist.entities.find(e => e.id === id);
    if (!entity) throw new Error('id not found');

    entity.status = action;
    trustlist.issued = new Date().toISOString();

    const updatedJsonString = JSON.stringify(trustlist, null, 2);

    await fs.writeFile(filePath, updatedJsonString, 'utf8')

    return entity
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
            "status": "active",
            "services": [
                {
                    "did": "did:web:issuer.acompany.com",
                    "type": "credential_issuer",
                    "credential_type": "ThaiNationalID",
                    "signing_pubkey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0iss...",
                    "issueble_claim": ["citizen_id", "name_th", "name_en"],
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
                            "allowed_claims": ["citizen_id", "name_th", "name_en", "date_of_birth"]
                        }
                    ],
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
                    "did": "did:web:wallet.ccompany.com",
                    "type": "wallet_provider",
                    "signing_pubkey": "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0wal...",
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
