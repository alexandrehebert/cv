import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";

import { useState, useEffect } from "react";
import { translations } from "./translations";
type Locale = keyof typeof translations;

export default function ChatInterface() {
  const [locale, setLocale] = useState<Locale | undefined>(undefined);
  useEffect(() => {
    if (typeof window !== "undefined") {
      const browserLang = navigator.language?.slice(0, 2).toLowerCase();
      if (browserLang && ["en", "fr"].includes(browserLang)) {
        setLocale(browserLang as Locale);
      } else {
        setLocale("en");
      }
    }
  }, []);

  // Always call all hooks before any return!
  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
    onError: (err) => {
      console.error('Chat error:', err);
    }
  });

  // Use fallback to 'en' for t if locale is not set yet
  const t = translations[locale || "en"];

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const message = formData.get('message') as string;
    if (message?.trim()) {
      sendMessage({ text: message });
      e.currentTarget.reset();
    }
  };

  const handleNewConversation = () => {
    setMessages([]);
  };

  const isLoading = status === 'submitted';
  const hasMessages = messages.length > 0;

  return (
    <>
      {!locale ? (
        <div className="flex items-center justify-center h-screen bg-[#e9ecf2]">
          <div className="text-gray-500 text-lg animate-pulse">Loading…</div>
        </div>
      ) : (
        <div className="flex flex-col h-screen bg-[#e9ecf2]">
          {/* Header */}
          <header className="sticky top-0 z-20 border-b border-white/30 bg-white/70 backdrop-blur">
            <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-gray-600">{t.headerLabel}</div>
                <h1 className="text-2xl md:text-3xl text-gray-900">Alexandre Hebert</h1>
                <p className="text-sm text-gray-600">{t.headerSubtitle}</p>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                {hasMessages && (
                  <button
                    onClick={handleNewConversation}
                    className="px-3 py-1.5 text-sm rounded-full border border-gray-900/10 bg-white/70 hover:bg-white transition-colors"
                  >
                    {t.newConversation}
                  </button>
                )}
                <a
                  href={`/${locale}`}
                  className="px-3 py-1.5 text-sm rounded-full border border-gray-900/10 bg-white/70 hover:bg-white"
                >
                  {t.viewCv}
                </a>
                <div className="flex rounded-full border border-gray-900/10 overflow-hidden">
                  {(["en", "fr"] as Locale[]).map((localeItem) =>
                    localeItem === locale ? (
                      <div key={localeItem} className="px-3 py-1.5 text-sm bg-gray-900 text-white">
                        {localeItem}
                      </div>
                    ) : (
                      <button
                        key={localeItem}
                        onClick={() => setLocale(localeItem)}
                        className="px-3 py-1.5 text-sm bg-white/70 hover:bg-white"
                      >
                        {localeItem}
                      </button>
                    )
                  )}
                </div>
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
                  <div className="w-full max-w-3xl rounded-lg border border-white/60 bg-white/90 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.45)] backdrop-blur p-8 text-center relative">
                    <img src="/profile.jpeg" alt="Profile" className="absolute top-4 left-4 h-16 w-16 rounded-md object-cover border-2 border-gray-200 shadow-xl grayscale brightness-200" />
                    <div className="text-xs uppercase tracking-[0.3em] text-gray-500">{t.headerLabel}</div>
                    <h2 className="text-2xl font-semibold text-gray-900 mt-4">{t.welcomeTitle}</h2>
                    <p className="text-gray-600 mt-2">{t.welcomeDescription}</p>
                    <div className="mt-6 flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
                      {t.sampleQuestions.map((question, index) => (
                        <button
                          key={index}
                          onClick={() => sendMessage({ text: question })}
                          className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 transition-colors text-gray-700"
                          disabled={isLoading}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                    <form
                      onSubmit={handleSubmit}
                      className="mt-6 w-full flex flex-col sm:flex-row gap-3"
                    >
                      <input
                        type="text"
                        name="message"
                        placeholder={t.inputPlaceholder}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                        disabled={isLoading}
                        autoComplete="off"
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {t.send}
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
                        {message.role === "user" ? t.you : t.resume}
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
                    <div className="text-sm font-medium mb-1 opacity-75">{t.resume}</div>
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
                  placeholder={t.inputPlaceholder}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  disabled={isLoading}
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t.send}
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
}
