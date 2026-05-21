import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Bot, MessageSquare, Send, X, User } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { getAI, getGenerativeModel } from 'firebase/ai';
import app from '@/config/firebase';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I am your Salepost AI assistant. How can I help you manage your scrap business today?',
        },
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const ai = getAI(app);
            const model = getGenerativeModel(ai, { model: 'gemini-1.5-flash' });
            
            const chat = model.startChat({
                history: messages.map(m => ({
                    role: m.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: m.content }],
                })),
            });

            const result = await chat.sendMessage(input);
            const response = await result.response;
            const text = response.text();

            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: text },
            ]);
        } catch (error) {
            console.error('AI Error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again later.',
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {isOpen ? (
                <Card className="w-80 h-[500px] flex flex-col shadow-2xl border-primary/20 animate-in slide-in-from-bottom-5">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4 bg-primary text-primary-foreground rounded-t-lg">
                        <CardTitle className="text-sm font-bold flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            AI Assistant
                        </CardTitle>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 p-0 overflow-hidden">
                        <ScrollArea className="h-full p-4" ref={scrollRef}>
                            <div className="space-y-4">
                                {messages.map((m, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            'flex gap-2 max-w-[85%]',
                                            m.role === 'user'
                                                ? 'ml-auto flex-row-reverse'
                                                : 'mr-auto'
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'size-6 rounded-full flex items-center justify-center shrink-0',
                                                m.role === 'user'
                                                    ? 'bg-primary/10'
                                                    : 'bg-muted'
                                            )}
                                        >
                                            {m.role === 'user' ? (
                                                <User className="h-3 w-3 text-primary" />
                                            ) : (
                                                <Bot className="h-3 w-3 text-foreground" />
                                            )}
                                        </div>
                                        <div
                                            className={cn(
                                                'rounded-2xl px-3 py-2 text-sm',
                                                m.role === 'user'
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : 'bg-muted rounded-tl-none'
                                            )}
                                        >
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-2 mr-auto max-w-[85%] animate-pulse">
                                        <div className="size-6 rounded-full bg-muted flex items-center justify-center shrink-0">
                                            <Bot className="h-3 w-3 text-foreground" />
                                        </div>
                                        <div className="rounded-2xl px-3 py-2 text-sm bg-muted rounded-tl-none">
                                            Typing...
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </CardContent>
                    <CardFooter className="p-3 border-t">
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSend();
                            }}
                            className="flex w-full items-center gap-2"
                        >
                            <Input
                                placeholder="Ask something..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="h-9"
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className="h-9 w-9 shrink-0"
                                disabled={!input.trim() || isTyping}
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </form>
                    </CardFooter>
                </Card>
            ) : (
                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-xl shadow-primary/30 hover:scale-105 transition-transform"
                    onClick={() => setIsOpen(true)}
                >
                    <MessageSquare className="h-6 w-6" />
                </Button>
            )}
        </div>
    );
}
