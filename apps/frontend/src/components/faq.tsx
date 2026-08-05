"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface FaqItem {
  id: string;
  question: string;
  answer: string[];
}

interface Faq3Props {
  heading?: string;
  description?: string;
  items?: FaqItem[];
  supportHeading?: string;
  supportDescription?: string;
  supportButtonText?: string;
  supportButtonUrl?: string;
}

const Faq = ({
  heading,
  description,
  items,
  supportHeading,
  supportDescription,
  supportButtonText,
  supportButtonUrl = "mailto:sasuhalill@gmail.com",
}: Faq3Props) => {
  const { t } = useLanguage();

  const dynamicItems = [
    {
      id: "faq-1",
      question: t("faq.q1"),
      answer: t("faq.a1"),
    },
    {
      id: "faq-2",
      question: t("faq.q2"),
      answer: t("faq.a2"),
    },
    {
      id: "faq-3",
      question: t("faq.q3"),
      answer: t("faq.a3"),
    },
    {
      id: "faq-4",
      question: t("faq.q4"),
      answer: t("faq.a4"),
    },
    {
      id: "faq-5",
      question: t("faq.q5"),
      answer: t("faq.a5"),
    },
    {
      id: "faq-6",
      question: t("faq.q6"),
      answer: t("faq.a6"),
    },
  ];

  const finalHeading = heading || t("faq.title");
  const finalDescription = description || t("faq.desc");
  const finalItems = items || dynamicItems;
  const finalSupportHeading = supportHeading || t("faq.support_title");
  const finalSupportDescription = supportDescription || t("faq.support_desc");
  const finalSupportButtonText = supportButtonText || t("faq.support_btn");

  return (
    <section className="py-32 w-full" id="faqs">
      <div className="container space-y-16">
        <div className="mx-auto flex max-w-3xl flex-col text-center">
          <h2 className="mb-3 text-3xl font-semibold md:mb-4 lg:mb-6 lg:text-4xl text-slate-900 dark:text-white">
            {finalHeading}
          </h2>
          <p className="text-muted-foreground text-justify lg:text-lg dark:text-slate-400">
            {finalDescription}
          </p>
        </div>
        <Accordion
          type="single"
          collapsible
          className="mx-auto w-full lg:max-w-3xl"
        >
          {finalItems.map((item) => (
            <AccordionItem key={item.id} value={item.id}>
              <AccordionTrigger className="transition-opacity duration-200 hover:no-underline hover:opacity-60 text-slate-900 dark:text-slate-100">
                <div className="font-medium sm:py-1 lg:py-2 lg:text-lg text-left">
                  {item.question}
                </div>
              </AccordionTrigger>
              <AccordionContent className="sm:mb-1 lg:mb-2 text-slate-700 dark:text-slate-350">
                <div className="text-muted-foreground lg:text-lg dark:text-slate-400 text-left">
                  {Array.isArray(item.answer) ? (
                    item.answer.map((line, index) => <p key={index}>{line}</p>)
                  ) : (
                    <p>{item.answer}</p>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        <div className="bg-[#ebc834] dark:bg-slate-900 border border-transparent dark:border-slate-800 mx-auto flex max-w-4xl flex-col items-center rounded-lg p-4 text-center md:rounded-xl md:p-6 lg:p-8 transition-colors duration-300">
          <h3 className="mb-2 max-w-3xl font-semibold lg:text-lg text-slate-900 dark:text-white">
            {finalSupportHeading}
          </h3>
          <p className="mb-8 max-w-3xl lg:text-lg text-slate-800 dark:text-slate-300">{finalSupportDescription}</p>
          <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
            <Button className="w-full sm:w-auto" asChild>
              <a href={supportButtonUrl} target="_blank">
                {finalSupportButtonText}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Faq };
