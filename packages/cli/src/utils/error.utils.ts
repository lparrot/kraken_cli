import * as process from 'process'

export function getStack(error: Error) {
    if (error.stack == null) {
        return
    }

    const stackArray = error.stack.split('\n')

    if (stackArray[0].startsWith('Error:')) {
        stackArray.splice(0, 1)
    }

    return stackArray
        .filter(it => it.indexOf(process.cwd()) > -1)
        .map(it => it
            .replaceAll(process.cwd(), '')
            .replaceAll('    at ', '')
        )
}
