import { getTrustList, addProvider, resetTrustlist, statusActionProviderbyID, addService, statusActionServicebyID } from '../services/vcService.js'

export async function handleGetTrustlist(req, res) {
    try {
        const data = await getTrustList()
        return res.status(200).json(data);
    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export async function handleAddService(req, res) {
    try {
        const { provider_id } = req.params;

        const dataToAdd = req.body;

        const service = await addService(provider_id, dataToAdd);

        return res.status(200).json({
            message: 'service added successfully',
            data: service
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export async function handleServiceActions(req, res) {
    try {
        const { service_id } = req.params;
        const { status } = req.body;

        if (status !== 'active' && status !== 'revoked') {
            return res.status(400).json({ error: 'Status must be active or revoked' });
        }

        const service = await statusActionServicebyID(service_id, status);

        return res.status(200).json({
            message: 'service status change successfully',
            info: service
        });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

export async function handleAddProvider(req, res) {
    try {
        const dataToAdd = req.body;

        await addProvider(dataToAdd);

        return res.status(200).json({
            message: 'provider added successfully',
            provider: dataToAdd
        })

    } catch (err) {
        console.log(err)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

export async function handleProviderActions(req, res) {
    try {
        const { id, action } = req.params
        let newStatus = null;

        if (action == 'revoke') {
            newStatus = await statusActionProviderbyID(id, 'revoked');
        } else if (action == 'active') {
            newStatus = await statusActionProviderbyID(id, 'active');
        } else {
            return res.status(400).json({ error: 'Action must be active or revoke' });
        }

        return res.status(200).json({
            message: 'provider status change successfully',
            info: newStatus
        })

    } catch (err) {
        console.log(err.message)
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