import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-[#181c2b] text-white rounded-lg shadow-lg font-semibold text-center animate-fade-in">
      {message}
    </div>
  );
}

// Função global para disparar toast
export function notify(message: string, duration?: number) {
  const event = new CustomEvent('show-toast', { detail: { message, duration } });
  window.dispatchEvent(event);
}
