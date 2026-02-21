import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";

export default function ChatInterface() {
  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onError: (err) => {
      console.error('Chat error:', err);
    }
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    if (message?.trim()) {
      sendMessage({ text: message });
      e.currentTarget.reset();
    }
  };

  const isLoading = status === 'submitted';
  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen bg-[#e9ecf2]">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/30 bg-white/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-gray-600">Resume</div>
            <h1 className="text-2xl md:text-3xl text-gray-900">
              Alexandre Hebert
            </h1>
            <p className="text-sm text-gray-600">
              Ask me about his experience and skills
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <a
              href="/en"
              className="px-3 py-1.5 text-sm rounded-full border border-gray-900/10 bg-white/70 hover:bg-white"
            >
              CV EN
            </a>
            <a
              href="/fr"
              className="px-3 py-1.5 text-sm rounded-full border border-gray-900/10 bg-white/70 hover:bg-white"
            >
              CV FR
            </a>
          </div>
        </div>
      </header>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-800">
              <strong>Error:</strong> {error.message}
            </div>
          )}
          
          {!hasMessages && (
            <div className="min-h-[65vh] flex items-center justify-center">
              <div className="w-full max-w-3xl rounded-lg border border-white/60 bg-white/90 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur p-8 text-center">
                <div className="text-xs uppercase tracking-[0.3em] text-gray-500">Resume</div>
                    <div className="mt-4 flex items-center justify-center">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-gray-200 bg-gray-50">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="h-6 w-6 text-gray-700"
                          aria-hidden="true"
                        >
                          <path d="M4 20v-1a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v1" />
                          <circle cx="12" cy="8" r="4" />
                        </svg>
                      </span>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mt-4">
                      Alexandre's Resume
                    </h2>
                <p className="text-gray-600 mt-2">
                  I am Alexandre's resume. Ask about Alexandre's experience, skills, or roles.
                </p>
                <div className="mt-5 text-sm text-gray-500 space-y-2">
                  <p className="font-medium">Try asking:</p>
                  <ul className="list-disc list-inside text-left max-w-md mx-auto">
                    <li>What are Alexandre's main technical skills?</li>
                    <li>Tell me about his experience at Fairstone Bank</li>
                    <li>What companies has Alexandre worked for?</li>
                    <li>Parlez-moi de l'experience d'Alexandre</li>
                  </ul>
                </div>
                <form
                  onSubmit={handleSubmit}
                  className="mt-6 w-full flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="text"
                    name="message"
                    placeholder="Ask about the resume..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={isLoading}
                        className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          )}

          {messages.map((message: any) => {
            // Extract text from parts array
            const messageText = message.parts
              ?.filter((part: any) => part.type === 'text')
              .map((part: any) => part.text)
              .join('') || message.text || '';
            
            return (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3xl rounded-lg px-4 py-3 ${
                    message.role === "user"
                          ? "bg-gray-900 text-white"
                      : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                  }`}
                >
                  <div className="text-sm font-medium mb-1 opacity-75">
                    {message.role === "user" ? "You" : "Resume"}
                  </div>
                  {message.role === "user" ? (
                    <div className="whitespace-pre-wrap">{messageText}</div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ node, ...props }) => <p className="mb-3 last:mb-0" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc mb-3 space-y-2 pl-5" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal mb-3 space-y-2 pl-5" {...props} />,
                          li: ({ node, ...props }) => <li className="mb-0" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                          em: ({ node, ...props }) => <em className="italic" {...props} />,
                          hr: ({ node, ...props }) => <hr className="my-4" {...props} />,
                          code: ({ node, inline, ...props }: any) => 
                            inline ? (
                              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                            ) : (
                              <code className="block bg-gray-100 p-2 rounded text-sm font-mono overflow-x-auto mb-2" {...props} />
                            ),
                          pre: ({ node, ...props }) => <pre className="mb-2" {...props} />,
                        }}
                      >
                        {messageText}
                      </ReactMarkdown>
                      <style>{`
                        .prose ul ul,
                        .prose ol ol,
                        .prose ul ol,
                        .prose ol ul {
                          margin-left: 1.5rem;
                          margin-top: 0.375rem;
                          margin-bottom: 0.375rem;
                        }
                      `}</style>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-3xl bg-white text-gray-900 border border-gray-200 shadow-sm rounded-lg px-4 py-3">
                <div className="text-sm font-medium mb-1 opacity-75">
                  Resume
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      {hasMessages && (
        <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto flex gap-3"
          >
            <input
              type="text"
              name="message"
              placeholder="Ask about the resume..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
