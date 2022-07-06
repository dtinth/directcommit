import { get, has } from 'lodash-es'
import type { NextApiRequest, NextApiResponse } from 'next'
import { config } from '../../../../../config'
import pMemoize from 'p-memoize'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const mountpoints = config.mountpoints
    const mountpointName = String(req.query.mountpoint)
    const path = (req.query.path as string[]).join('/')
    if (!has(mountpoints, mountpointName)) {
      res.status(404).json({ error: 'Mountpoint not found' })
      return
    }
    const mountpoint = get(mountpoints, mountpointName)

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
      path,
      user: { id: 0 },
    })
    if (req.method === 'GET') {
      if (permission === false || (permission !== true && !permission.read)) {
        res.status(403).json({ error: 'Forbidden' })
        return
      }
      res.status(200).json(await getContent())
    } else if (req.method === 'PUT') {
      if (permission === false || (permission !== true && !permission.write)) {
        res.status(403).json({ error: 'Forbidden' })
        return
      }
      throw new Error('Unimplemented')
    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
