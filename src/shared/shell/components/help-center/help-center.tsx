import React, { useState } from "react";
import {
  IconHome,
  IconMessage,
  IconHelp,
  IconSearch,
  IconChevronRight,
} from "@tabler/icons-react";
import { Button, Divider, ScrollArea } from "@mantine/core";

const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState("help");

  const faqs = [
    {
      category: "Property Management FAQs",
      articles: 10,
      author: "Support Team",
      questions: [
        "How can I manage my properties?",
        "Can I list multiple properties at once?",
        "How do I add or edit property details?",
        "How can tenants contact me?",
        "Can I track rental payments through the website?",
        "How do I ensure my property gets maximum visibility?",
        "Can I remove a property once it's rented or sold?",
        "How to handle maintenance requests?",
        "What are the best practices for tenant screening?",
        "How to set competitive rental prices?",
      ],
    },
    {
      category: "Account Settings",
      articles: 5,
      author: "Admin Team",
      questions: [
        "How to update my profile information?",
        "How to change my password?",
        "How to set up two-factor authentication?",
        "How to manage notification preferences?",
        "How to delete my account?",
      ],
    },
    {
      category: "Billing & Payments",
      articles: 8,
      author: "Billing Department",
      questions: [
        "How to view my billing history?",
        "What payment methods are accepted?",
        "How to update my payment information?",
        "How to download invoices?",
        "How to resolve payment issues?",
        "Understanding subscription plans",
        "How to cancel my subscription?",
        "How to request a refund?",
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen max-w rounded-lg overflow-hidden">
      <div className="p-3 ">
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
          <IconSearch size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Search for help"
            className="bg-transparent outline-none ml-2 text-sm w-full"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 pb-16">
        <div className="space-y-6 py-4">
          {faqs.map((section, index) => (
            <div key={index} className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-800">
                  {section.category}
                </h3>
                <p className="text-gray-500 text-xs">
                  {section.articles} articles • By {section.author}
                </p>
              </div>
              <Divider />

              <ul className="space-y-2">
                {section.questions.map((question, qIndex) => (
                  <>
                    <li
                      key={qIndex}
                      className="p-2 rounded-md cursor-pointer hover:bg-blue-50 transition-colors duration-150 text-sm text-gray-700"
                    >
                      <div className="flex justify-between">
                        <div>{question}</div>
                        <Button
                          variant="subtle"
                          size="compact-xs"
                          leftSection={
                            <IconChevronRight size={16} color={"#111827"} />
                          }
                        ></Button>
                      </div>
                    </li>
                    <Divider />
                  </>
                ))}
              </ul>

              {index < faqs.length - 1 && (
                <hr className="my-4 border-gray-100" />
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="flex justify-end pb-4 bg-transparent border-t-2 border-t-gray-100 px-8">
        <div className="flex justify-between items-center bg-white  p-2 w-full ">
          <button
            className={`flex flex-col items-center text-sm p-2 ${activeTab === "home" ? "text-blue-600" : "text-gray-900"}`}
            onClick={() => setActiveTab("home")}
          >
            <IconHome size={20} />
            Home
          </button>
          <button
            className={`flex flex-col items-center text-sm p-2 ${activeTab === "messages" ? "text-blue-600" : "text-gray-900"}`}
            onClick={() => setActiveTab("messages")}
          >
            <IconMessage size={20} />
            Messages
          </button>
          <button
            className={`flex flex-col items-center text-sm p-2 ${activeTab === "help" ? "text-blue-600" : "text-gray-900"}`}
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
