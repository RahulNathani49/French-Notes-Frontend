// Generate UUID
function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

// Persistent deviceId (stored in localStorage)
export function getDeviceId() {
    let deviceId = localStorage.getItem("deviceId");
    if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem("deviceId", deviceId);
    }
    return deviceId;
}

// Human-readable browser/device info
export function getDeviceInfo() {
    return `${navigator.platform} - ${navigator.userAgent}`;
}

// Bundle both
export function getDeviceData() {
    return {
        deviceId: getDeviceId(),
        deviceInfo: getDeviceInfo()
    };
}
