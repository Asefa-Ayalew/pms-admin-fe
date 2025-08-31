import React, { Dispatch, SetStateAction, useState } from "react";
import {
  IconChevronRight,
  IconHome,
  IconHelp,
  IconMessage,
  IconSearch,
} from "@tabler/icons-react";
import { Divider, ScrollArea } from "@mantine/core";

export type Question = { id: string; text: string; answer: string };
export type Article = { id: string; title: string; questions: Question[] };
export type Collection = { id: string; name: string; articles: Article[] };

export type View =
  | { type: "collections" }
  | { type: "articles"; data: Collection }
  | { type: "article-detail"; data: Article }
  | { type: "question-detail"; data: Question };

const collections: Collection[] = [
  {
    id: "c1",
    name: "Property Management",
    articles: [
      {
        id: "a1",
        title: "Managing Properties",
        questions: [
          {
            id: "q1",
            text: "How can I manage my properties?",
            answer:
              "Use the dashboard to manage properties, including adding, editing, and removing listings.",
          },
          {
            id: "q2",
            text: "Can I list multiple properties at once?",
            answer:
              "Yes, you can use the bulk upload feature via CSV or Excel files.",
          },
          {
            id: "q3",
            text: "How do I track property performance?",
            answer:
              "Check the analytics section for occupancy rates and rental performance.",
          },
        ],
      },
      {
        id: "a2",
        title: "Tenant Communication",
        questions: [
          {
            id: "q4",
            text: "How can tenants contact me?",
            answer:
              "Tenants can message you through the built-in messaging system.",
          },
          {
            id: "q5",
            text: "How do I respond to tenant inquiries?",
            answer:
              "All messages appear in your dashboard inbox; reply directly from there.",
          },
        ],
      },
      {
        id: "a3",
        title: "Maintenance Requests",
        questions: [
          {
            id: "q6",
            text: "How do tenants submit maintenance requests?",
            answer:
              "Tenants can submit requests through the property portal, which you can approve or assign to vendors.",
          },
          {
            id: "q7",
            text: "Can I track request status?",
            answer:
              "Yes, the dashboard provides a status tracker for all maintenance requests.",
          },
        ],
      },
    ],
  },
  {
    id: "c2",
    name: "Billing & Payments",
    articles: [
      {
        id: "a4",
        title: "Payment Methods",
        questions: [
          {
            id: "q8",
            text: "What payment methods are accepted?",
            answer:
              "We accept credit cards, PayPal, bank transfers, and some mobile wallets.",
          },
          {
            id: "q9",
            text: "Can tenants set up recurring payments?",
            answer:
              "Yes, tenants can enable automatic recurring payments for monthly rent.",
          },
        ],
      },
      {
        id: "a5",
        title: "Invoices & Receipts",
        questions: [
          {
            id: "q10",
            text: "How can I download my invoices?",
            answer:
              "Go to the Billing section and click 'Download PDF' next to each invoice.",
          },
          {
            id: "q11",
            text: "Can I resend invoices to tenants?",
            answer:
              "Yes, open the invoice and select 'Resend' to email it again.",
          },
        ],
      },
    ],
  },
  {
    id: "c3",
    name: "Account Settings",
    articles: [
      {
        id: "a6",
        title: "Profile Management",
        questions: [
          {
            id: "q12",
            text: "How do I update my profile?",
            answer: "Go to Account Settings > Profile and edit your details.",
          },
          {
            id: "q13",
            text: "How to change my password?",
            answer: "Go to Security > Change Password to update it safely.",
          },
        ],
      },
      {
        id: "a7",
        title: "Notifications",
        questions: [
          {
            id: "q14",
            text: "How do I manage notifications?",
            answer:
              "You can enable or disable notifications in Account Settings > Notifications.",
          },
        ],
      },
    ],
  },
  {
    id: "c4",
    name: "Legal & Compliance",
    articles: [
      {
        id: "a8",
        title: "Terms & Conditions",
        questions: [
          {
            id: "q15",
            text: "Where can I read the terms?",
            answer:
              "All terms are listed in the Legal section of your account dashboard.",
          },
        ],
      },
      {
        id: "a9",
        title: "Privacy Policy",
        questions: [
          {
            id: "q16",
            text: "How is my data protected?",
            answer:
              "We follow industry-standard encryption and privacy practices to protect your data.",
          },
          {
            id: "q17",
            text: "Can I request data deletion?",
            answer: "Yes, submit a request via the privacy settings page.",
          },
        ],
      },
    ],
  },
  {
    id: "c5",
    name: "Support & Help",
    articles: [
      {
        id: "a10",
        title: "Contact Support",
        questions: [
          {
            id: "q18",
            text: "How can I reach support?",
            answer: "You can contact support via chat, email, or phone.",
          },
          {
            id: "q19",
            text: "What are support hours?",
            answer:
              "Our support team is available Monday to Friday, 9am to 6pm.",
          },
        ],
      },
      {
        id: "a11",
        title: "FAQ",
        questions: [
          {
            id: "q20",
            text: "Where can I find frequently asked questions?",
            answer:
              "All FAQs are listed in the Help section for quick reference.",
          },
        ],
      },
    ],
  },
];

const HelpCenter = ({
  viewStack,
  setViewStack,
}: {
  viewStack: View[];
  setViewStack: Dispatch<SetStateAction<View[]>>;
}) => {
  const [activeTab, setActiveTab] = useState("help");
  const currentView = viewStack[viewStack.length - 1];

  return (
    <div className="flex flex-col h-screen max-w rounded-lg overflow-hidden">
      <div className="p-3">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <IconSearch size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search for help"
            className="bg-transparent outline-none ml-2 text-sm w-full text-gray-600"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 px-4 pb-4">
        <div className="space-y-6 py-2">
          {currentView.type === "collections" && (
            <>
              <h2 className="pl-2 text-gray-900">
                {collections.length} Collections
              </h2>
              <Divider className="bg-gray-100 my-2" />
              <ul>
                {collections.map((col, idx) => (
                  <React.Fragment key={col.id}>
                    <li
                      className="p-2 rounded-md cursor-pointer hover:bg-blue-50 flex justify-between"
                      onClick={() =>
                        setViewStack([
                          ...viewStack,
                          { type: "articles", data: col },
                        ])
                      }
                    >
                      <span>
                        <h2>{col.name}</h2>
                        <p className="text-sm text-gray-600 italic">
                          {col.articles.length} Articles
                        </p>
                      </span>

                      <IconChevronRight size={16} />
                    </li>
                    {idx !== collections.length - 1 && (
                      <Divider className="bg-gray-100 my-2" />
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </>
          )}

          {currentView.type === "articles" && (
            <>
              <h2 className="text-gray-900">{currentView.data.name}</h2>
              <Divider className="bg-gray-100 my-2" />
              <ul>
                {currentView.data.articles.map((art, idx) => (
                  <React.Fragment key={art.id}>
                    <li
                      className="p-2 rounded-md cursor-pointer hover:bg-blue-50 flex justify-between"
                      onClick={() =>
                        setViewStack([
                          ...viewStack,
                          { type: "article-detail", data: art },
                        ])
                      }
                    >
                      <span>
                        <h2>{art.title}</h2>
                        <p className="text-sm text-gray-600 italic">
                          {art.questions.length} Questions
                        </p>
                      </span>{" "}
                      <IconChevronRight size={16} />
                    </li>
                    {idx !== currentView.data.articles.length - 1 && (
                      <Divider className="bg-gray-100 my-2" />
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </>
          )}

          {currentView.type === "article-detail" && (
            <>
              <h2 className="font-semibold">{currentView.data.title}</h2>
              <Divider className="bg-gray-100 my-2" />
              <ul>
                {currentView.data.questions.map((q, idx) => (
                  <React.Fragment key={q.id}>
                    <li
                      className="p-2 rounded-md cursor-pointer hover:bg-blue-50 flex justify-between"
                      onClick={() =>
                        setViewStack([
                          ...viewStack,
                          { type: "question-detail", data: q },
                        ])
                      }
                    >
                      <span>{q.text}</span>
                      <IconChevronRight size={16} />
                    </li>
                    {idx !== currentView.data.questions.length - 1 && (
                      <Divider className="bg-gray-100 my-2" />
                    )}
                  </React.Fragment>
                ))}
              </ul>
            </>
          )}
        </div>
      </ScrollArea>

      <div className="flex justify-end pb-4 border-t-2 border-t-gray-100 px-8 shadow-[0_-4px_6px_-1px_rgba(203,213,225,0.5)]">
        <div className="flex justify-between items-center bg-white p-2 w-full">
          <button
            className={`flex flex-col items-center text-sm p-2 ${
              activeTab === "home" ? "text-blue-600" : "text-gray-900"
            }`}
            onClick={() => setActiveTab("home")}
          >
            <IconHome size={20} />
            Home
          </button>
          <button
            className={`flex flex-col items-center text-sm p-2 ${
              activeTab === "messages" ? "text-blue-600" : "text-gray-900"
            }`}
            onClick={() => setActiveTab("messages")}
          >
            <IconMessage size={20} />
            Messages
          </button>
          <button
            className={`flex flex-col items-center text-sm p-2 ${
              activeTab === "help" ? "text-blue-600" : "text-gray-900"
            }`}
            onClick={() => setActiveTab("help")}
          >
            <IconHelp size={20} />
            Help
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
