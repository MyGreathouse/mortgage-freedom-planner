'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import { SectionHeader } from '@/components/ui/Primitives';
import { ChevronIcon } from '@/components/ui/Icons';

const TOPICS = [
  { id: 'how', title: 'How Mortgages Work', body: "A mortgage is a loan secured against your home, repaid over an agreed term through regular instalments. Each payment is split between interest (the lender's charge for borrowing) and principal (the amount reducing your actual debt). Early in the term, more of each payment goes toward interest; over time, this balance shifts toward principal as the outstanding debt shrinks." },
  { id: 'fixedvar', title: 'Fixed vs Variable Rates', body: "A fixed rate keeps your interest rate — and monthly payment — the same for an agreed period, offering certainty for budgeting. A variable rate can move up or down with the lender's standard rate or the wider market, meaning payments could rise or fall. Trackers follow a specific benchmark, such as the Bank of England base rate, plus a set margin." },
  { id: 'interest', title: 'Understanding Interest', body: 'Interest is calculated on your outstanding balance, so a larger balance means more interest charged each period. This is why even small overpayments early in a mortgage can have an outsized effect — they reduce the balance interest is calculated on for the rest of the term, compounding the benefit month after month.' },
  { id: 'early', title: 'Why Early Payments Matter', body: 'Because interest compounds on the remaining balance, extra payments made earlier in a mortgage term generally save more in total interest than the same extra payment made later. Reducing the balance sooner means less interest accrues over every remaining month of the mortgage.' },
  { id: 'wealth', title: 'Building Property Wealth', body: 'Property wealth typically builds through two forces working together: paying down debt (increasing your share of ownership) and property value appreciation (increasing what that ownership is worth). Together, these grow your equity — the foundation many homeowners later use to invest further or fund other goals.' },
  { id: 'mistakes', title: 'Common Homeowner Mistakes', body: "Frequent pitfalls include not checking for early repayment charges before overpaying, letting a fixed deal lapse onto a lender's higher standard variable rate, underestimating maintenance and running costs, and not building an emergency fund alongside mortgage repayments." },
  { id: 'banks', title: 'How Banks Calculate Interest', body: 'Most UK mortgages use daily or monthly compounding on the outstanding balance. Lenders apply your annual interest rate divided across the compounding period to the current balance, then add that to what you owe before the next payment is applied — which is why paying even a little extra, even occasionally, chips away at future interest.' }
];

export default function EducationScreen() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="px-4 pt-4 pb-24">
      <SectionHeader eyebrow="Educational Hub" title="Learn the Basics" />
      {TOPICS.map((t) => {
        const open = openId === t.id;
        return (
          <Card key={t.id} className="cursor-pointer" onClick={() => setOpenId(open ? null : t.id)}>
            <div className="flex items-center justify-between">
              <div className="font-bold text-navy text-[14.5px]">{t.title}</div>
              <div className={['text-ink-soft transition-transform', open ? 'rotate-90' : ''].join(' ')}>
                <ChevronIcon />
              </div>
            </div>
            {open && <div className="text-[13px] text-ink-soft leading-relaxed mt-2.5">{t.body}</div>}
          </Card>
        );
      })}
    </div>
  );
}
