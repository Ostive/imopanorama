"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export  function Faq() {
  const faqs = [
    {
      question: "What services does your real estate agency offer?",
      answer:
        "Our agency offers a comprehensive range of services including buying, selling, and renting properties. We also provide property management, real estate consulting, and market analysis services.",
    },
    {
      question: "How do I start the process of buying a home?",
      answer:
        "To start the home buying process, first determine your budget and get pre-approved for a mortgage. Then, contact our agency to be paired with a realtor who will guide you through searching for properties, making offers, and closing the deal.",
    },
    {
      question: "What should I do to prepare my home for sale?",
      answer:
        "To prepare your home for sale, consider decluttering, deep cleaning, and making minor repairs. Our agents can provide a detailed assessment and recommendations to maximize your home's appeal to potential buyers.",
    },
    {
      question: "How long does it typically take to sell a house?",
      answer:
        "The time it takes to sell a house can vary greatly depending on market conditions, pricing, and the property itself. On average, it can take anywhere from 30 to 90 days, but our agents will work to optimize the process for your specific situation.",
    },
    {
      question: "What fees are involved in buying or selling a property?",
      answer:
        "Fees can include agent commissions, closing costs, appraisal fees, and inspection costs. For buyers, many of these fees are negotiable. For sellers, the main cost is typically the agent's commission. We provide a transparent breakdown of all potential costs upfront.",
    },
    {
      question: "How do you determine the value of a property?",
      answer:
        "We determine property values through comparative market analysis, considering factors such as location, size, condition, and recent sales of similar properties in the area. Our experienced appraisers use both data-driven approaches and local market knowledge.",
    },
    {
      question: "Can you help me find rental properties?",
      answer:
        "Yes, we assist clients in finding rental properties that match their needs and budget. We have a wide network of landlords and property managers, and can help with the entire rental process from search to lease signing.",
    },
    {
      question: "Do you offer virtual property tours?",
      answer:
        "We offer virtual property tours for many of our listings. This service allows potential buyers to explore properties remotely, saving time and providing a convenient option for out-of-town clients or initial screenings.",
    },
  ];

  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="w-full py-12 ">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                className="w-full text-left p-4 focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 hover:bg-gray-50"
                onClick={() => toggleItem(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold pr-8">{faq.question}</h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="flex-shrink-0 h-5 w-5 text-primary" />
                  ) : (
                    <ChevronDown className="flex-shrink-0 h-5 w-5 text-primary" />
                  )}
                </div>
              </button>
              {openItems.includes(index) && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
