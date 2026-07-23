import Pusher from 'pusher-js';

let pusher = null;
let subscriptions = [];

const PUSHER_KEY = process.env.REACT_APP_PUSHER_CHANNELS_KEY;
const PUSHER_CLUSTER = process.env.REACT_APP_PUSHER_CHANNELS_CLUSTER;

const isConfigured = () => PUSHER_KEY && PUSHER_CLUSTER;

export const connectPusher = () => {
  if (pusher || !isConfigured()) return pusher;

  pusher = new Pusher(PUSHER_KEY, {
    cluster: PUSHER_CLUSTER,
    forceTLS: true,
  });

  return pusher;
};

export const subscribe = (channelName, eventName, callback) => {
  if (!pusher && !connectPusher()) return null;

  const channel = pusher.subscribe(channelName);
  channel.bind(eventName, callback);
  subscriptions.push({ channelName, eventName, callback, channel });
  return channel;
};

export const unsubscribe = (channelName, eventName, callback) => {
  if (!pusher) return;

  subscriptions = subscriptions.filter((s) => {
    if (s.channelName === channelName && s.eventName === eventName && (!callback || s.callback === callback)) {
      s.channel.unbind(eventName, s.callback);
      pusher.unsubscribe(channelName);
      return false;
    }
    return true;
  });
};

export const disconnectPusher = () => {
  if (!pusher) return;
  subscriptions.forEach((s) => {
    s.channel.unbind(s.eventName, s.callback);
    pusher.unsubscribe(s.channelName);
  });
  subscriptions = [];
  pusher.disconnect();
  pusher = null;
};

export { pusher };
