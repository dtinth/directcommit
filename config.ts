import Encrypted from '@dtinth/encrypted'
import { App } from 'octokit'
import { AsyncCache } from './src/AsyncCache'
import { Config } from './src/types'

const creatorsgartenMembersCache = new AsyncCache<Set<number>>()

export const config: Config = {
  // Mountpoints are "projects" that can be used with directcommit.
  // Feel free to add more mountpoints in your fork.
  mountpoints: {
    // The name of the mountpoint. The example mountpoint allows "dtinth" to
    // edit the "README.md" file.
    directcommit: {
      app: new App({
        appId: 217557,
        privateKey: getDirectcommitPrivateKey(),
      }),
      installationId: 27146049,
      owner: 'dtinth',
      repo: 'directcommit',
      firebaseProjectId: 'fiery-react',
      async getPermissions(input) {
        if (input.path === 'README.md') {
          return {
            read: !!input.user,
            write: input.user?.id === 193136,
          }
        }
        return false
      },
    },

    'creatorsgarten-wiki': {
      app: new App({
        appId: 217557,
        privateKey: getDirectcommitPrivateKey(),
      }),
      installationId: 27196030,
      owner: 'creatorsgarten',
      repo: 'wiki',
      firebaseProjectId: 'creatorsgarten-wiki',
      async getPermissions(input) {
        const installation = await input.getInstallation()
        const members = await creatorsgartenMembersCache.getCachedOrCompute(
          async () => {
            console.log('Fetch')
            const response = await installation.rest.teams.listMembersInOrg({
              org: 'creatorsgarten',
              team_slug: 'creators',
              per_page: 100,
            })
            return new Set(response.data.map((member) => member.id))
          },
        )
        return {
          read: true,
          write: !!input.user && members.has(input.user.id),
        }
      },
    },
  },
}

function getDirectcommitPrivateKey() {
  const encrypted = Encrypted()
  return encrypted`PkM8Yu0jR/Z/YQp7IeGLeH7xa38SeBL6.5JCXflUj2T5u02lRLGe+T3EK8x8ly
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
0YexlpCcbGhxHxImX211DSGTl6r3DNJfg==`
}
