import React from 'react';

interface MessageProps {
  message: string | null;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role='alert'
      className={`absolute top-0 left-1/2 transform -translate-x-1/2 p-3 rounded-md ${
        message.startsWith('Failed')
          ? 'bg-red-100 text-red-600'
          : 'bg-green-100 text-green-600'
      }`}
      style={{ zIndex: 10 }} // Ensure the message appears on top
    >
      {message}
    </div>
  );
};

export default Message;
