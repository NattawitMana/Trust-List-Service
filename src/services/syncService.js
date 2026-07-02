import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { simpleGit } from 'simple-git';
import { getTrustList } from './vcService.js';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.resolve(__dirname, '../../data-repo/Trust-List-JSON/trust_list.json');
const sigFilePath = path.resolve(__dirname, '../../data-repo/Trust-List-JSON/trust_list.sig');
const jsonFolder = path.dirname(filePath);
const sigFolder = path.dirname(sigFilePath);

async function dataSign(dataToSign) {
    const priv_key = process.env.PRIV_KEY;
    if (!priv_key) { throw Error('key not found!') }

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

    // 1. Check if the local repository has any commits (HEAD is valid)
    let hasCommits = false;
    try {
        await git.raw(['rev-parse', '--verify', 'HEAD']);
        hasCommits = true;
    } catch (e) {
        // No commits yet
    }

    // 2. Check if the remote main branch exists
    let remoteMainExists = false;
    try {
        const lsRemoteResult = await git.raw(['ls-remote', '--heads', 'origin', 'main']);
        if (lsRemoteResult && lsRemoteResult.trim() !== '') {
            remoteMainExists = true;
        }
    } catch (e) {
        // Remote check failed or origin not configured
    }

    // 3. Checkout or create the local 'main' branch
    if (hasCommits) {
        try {
            await git.checkout('main');
        } catch (e) {
            await git.checkoutLocalBranch('main');
        }
    } else {
        try {
            await git.checkoutLocalBranch('main');
        } catch (e) {
            // Already on main or cannot checkout unborn branch
        }
    }

    // 4. Pull from remote if remote main exists
    if (remoteMainExists) {
        try {
            await git.pull('origin', 'main');
        } catch (e) {
            console.error('Error pulling from origin main:', e.message);
        }
    }

    // 5. Stage the files
    await git.add(['Trust-List-JSON/trust_list.json', 'Trust-List-JSON/trust_list.sig']);

    // 6. Commit only if there are changes to commit
    const status = await git.status();
    if (status.files.length > 0) {
        await git.commit(commitMessage);
    } else {
        console.log('No changes to commit');
    }

    // 7. Push to origin main
    await git.push('origin', 'main');
}

export async function publish() {
    try {
        const trustlist = await getTrustList();
        if (!trustlist) {
            throw new Error('Trust list not found');
        }

        const dataToSign = JSON.stringify(trustlist, null, 2)
        const trustlistSignature = await dataSign(dataToSign)

        await fs.mkdir(jsonFolder, { recursive: true });
        await fs.mkdir(sigFolder, { recursive: true });
        await fs.writeFile(filePath, dataToSign, 'utf8')
        await fs.writeFile(sigFilePath, trustlistSignature, 'utf8')

        await syncTrustListToGit();

        return trustlist
    } catch (err) {
        console.error("Error in publish:", err);
        throw err;
    }
}

