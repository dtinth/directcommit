import type { App } from 'octokit'

export interface Config {
  mountpoints: Record<string, Mountpoint>
}

export interface Mountpoint {
  app: App
  installationId: number
  owner: string
  repo: string
  getPermissions: (input: GetPermissionsInput) => Promise<GetPermissionsOutput>
}

export interface GetPermissionsInput {
  path: string
  user: { id: number }
  getInstallation: () => ReturnType<App['getInstallationOctokit']>
}

export type GetPermissionsOutput =
  | {
      read: boolean
      write: boolean
    }
  | boolean
