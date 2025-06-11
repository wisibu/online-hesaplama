"use client";

import React from 'react';
import CalculatorUI, { InputField } from '@/components/CalculatorUI';
import RichContent from '@/components/RichContent';
import { calculateSum } from './actions';

const pageConfig = {
  title: "Online Toplama Hesaplayıcı | OnlineHesaplama",
  description: "Bu online toplama hesaplayıcı, iki veya daha fazla sayıyı hızlı ve kolay bir şekilde toplamanıza olanak tanır. Sadece sayıları girin ve sonucu anında görün!",
  keywords: ["toplama hesaplama", "toplama makinesi", "online toplama", "sayı toplama"],
  calculator: {
    title: "Toplama Hesap Makinesi",
    description: (
      <p className="text-sm text-gray-600">
        Toplamak istediğiniz sayıları girin. Daha fazla sayı eklemek için "Sayı Ekle" butonunu kullanabilirsiniz.
      </p>
    ),
    inputFields: [
      { id: 'sayi1', label: '1. Sayı', type: 'number', placeholder: '10' },
      { id: 'sayi2', label: '2. Sayı', type: 'number', placeholder: '25' },
    ] as InputField[],
    calculate: calculateSum,
  },
  content: {
    sections: [
      {
        title: "Toplama İşleminin Önemi ve Kullanım Alanları",
        content: (
          <>
            <p>
              Toplama işlemi, matematiğin en temel ve en sık kullanılan dört işleminden biridir. Günlük hayatımızın her alanında farkında olsak da olmasak da toplama yaparız. Alışveriş yaparken ürünlerin fiyatlarını toplar, bir proje için gereken malzemelerin sayısını belirlerken toplama kullanırız. Finansal planlamadan mühendislik hesaplamalarına, bilimsel araştırmalardan basit ev işlerine kadar geniş bir yelpazede toplama işlemine ihtiyaç duyarız.
            </p>
            <p>
              Bu basit ama güçlü işlem, sayıları bir araya getirerek daha büyük bir bütün elde etmemizi sağlar. Çocukların matematik öğrenmeye başladığı ilk konulardan biri olan toplama, ilerleyen yıllarda daha karmaşık matematiksel kavramların anlaşılması için de bir temel oluşturur. Örneğin, çarpma işlemi aslında tekrarlı toplama olarak düşünülebilir.
            </p>
          </>
        )
      }
    ],
    faqs: [
      {
        question: "Online Toplama Araçlarının Faydaları Nelerdir?",
        answer: "Teknolojinin gelişmesiyle birlikte, toplama gibi basit işlemleri bile online araçlar üzerinden yapmak yaygınlaşmıştır. Bu araçlar hız ve kolaylık sağlar, işlem hatası riskini azaltır, büyük sayılarla çalışırken zaman kazandırır ve eğitim amaçlı kullanılabilir. Sitemizdeki bu toplama hesaplayıcı da sizlere bu faydaları sunmayı amaçlamaktadır."
      }
    ]
  }
};

export default function ToplamaClientPage() {
  return (
    <>
      <CalculatorUI 
        title={pageConfig.calculator.title} 
        inputFields={pageConfig.calculator.inputFields} 
        calculate={pageConfig.calculator.calculate} 
        description={pageConfig.calculator.description}
        resultTitle="Toplama Sonucu"
        dynamicFieldsConfig={{
          type: 'single',
          buttonLabel: 'Sayı Ekle',
          fieldLabel: 'Sayı',
          fieldPlaceholder: '0',
          fieldPrefix: 'sayi'
        }}
      />
      <RichContent sections={pageConfig.content.sections} faqs={pageConfig.content.faqs} />
    </>
  );
} 