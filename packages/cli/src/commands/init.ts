import shell from "shelljs";

export default {
    command: 'init',
    description: 'Initialise un nouveau projet Kraken',
    async handler() {
        const versions = await get_versions()

    }
}

export async function get_versions() {
    const is_node_installed = shell.which('node') != null
    const is_mvn_installed = shell.which('mvn') != null
    const last_npm_version = shell.exec('npm view @socle/core version', {silent: true}).replace(/[\n\r]+/g, '')

    return {
        is_node_installed,
        is_mvn_installed,
        last_npm_version
    }
}
