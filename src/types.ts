import type { App } from 'octokit'

export interface Config {
  mountpoints: Record<string, MountpointConfig>
}

export interface MountpointConfig {
  app: App
  installationId: number
  firebaseProjectId: string
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
