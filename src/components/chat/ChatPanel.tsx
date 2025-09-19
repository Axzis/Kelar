
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// --- Static Data for UI Prototyping ---
const recipient = {
  name: 'Budi (Tukang AC)',
  avatarUrl: 'https://picsum.photos/seed/budi-ac/100/100',
};

const messages = [
  { id: 1, text: 'Halo, saya tertarik dengan jasa perbaikan AC Anda.', sender: 'me' },
  { id: 2, text: 'Tentu, Pak. Ada yang bisa saya bantu? AC nya kenapa ya?', sender: 'other' },
  { id: 3, text: 'AC saya tidak dingin dan mengeluarkan air. Kira-kira berapa biayanya untuk pengecekan?', sender: 'me' },
  { id: 4, text: 'Untuk biaya pengecekan saja Rp 50.000, Pak. Nanti kalau ada perbaikan, biayanya akan diinformasikan setelah pengecekan.', sender: 'other' },
  { id: 5, text: 'Baik, saya setuju. Kapan bisa datang ke lokasi?', sender: 'me' },
];
// --- End of Static Data ---

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  // In the future, we'll pass the recipient and message data here
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
      <div className="flex h-[60vh] flex-col rounded-lg border bg-card shadow-lg">
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
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-end gap-2',
                  message.sender === 'me' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.sender === 'other' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={recipient.avatarUrl} />
                    <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[75%] rounded-lg px-4 py-2',
                    message.sender === 'me'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input Pesan */}
        <div className="border-t p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Logic to send message will be added here
              (e.target as HTMLFormElement).reset();
            }}
            className="flex items-center gap-2"
          >
            <Input
              name="message"
              placeholder="Ketik pesan Anda..."
              autoComplete="off"
            />
            <Button type="submit" size="icon" className="flex-shrink-0">
              <Send className="h-5 w-5" />
              <span className="sr-only">Kirim</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
