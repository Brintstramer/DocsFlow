import { useEffect, useRef } from "react";

export function useWebSocket(
  url: string,
  onMessage: (event: MessageEvent) => void,
) {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(url);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket подключен", url);
    };

    socket.onmessage = onMessage;

    socket.onerror = (error) => {
      console.error("WebSocket ошибка", error);
    };

    socket.onclose = () => {
      console.log("WebSocket закрыт", url);
    };

    return () => {
      socket.close();
    };
  }, [url, onMessage]);
}
