import type { App, Octokit } from 'octokit'

export interface Config {
  mountpoints: Record<string, MountpointConfig>
}

export interface MountpointConfig {
  /**
   * The GitHub App that will be used to create commits in the repository.
   * The app should be installed with access to the repository.
   */
  app: App

  /**
   * The Installation ID of the GitHub App. This installation should have
   * access to the repository.
   */
  installationId: number

  /**
   * The Firebase project ID, used to validate ID tokens.
   */
  firebaseProjectId: string

  /**
   * The owner of the repository.
   */
  owner: string

  /**
   * The name of the repository.
   */
  repo: string

  /**
   * The function that will be used to determine whether the user has
   * permission to view or edit the file.
   */
  getPermissions(input: GetPermissionsInput): Promise<GetPermissionsOutput>
}

export type Content = Awaited<
  ReturnType<Octokit['rest']['repos']['getContent']>
>['data'] & { sha: string }

export interface GetPermissionsInput {
  /**
   * The path of the file being accessed.
   */
  path: string

  /**
   * The authenticated user information.
   */
  user?: { id: number }

  /**
   * Returns an Octokit instance with the correct access token for the installation.
   */
  getInstallation: () => Promise<App['octokit']>

  /**
   * The function that will be used to determine whether the user has
   * permission to view or edit the file.
   */
  getContent(): Promise<Content>
}

export type GetPermissionsOutput =
  | {
      read: boolean
      write: boolean
    }
  | boolean
