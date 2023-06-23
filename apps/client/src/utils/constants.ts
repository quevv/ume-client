export const MISSING_REQUIRED_FIELD_MESSAGE = ''

export const getSocket = () => {
  const SOCKET_EVENT = {
    CONNECTION: 'connection',
    DISCONNECT: 'disconnect',
  }
  const SOCKET_SERVER_EMIT = {
    USER_BOOKING_PROVIDER: 'USER_BOOKING_PROVIDER',
    PROVIDER_HANDLED_BOOKING: 'PROVIDER_HANDLED_BOOKING',
  }
  const SOCKER_CHATTING_SERVER_EMIT = {
    MESSAGE_FROM_CHANNEL: 'MESSAGE_FROM_CHANNEL',
    SOMEONE_READ_MESSAGES_CHANNEL: 'SOMEONE_READ_MESSAGES_CHANNEL',
  }
  const SOCKER_CHATTING_SERVER_ON = {
    SENT_MESSAGE_TO_CHANNEL: 'SENT_MESSAGE_TO_CHANNEL',
    READ_MESSAGES_CHANNEL: 'READ_MESSAGES_CHANNEL',
  }
  return {
    SOCKET_EVENT,
    SOCKET_SERVER_EMIT,
    SOCKER_CHATTING_SERVER_EMIT,
    SOCKER_CHATTING_SERVER_ON,
  }
}
