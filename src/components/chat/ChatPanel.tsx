
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

// --- Interfaces ---
interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: Timestamp;
}

interface Recipient {
  id: string;
  name: string;
  avatarUrl: string;
}

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  chatId: string;
  currentUserId: string;
  recipient: Recipient;
}
// --- End of Interfaces ---

export function ChatPanel({ isOpen, onClose, chatId, currentUserId, recipient }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // --- Mengambil Pesan (Receive) ---
  useEffect(() => {
    if (!isOpen || !chatId) return;

    setLoading(true);
    const messagesQuery = query(
      collection(db, 'chats', chatId, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const fetchedMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Message[];
      setMessages(fetchedMessages);
      setLoading(false);
    }, (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId, isOpen]);
  
  // --- Auto-scroll to bottom ---
  useEffect(() => {
    if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector('div:first-child');
        if (scrollContainer) {
            scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }
    }
  }, [messages]);


  // --- Mengirim Pesan (Send) ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !currentUserId || !chatId) return;

    const text = newMessage;
    setNewMessage('');

    try {
      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        text: text,
        senderId: currentUserId,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
      // Optional: show a toast notification for send failure
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
      <div className="flex h-[70vh] flex-col rounded-lg border bg-card shadow-lg">
        {/* Header Chat */}
        <div className="flex items-center justify-between border-b p-3">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={recipient.avatarUrl} alt={recipient.name} />
              <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-semibold">{recipient.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Tutup Chat</span>
          </Button>
        </div>

        {/* Area Pesan */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-end gap-2',
                    message.senderId === currentUserId ? 'justify-end' : 'justify-start'
                  )}
                >
                  {message.senderId !== currentUserId && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={recipient.avatarUrl} />
                      <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[75%] rounded-lg px-4 py-2',
                      message.senderId === currentUserId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input Pesan */}
        <div className="border-t p-3">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2"
          >
            <Input
              name="message"
              placeholder="Ketik pesan Anda..."
              autoComplete="off"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <Button type="submit" size="icon" className="flex-shrink-0" disabled={!newMessage.trim()}>
              <Send className="h-5 w-5" />
              <span className="sr-only">Kirim</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

    
