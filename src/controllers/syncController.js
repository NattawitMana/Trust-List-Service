import { publish, verifyTrustList } from '../services/syncService.js'

export async function handleGitSync(req, res) {

    try {
        const dataToSign = await publish()

        return res.status(200).json({
            message: 'publish success',
            trustlist: dataToSign
        })

    } catch (err) {
        console.error(err.message)
        return res.status(500).json({ error: err.message || 'Internal server error' })
    }

}

export async function handleVerifyTrustList(req, res) {
    try {
        const result = await verifyTrustList();
        return res.status(200).json({
            message: 'trust list verified successfully',
            trustlist: result
        })
    } catch (err) {
        console.log(err)
        return res.status(400).json({
            success: false,
            error: "Security Check Failed",
            details: err.message
        });
    }
}