import { publish } from '../services/syncService.js'

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