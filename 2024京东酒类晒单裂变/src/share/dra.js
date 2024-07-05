import { getBabelTunnel } from './tunnel'
/**
 * 楼层性能上报 21~35
 */
export function profilerModuleReport(...args) {
    getBabelTunnel()?.profilerModuleReport(...args);
}
/**
 * 楼层异常上报
 */
export async function jsagentReport(...args) {
    getBabelTunnel()?.jsagentReport(...args);
}