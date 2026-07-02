import { getTrustList, addSSI, resetTrustlist, statusActionSSIbyID } from '../services/vcService.js'

export async function handleGetTrustlist(req, res) {
    try {
        const data = await getTrustList()
        return res.status(200).json(data);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export async function handleAddSSI(req, res) {
    try {
        const dataToAdd = req.body;

        await addSSI(dataToAdd);

        return res.status(200).json({
            message: 'ssi added successfully',
            issuer: dataToAdd
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export async function handleSSIActions(req, res) {
    try {
        const { id, action } = req.params
        let newStatus = null;

        if (action == 'revoke') {
            newStatus = await statusActionSSIbyID(id, 'revoked');
        } else if (action == 'active') {
            newStatus = await statusActionSSIbyID(id, 'active');
        } else {
            return res.status(400).json({ error: 'Action must be active or revoke' });
        }

        return res.status(200).json({
            message: 'ssi status change successfully',
            info: newStatus
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export async function handleResetTrustlist(req, res) {
    try {

        await resetTrustlist();

        return res.status(200).json({
            message: 'trust list reset!'
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}