import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { simpleGit } from 'simple-git';
import { getTrustList } from './vcService.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../../data-repo/trust_list.json');
const sigFilePath = path.resolve(__dirname, '../../data-repo/trust_list.sig');
const jsonFolder = path.dirname(filePath);
const sigFolder = path.dirname(sigFilePath);

async function dataSign(dataToSign) {
    let priv_key = process.env.PRIV_KEY;
    // console.log(priv_key)
    if (!priv_key) {
        try {
            const privateKeyPath = path.resolve(__dirname, '../../sample_private_key.pem');
            priv_key = await fs.readFile(privateKeyPath, 'utf8');
        } catch (err) {
            throw Error('key not found! Please configure PRIV_KEY in .env or ensure private_key.pem exists.');
        }
    }

    if (!dataToSign) throw Error('Data not found')

    const sign = crypto.createSign('SHA256');

    sign.update(dataToSign);
    sign.end();

    const signature = sign.sign(priv_key, 'base64');
    return signature
}

async function syncTrustListToGit() {
    const commitMessage = `chore: auto-update trust list and signature [${new Date().toISOString()}]`;
    const dataRepoPath = path.resolve(__dirname, '../../data-repo');
    const git = simpleGit(dataRepoPath);

    let hasCommits = false;
    try {
        await git.raw(['rev-parse', '--verify', 'HEAD']);
        hasCommits = true;
    } catch (e) { }

    let remoteMainExists = false;
    try {
        const lsRemoteResult = await git.raw(['ls-remote', '--heads', 'origin', 'main']);
        if (lsRemoteResult && lsRemoteResult.trim() !== '') {
            remoteMainExists = true;
        }
    } catch (e) { }

    if (hasCommits) {
        try {
            await git.checkout('main');
        } catch (e) {
            await git.checkoutLocalBranch('main');
        }
    } else {
        try {
            await git.checkoutLocalBranch('main');
        } catch (e) { }
    }

    if (remoteMainExists) {
        try {
            await git.fetch('origin', 'main');
            await git.raw(['reset', '--mixed', 'origin/main']);
        } catch (e) {
            console.error('Error syncing with remote main:', e.message);
        }
    }

    await git.add(['trust_list.json', 'trust_list.sig']);

    const status = await git.status();
    if (status.files.length > 0) {
        await git.commit(commitMessage);
        await git.push('origin', 'main');
    } else {
        console.log('No changes to commit');
    }
}

export async function verifyTrustList() {

    const data = await fs.readFile(filePath, 'utf8')
    const trustlist = JSON.parse(data)
    const trustlistString = JSON.stringify(trustlist, null, 2)

    const signatureToCheck = await fs.readFile(sigFilePath, 'utf8')

    const publicKeyPath = path.resolve(__dirname, '../../public_key.pem');
    const publicKey = await fs.readFile(publicKeyPath, 'utf8');

    const verify = crypto.createVerify('SHA256');
    verify.update(trustlistString);
    verify.end();

    const isVerified = verify.verify(publicKey, signatureToCheck, 'base64');
    if (!isVerified) {
        throw new Error('Fake Data!')
    }

    return trustlist
}

export async function publish() {
    try {
        const trustlist = await getTrustList();
        if (!trustlist) {
            throw new Error('Trust list not found');
        }

        trustlist.issued = new Date().toISOString();

        const dataToSign = JSON.stringify(trustlist, null, 2)
        const trustlistSignature = await dataSign(dataToSign)

        // await fs.mkdir(jsonFolder, { recursive: true });
        // await fs.mkdir(sigFolder, { recursive: true });
        await fs.writeFile(filePath, dataToSign, 'utf8')
        await fs.writeFile(sigFilePath, trustlistSignature, 'utf8')

        await verifyTrustList();

        await syncTrustListToGit();

        return trustlist
    } catch (err) {
        console.error("Error in publish:", err);
        throw err;
    }
}

