export function getEnvVar(field: string): string{
    return process.env[field] ?? (() => { throw new Error(`${field} is not defined`) })()
}