import { Camera, CameraResultType, CameraSource, PermissionStatus } from '@capacitor/camera';
import { Network } from '@capacitor/network';
import { Capacitor } from '@capacitor/core';

export const NativeBridge = {
  /**
   * Checks and requests camera permissions.
   * Ensures the app "asks" the user properly on a real phone.
   */
  requestCameraPermissions: async (): Promise<boolean> => {
    if (!Capacitor.isNativePlatform()) return true; // Browser handled by getUserMedia

    try {
      const status = await Camera.checkPermissions();
      if (status.camera === 'granted') return true;

      const request = await Camera.requestPermissions({ permissions: ['camera'] });
      return request.camera === 'granted';
    } catch (e) {
      console.error('Permission request failed', e);
      return false;
    }
  },

  /**
   * Captures a photo using the native camera UI.
   * This is much more "real" than a dummy webview stream.
   */
  takePhoto: async () => {
    const hasPermission = await NativeBridge.requestCameraPermissions();
    if (!hasPermission) throw new Error('Camera permission denied');

    return await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
  },

  /**
   * Monitors network status in real-time.
   */
  getNetworkStatus: async () => {
    return await Network.getStatus();
  },

  onNetworkChange: (callback: (status: any) => void) => {
    return Network.addListener('networkStatusChange', callback);
  }
};
