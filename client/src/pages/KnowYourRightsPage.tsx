import React, { useState, useEffect } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SectionHeader } from '../components/common/SectionHeader';
import { rightsService } from '../services/phase4Service';
import type { RightsGuide, EscalationResource } from '../types';
import {
  BookOpen,
  PhoneCall,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Phone,
  RefreshCw,
} from 'lucide-react';

export const KnowYourRightsPage: React.FC = () => {
  const [guides, setGuides] = useState<RightsGuide[]>([]);
  const [resources, setResources] = useState<EscalationResource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'GUIDES' | 'ESCALATION'>('GUIDES');
  const [language, setLanguage] = useState<'hi' | 'en'>('hi');

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [gList, rList] = await Promise.all([
          rightsService.getGuides(),
          rightsService.getEscalationResources(),
        ]);
        setGuides(gList);
        setResources(rList);
      } catch (err: any) {
        setError(err.message || 'Failed to load rights guides.');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <PageContainer>
      <SectionHeader
        title="Know Your Rights — Worker Awareness Centre"
        hindiTitle="कामगार अधिकार व कानूनी जागरूकता"
        description="Clear, plain-language statutory rights under Indian labour laws, minimum wage rules, and verified official government escalation resources."
        action={
          <div className="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg text-xs">
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                language === 'hi' ? 'bg-white text-forest shadow-xs' : 'text-gray-600'
              }`}
            >
              हिंदी (Hindi)
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1.5 rounded-md font-semibold transition ${
                language === 'en' ? 'bg-white text-forest shadow-xs' : 'text-gray-600'
              }`}
            >
              English
            </button>
          </div>
        }
      />

      {/* Main Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-3">
        <button
          onClick={() => setActiveTab('GUIDES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'GUIDES'
              ? 'bg-forest text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Statutory Rights Guides (कानूनी अधिकार मार्गदर्शिका)
        </button>

        <button
          onClick={() => setActiveTab('ESCALATION')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
            activeTab === 'ESCALATION'
              ? 'bg-forest text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <PhoneCall className="w-4 h-4" />
          5-Step Escalation Workflow (विवाद समाधान व हेल्पलाइन)
        </button>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-16 text-center text-gray-500">
          <RefreshCw className="w-8 h-8 animate-spin text-forest mx-auto mb-3" />
          <p className="text-xs font-semibold">Loading official rights guidelines...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-rose-200 p-6 text-center text-rose-700 text-xs">
          {error}
        </div>
      ) : activeTab === 'GUIDES' ? (
        /* Guides View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-xs flex flex-col justify-between hover:border-gray-300 transition"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-forest tracking-wider uppercase bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200">
                    {language === 'hi' ? guide.categoryHindi : guide.category}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    Reviewed: {guide.lastReviewedDate}
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mt-1 leading-snug">
                  {language === 'hi' ? guide.titleHindi : guide.title}
                </h3>

                <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                  {language === 'hi' ? guide.summaryHindi : guide.summary}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                  <span className="text-[11px] font-semibold text-gray-800 block">
                    {language === 'hi' ? 'मुख्य कानूनी बातें:' : 'Key Statutory Takeaways:'}
                  </span>
                  {(language === 'hi' ? guide.keyPointsHindi : guide.keyPoints).map((pt, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-forest shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400 font-mono truncate max-w-[200px]">
                  {guide.officialReference}
                </span>
                <a
                  href={guide.officialSourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-forest hover:underline font-semibold"
                >
                  Official Source <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 5-Step Escalation Workflow */
        <div className="space-y-4">
          <div className="p-4 bg-forest-50/70 border border-forest-200 rounded-2xl flex items-start gap-3 text-xs text-forest">
            <ShieldCheck className="w-5 h-5 text-forest shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-sm">
                Recommended 5-Step Resolution Sequence (सुझाया गया समाधान क्रम)
              </span>
              <p className="text-gray-700 mt-0.5 leading-relaxed">
                Most wage delays can be resolved respectfully through clear digital records. Always follow steps sequentially from friendly dialogue to official authorities.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {resources.map((step) => (
              <div
                key={step.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-8 h-8 rounded-full bg-forest text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {step.stepNumber}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">
                        {language === 'hi' ? step.titleHindi : step.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {language === 'hi' ? step.descriptionHindi : step.description}
                      </p>
                      <div className="mt-2 text-xs font-semibold text-forest">
                        Action:{' '}
                        <span className="text-gray-800 font-normal">
                          {language === 'hi' ? step.actionGuidanceHindi : step.actionGuidance}
                        </span>
                      </div>
                    </div>
                  </div>

                  {step.contactDetails && Object.keys(step.contactDetails).length > 0 && (
                    <div className="p-3 bg-slate-50 border border-gray-200 rounded-xl text-xs space-y-1 sm:w-64 shrink-0">
                      <span className="text-gray-400 text-[10px] uppercase font-semibold block">
                        Official Contact
                      </span>
                      {step.contactDetails.helpline && (
                        <div className="flex items-center gap-1.5 font-bold text-forest">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{step.contactDetails.helpline}</span>
                        </div>
                      )}
                      {step.contactDetails.portalUrl && (
                        <a
                          href={step.contactDetails.portalUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-forest hover:underline font-semibold block"
                        >
                          Visit Official Portal <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Educational Legal Note */}
      <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl text-[11px] text-gray-500 text-center leading-relaxed">
        <strong>Important Educational Notice:</strong> The information provided in this rights centre is curated directly from published central and state labour statutes. It is for educational and empowerment awareness purposes and does not constitute individual legal advocacy. MehnatNama provides documentation tools to assist informal workers.
      </div>
    </PageContainer>
  );
};
