import * as PusherPushNotifications from '@pusher/push-notifications-web';

let beamsClient = null;

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

export const initPusherBeams = async () => {
  const instanceId = process.env.REACT_APP_PUSHER_BEAMS_INSTANCE_ID;
  if (!instanceId) {
    console.warn('Pusher Beams Instance ID not configured');
    return null;
  }

  beamsClient = new PusherPushNotifications.Client({ instanceId });

  try {
    await beamsClient.start();
    return beamsClient;
  } catch (error) {
    console.error('Pusher Beams start error:', error);
    return null;
  }
};

export const registerPusherUser = async () => {
  if (!beamsClient) {
    await initPusherBeams();
  }
  if (!beamsClient) return;

  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    await beamsClient.setUserId(token, {
      url: `${API_BASE_URL}/pusher/beams-auth`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Pusher Beams register error:', error);
  }
};

export const clearPusherUser = async () => {
  if (!beamsClient) return;
  try {
    await beamsClient.clearAllState();
  } catch (error) {
    console.error('Pusher Beams clear error:', error);
  }
};

export { beamsClient };
