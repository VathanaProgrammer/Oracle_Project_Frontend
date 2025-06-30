import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { ref } from 'vue'
export const API_BASE_URL = 'http://localhost:8080'
export const API_BASE_FILE_URL = `${API_BASE_URL}/api/files`
export function useWebSocket(handlers = {}) {
  let stompClient = null
  const isConnected = ref(false)

  function connect() {
    console.log('🔌 Connecting to WebSocket…')
    stompClient = new Client({
      webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws`),
      reconnectDelay: 5000,

      onConnect: () => {
        console.log('✅ Connected')

        isConnected.value = true

        // Subscribe to all topics you provide
        Object.entries(handlers).forEach(([topic, callback]) => {
          stompClient.subscribe(topic, (message) => {
            try {
              const data = JSON.parse(message.body)
              callback(data)
            } catch (err) {
              console.error(`❌ Failed to parse message on ${topic}`, err)
            }
          })
        })
      },

      onStompError: (frame) => {
        console.error('❌ STOMP error:', frame.headers['message'])
      },

      onWebSocketClose: () => {
        console.log('⚠️ WebSocket closed')
        isConnected.value = false
      }
    })

    stompClient.activate()
  }

  function disconnect() {
    if (stompClient && stompClient.active) {
      stompClient.deactivate()
      isConnected.value = false
      console.log('🛑 Disconnected')
    }
  }

  function send(destination, payload) {
    if (stompClient && stompClient.active && isConnected.value) {
      stompClient.publish({
        destination,
        body: JSON.stringify(payload)
      })
      console.log(`📤 Sent to ${destination}:`, payload)
    } else {
      console.warn('⚠️ Cannot send, not connected')
    }
  }

  return {
    connect,
    disconnect,
    send,
    isConnected,
    API_BASE_URL,
    API_BASE_FILE_URL
  }
}
