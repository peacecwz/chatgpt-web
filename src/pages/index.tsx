import React, {FC, ReactNode, useEffect, useState} from "react";
import {AiOutlinePlus, AiOutlineCopy} from 'react-icons/ai';
import {GoComment} from 'react-icons/go';
import {HiOutlineClipboardCopy, HiOutlinePencilAlt} from 'react-icons/hi';
import {BiTrash, BiUser} from 'react-icons/bi';
import {MdOutlineDarkMode, MdLogout} from "react-icons/md";
import {FiExternalLink} from "react-icons/fi";
import {Conversation} from "@web/models/api";
import {SiOpenai} from "react-icons/si";
import ReactMarkdown from "react-markdown";
// @ts-ignore
import codeblocks from 'remark-code-blocks';
import rehypeHighlight from 'rehype-highlight'
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import {copyToClipboard} from "@web/utils/clipboard";
import {TbSend} from "react-icons/tb";
import {useTheme} from "next-themes";

type ItemProps = {
    children?: ReactNode;
    icon?: ReactNode;
    type: "history" | "link";
    item: Conversation;
    selected?: boolean;
    href?: string;
    onClick?: (conversation: Conversation) => void;
    onDelete?: (conversation: Conversation) => void;
    onRename?: (conversation: Conversation) => void;
}

const Item: FC<ItemProps> = (props) => {
    const {
        icon,
        item,
        type,
        href,
        selected,
        onClick,
        onDelete,
        onRename
    } = props;

    return (
        <a
            href={type === "link" && href ? href : undefined}
            onClick={() => onClick && onClick(item)}
            className="w-full flex items-center space-x-3.5 py-2.5 px-3 text-gray-100 hover:bg-gray-800 hover:cursor-pointer">
            {icon}
            <p className="grow">{item.name}</p>
            {selected && type === "history" && (
                <div className="flex-none space-x-2">
                    <button className="text-gray-400 hover:text-white">
                        <HiOutlinePencilAlt/>
                    </button>
                    <button onClick={() => onDelete && onDelete(item)} className="text-gray-400 hover:text-white">
                        <BiTrash/>
                    </button>
                </div>
            )}
        </a>
    )
}

const Sidebar: FC<{ current: Conversation | null; changeCurrent: (item: Conversation | null) => void; conversations: Conversation[]; onChange: () => void; }> = (props) => {
    const {conversations, current, changeCurrent, onChange} = props;
    const {theme, setTheme} = useTheme();

    return (
        <div className="bg-gray-900 w-72 p-2 h-full flex flex-col justify-between">
            <button
                className="w-full flex items-center px-2 space-x-2 py-3 text-gray-100 border border-gray-700 hover:bg-gray-800">
                <AiOutlinePlus/>
                <span>New Chat</span>
            </button>

            <div className="overflow-y-auto mt-2 h-screen">
                {conversations.map((item, index) => (
                    <Item
                        key={`${index}-conversation-${item.id}`}
                        item={item}
                        type="history"
                        icon={<GoComment/>}
                        selected={current?.id === item.id}
                        onClick={(conversation) => changeCurrent(conversation)}
                        onDelete={(conversation) => fetch(`/api/conversations/delete?id=${conversation.id}`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then(() => {
                            changeCurrent(null);
                            onChange();
                        })}
                    />
                ))}
            </div>

            <div className="sticky bottom-0 py-1 border-t-2 shadow border-solid border-t-gray-400">
                <Item
                    item={{
                        id: "0",
                        messages: [],
                        name: 'Clear Conversations',
                    }}
                    onClick={async () => {
                        await fetch('/api/conversations/delete', {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                        changeCurrent(null);
                        onChange();
                    }}
                    type="link"
                    icon={<BiTrash/>}
                />
                <Item
                    item={{
                        id: "0",
                        messages: [],
                        name: theme === 'light' ? 'Dark Mode' : 'Light Mode'
                    }}
                    onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                    type="link"
                    icon={<MdOutlineDarkMode/>}
                />
                <Item
                    item={{
                        id: "0",
                        messages: [],
                        name: 'My Account'
                    }}
                    onClick={() => console.log('account')}
                    type="link"
                    icon={<BiUser/>}
                />
                <Item
                    item={{
                        id: "0",
                        messages: [],
                        name: 'Updates & FAQ'
                    }}
                    href="https://github.com/peacecwz/chatgpt-web"
                    type="link"
                    icon={<FiExternalLink/>}
                />
                <Item
                    item={{
                        id: "0",
                        messages: [],
                        name: 'Log Out'
                    }}
                    type="link"
                    icon={<MdLogout/>}
                />
            </div>
        </div>
    );
};

const ChatScreen: FC<{ current: Conversation | null; changeCurrent: (item: Conversation | null) => void; onChange: () => void; }> = (props) => {
    const {current, onChange, changeCurrent} = props;
    const [style, setStyle] = useState({})

    const [message, setMessage] = useState('');

    const handleKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();

            const result = await fetch('/api/conversations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    conversationId: current?.id,
                    text: message
                })
            }).then(res => res.json());

            onChange();
            changeCurrent(result);
            setMessage('');
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    }

    useEffect(() => {
        import('react-syntax-highlighter/dist/esm/styles/prism/dracula')
            .then(mod => setStyle(mod.default));
    })

    return (
        <div id="chat-screen" className="w-full flex flex-col h-screen">
            <div className="flex-grow overflow-y-auto text-lg font-light">
                {current ? (
                    <ul className="mt-4">
                        {current.messages.map((message, index) => (
                            <li
                                key={`${index}-${current.id}-message`}
                                className={`flex py-6 space-x-2 py-2 px-4 border-b border-black/10 dark:border-gray-900/50 group ${message.role === "system" ? 'bg-gray-50 dark:bg-[#444654]' : 'dark:bg-gray-800'}`}
                            >
                                <div className="flex px-96 items-start space-x-4">
                                    <div
                                        className={`p-1 ${message.role === "system" ? 'bg-green-900' : 'bg-blue-700'}`}
                                    >
                                        {message.role === "user" ? (
                                            <BiUser
                                                color={"#fff"}
                                                size={20}
                                                enableBackground={"rgb(16, 163, 127)"}
                                            />
                                        ) : (
                                            <SiOpenai
                                                color={"#fff"}
                                                size={20}
                                                enableBackground={"rgb(16, 163, 127)"}
                                            />
                                        )}
                                    </div>
                                    <div
                                        className="text-gray-800 text-gray-800 dark:text-white font-medium self-center space-y-4 max-w-2xl">
                                        <ReactMarkdown
                                            remarkPlugins={[codeblocks]}
                                            components={{
                                                code({node, inline, className, children, ...props}) {
                                                    const match = /language-(\w+)/.exec(className || '')
                                                    return !inline && match ? (
                                                        <div className="space-y-0 bg-black">
                                                            <div
                                                                className="flex justify-between bg-gray-800 font-light text-white text-xs p-2">
                                                                <span>{match[1]}</span>
                                                                <button
                                                                    onClick={() => copyToClipboard(String(children).replace(/\n$/, ''))}
                                                                    className="flex justify-center space-x-2 mr-2">
                                                                    <AiOutlineCopy size={20}/>
                                                                    <span>Copy Code</span>
                                                                </button>
                                                            </div>
                                                            <SyntaxHighlighter
                                                                {...props}
                                                                language={match[1]}
                                                                PreTag="div"
                                                                style={style}
                                                                className="!m-0 !bg-black"
                                                            >
                                                                {String(children).replace(/\n$/, '')}
                                                            </SyntaxHighlighter>
                                                        </div>
                                                    ) : (
                                                        <code className={className} {...props}>
                                                            {children}
                                                        </code>
                                                    )
                                                }
                                            }}
                                        >
                                            {message.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex w-full h-screen justify-center items-center">
                        Standalone ChatGPT
                    </div>
                )}
            </div>

            <div className="flex sticky bottom-0 py-4 px-6 justify-center">
                <div className="relative w-full max-w-2xl">
                        <textarea
                            className="w-1/2 shadow-[0_0_10px_rgba(0,0,0,0.10)] dark:shadow-[0_0_15px_rgba(0,0,0,0.10)] w-full rounded-lg py-2 px-4 resize-none border-0"
                            placeholder="Type your message here..."
                            rows={1}
                            value={message}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                        ></textarea>
                    <button
                        className="absolute right-1 top-0.5 bottom-0.5 px-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600">
                        <TbSend size={24}/>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Home() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);

    const refreshConversations = async () => {
        await fetch('/api/conversations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                setConversations(data)
            });
    }

    useEffect(() => {
        refreshConversations();
    }, []);

    return (
        <div className="flex h-screen">
            <Sidebar
                current={currentConversation}
                changeCurrent={(item) => setCurrentConversation(item)}
                onChange={() => refreshConversations()}
                conversations={conversations}
            />
            <ChatScreen
                changeCurrent={(item) => setCurrentConversation(item)}
                onChange={() => refreshConversations()}
                current={currentConversation}
            />
        </div>
    )
}
