import crypto from 'crypto';
import { getTrustList } from '../services/vcService.js'

export async function handleTestSignedData(req, res) {
    try {
        const priv_key = process.env.PRIV_KEY;
        if (!priv_key) { throw Error('key not found ') }

        const data = await getTrustList()
        const sign = crypto.createSign('SHA256');

        const dataToSign = JSON.stringify(data)

        sign.update(dataToSign);
        sign.end();

        const signature = sign.sign(priv_key, 'base64');
        return res.status(200).json({
            success: true,
            signature: signature
        });

    } catch (err) {
        return res.status(500).json({ err: err.message });
    }
}