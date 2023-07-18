import {readUser} from 'rc9'

export const state = {}

export async function initState() {
  const config = readUser('.cli_ui')
}
