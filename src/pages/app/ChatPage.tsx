import { ChatWidget } from "@/components/ChatWidget";

export default function ChatPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Chat aberto:</h2>
        <p className="mt-1 text-sm text-muted-foreground">Converse com outros membros em tempo real.</p>
      </div>
      <div className="flex-1 border rounded-xl bg-background overflow-hidden flex flex-col" style={{ minHeight: "calc(100vh - 200px)" }}>
        <ChatWidget />
      </div>
    </div>
  );
}
