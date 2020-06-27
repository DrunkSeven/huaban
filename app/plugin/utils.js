export function isMobile() {
    if (window.YKTAppType) {
        return true
    } else if (/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.appVersion)) {
        return true;
    }
    return false;
}