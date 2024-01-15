declare enum Anonymity {
    UNKNOWN = 0,
    LOW = 1,
    AVERAGE = 2,
    HIGH = 3
}
type Proxy = {
    ip: string;
    port: number;
    country: string;
    anonymity: Anonymity;
    https: boolean;
    speed: number;
};
type Filters = {
    port?: number[];
    country?: string[];
    anonymity?: Anonymity[];
    https?: boolean;
    maxSpeed?: number;
};
/**
 * Wait the proxy list have been updated
 * @returns
 */
declare function waitProxiesUpdated(): Promise<void>;
/**
 * Get a proxy with specific filters
 * @param filters
 * @returns
 */
declare function getProxy(filters?: Filters): Promise<Proxy>;
export { getProxy, waitProxiesUpdated };
