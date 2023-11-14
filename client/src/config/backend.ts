interface BackendConfig {
    url: string;
    port: number;
}

export const backendConfig: BackendConfig = {
    url: 'http://localhost',
    port: 8000
}