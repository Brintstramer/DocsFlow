import { useEffect, useRef, useState, useCallback } from "react";
import type { WSMessage } from "../types/types";

export function useWebSocket(url: string, token?: string) {
  const [lastMessage, setLastMessage] = useState<WSMessage | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimer = useRef<NodeJS.Timeout>(null);

  const connect = useCallback(() => {
    const wsUrl = token ? `${url}?token=${token}` : url;
    const socket = new WebSocket(wsUrl);

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket подключён:", wsUrl);
    };

    socket.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);
        setLastMessage(data);
      } catch {
        console.warn("Не удалось распарсить WS сообщение:", event.data);
      }
    };

    socket.onerror = (err) => {
      console.error("⚠️ WebSocket ошибка:", err);
    };

    socket.onclose = () => {
      console.log("❌ WebSocket закрыт, пробуем переподключение...");
      reconnectTimer.current = setTimeout(connect, 2000);
    };
  }, [url, token]);

  useEffect(() => {
    connect();
    return () => {
      socketRef.current?.close();
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
    };
  }, [connect]);

  const sendMessage = useCallback((msg: WSMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(msg));
    } else {
      console.warn("⚠️ WebSocket не подключен, сообщение не отправлено");
    }
  }, []);

  return { lastMessage, sendMessage };
}
