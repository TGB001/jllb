let babelTunnel;
export function getBabelTunnel() {
    return babelTunnel
}
export function setBabelTunnel(value) {
    babelTunnel = value;
}
/**
 * 子无线埋点
 */
export async function tracking(event_id, event_param, json_param) {
    const bridge = await babelTunnel?.bridge;
    bridge.tracking.tracking({ event_id, event_param, json_param });
}
/**
 * 安全三件套
 */
export async function mergeSecurityParams(...args) {
    const babelSecurity = await babelTunnel?.babelSecurity;
    return babelSecurity.mergeSecurityParams(...args);
}
