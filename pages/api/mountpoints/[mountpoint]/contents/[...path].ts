import Cors from 'cors'
import { initMiddleware } from 'init-middleware'
import { get, has } from 'lodash-es'
import type { NextApiRequest, NextApiResponse } from 'next'
import { config } from '../../../../../config'
import pMemoize from 'p-memoize'
import { verifyIdToken } from '../../../../../src/auth'

const cors = initMiddleware(Cors())

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await cors(req, res)
  try {
    const mountpoints = config.mountpoints
    const mountpointName = String(req.query.mountpoint)
    const path = (req.query.path as string[]).join('/')
    if (!has(mountpoints, mountpointName)) {
      res.status(404).json({ error: 'Mountpoint not found' })
      return
    }
    const mountpoint = get(mountpoints, mountpointName)

    const idToken = (req.headers.authorization || '').split(' ')[1]
    let userId: number | undefined
    if (idToken) {
      const result = await verifyIdToken(mountpoint.firebaseProjectId, idToken)
      const id = +get(result.payload, [
        'firebase',
        'identities',
        'github.com',
        0,
      ])
      if (!id) {
        res.status(401).json({ error: 'No user id found in id token' })
        return
      }
      userId = id
    }

    const getInstallation = pMemoize(async () => {
      return await mountpoint.app.getInstallationOctokit(
        mountpoint.installationId,
      )
    })
    const getContent = pMemoize(async () => {
      const installation = await getInstallation()
      const response = await installation.rest.repos.getContent({
        owner: mountpoint.owner,
        repo: mountpoint.repo,
        path,
      })
      const data = response.data
      if (!('content' in data)) {
        throw new Error('No content found')
      }
      return data
    })
    const permission = await mountpoint.getPermissions({
      getInstallation,
      getContent,
      path,
      user: userId ? { id: userId } : undefined,
    })
    const canRead =
      permission === true || (permission !== false && permission.read)
    const canWrite =
      permission === true || (permission !== false && permission.write)
    if (req.method === 'GET') {
      if (!canRead) {
        res.status(403).json({ error: 'Forbidden' })
        return
      }
      res.status(200).json({
        ...(await getContent()),
        directcommit: {
          permissions: {
            read: canRead,
            write: canWrite,
          },
        },
      })
    } else if (req.method === 'PUT') {
      if (!canWrite) {
        res.status(403).json({ error: 'Forbidden' })
        return
      }
      const installation = await getInstallation()
      const response = await installation.rest.repos.createOrUpdateFileContents(
        {
          owner: mountpoint.owner,
          repo: mountpoint.repo,
          path,
          message:
            String(req.body.message) +
            (userId
              ? `\n\n\nCo-authored-by: User <${userId}+username@users.noreply.github.com>`
              : ''),
          content: String(req.body.content),
          sha: String(req.body.sha),
        },
      )
      res.status(200).json(response.data)
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
