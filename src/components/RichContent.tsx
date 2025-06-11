import React from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface RichContentProps {
  sections: {
    title: string;
    content: React.ReactNode;
  }[];
  faqs?: FAQItem[];
}

const RichContent: React.FC<RichContentProps> = ({ sections, faqs }) => {
  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": `<p>${faq.answer}</p>`
      }
    }))
  } : null;

  return (
    <div className="mt-12 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="space-y-10">
        {sections.map((section, index) => (
          <div key={index}>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              {section.content}
            </div>
          </div>
        ))}
        
        {faqs && faqs.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <details key={index} className="group p-4 bg-gray-50 rounded-lg border">
                  <summary className="font-semibold text-gray-800 cursor-pointer list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-gray-500 transition-transform duration-200 transform group-open:rotate-180">
                      ▼
                    </span>
                  </summary>
                  <div className="mt-4 text-gray-700">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </div>
  );
};

export default RichContent; 