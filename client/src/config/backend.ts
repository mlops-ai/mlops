interface BackendConfig {
    url: string;
    port: number;
}
console.log(window.location.host)

export const backendConfig: BackendConfig = {
    url: `http://${window.location.host.split(':')[0]}`,
    port: 8000
}