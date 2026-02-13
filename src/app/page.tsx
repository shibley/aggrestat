import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Search, Brain, Bell, BarChart3, Target, ArrowRight, Check, MessageSquare } from 'lucide-react';

const features = [
  { icon: Search, title: 'Multi-Platform Monitoring', desc: 'Track mentions across Reddit, Twitter/X, YouTube, and the web — all in one dashboard.' },
  { icon: Brain, title: 'AI Relevance Scoring', desc: 'Not just keyword matching. Our AI scores how relevant each mention is to YOUR brand (0-100).' },
  { icon: Target, title: 'Buying Intent Detection', desc: 'Automatically flag mentions where someone is looking to buy, switch, or try a product like yours.' },
  { icon: Bell, title: 'Slack & Email Alerts', desc: 'Get real-time Slack alerts for high-priority mentions. Daily/weekly email digests for everything else.' },
  { icon: BarChart3, title: 'Sentiment Trends', desc: 'Track how people feel about your brand over time. Spot crises early, celebrate wins.' },
  { icon: MessageSquare, title: 'Competitor Tracking', desc: 'Monitor competitor mentions. Swoop in when someone complains about them.' },
];

const plans = [
  { name: 'Free', price: '$0', period: '/forever', keywords: 3, mentions: '500', features: ['3 keywords', '500 mentions/mo', 'Weekly email digest', 'Basic dashboard'], cta: 'Start Free', popular: false },
  { name: 'Starter', price: '$29', period: '/month', keywords: 10, mentions: '10,000', features: ['10 keywords', '10K mentions/mo', 'Slack + email alerts', 'AI relevance scoring', 'Buying intent detection', 'Sentiment analysis'], cta: 'Start 7-Day Trial', popular: true },
  { name: 'Growth', price: '$59', period: '/month', keywords: 20, mentions: '25,000', features: ['20 keywords', '25K mentions/mo', 'Everything in Starter', 'Competitor tracking', 'Priority support', 'API access'], cta: 'Start 7-Day Trial', popular: false },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold">Aggrestat</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#pricing" className="text-sm text-slate-600 hover:text-slate-900">Pricing</Link>
            <Link href="/dashboard">
              <Button variant="outline" size="sm">Log in</Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-violet-600 hover:bg-violet-700">Start Free →</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-violet-100 text-violet-700 px-3 py-1">
            Brand24 costs $149/mo. We&apos;re $29.
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
            Know what your market is saying.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
              Without the enterprise price tag.
            </span>
          </h1>
          <p className="text-xl text-slate-500 mt-6 max-w-2xl mx-auto">
            Monitor Reddit, Twitter, YouTube & web mentions with AI-powered relevance scoring.
            Stop missing conversations that matter to your business.
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/dashboard">
              <Button size="lg" className="bg-violet-600 hover:bg-violet-700 text-lg px-8 h-12">
                Start Monitoring Free <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-lg px-8 h-12">
                See Live Demo
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-400 mt-4">No credit card required • 3 free keywords forever</p>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-8 border-y border-slate-100 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-8 items-center text-sm text-slate-400">
          <span>Trusted by <strong className="text-slate-600">200+</strong> indie founders</span>
          <span>•</span>
          <span><strong className="text-slate-600">50K+</strong> mentions analyzed</span>
          <span>•</span>
          <span><strong className="text-slate-600">4.9/5</strong> on Product Hunt</span>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Everything you need to listen smarter</h2>
            <p className="text-slate-500 mt-2">Not just keyword alerts — intelligent social monitoring built for bootstrappers</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <Card key={f.title} className="border-slate-200 hover:border-violet-200 hover:shadow-md transition-all">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center mb-4">
                    <f.icon className="w-6 h-6 text-violet-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-lg">{f.title}</h3>
                  <p className="text-slate-500 mt-2 text-sm">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Simple, honest pricing</h2>
            <p className="text-slate-500 mt-2">Start free. Upgrade when you need more.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? 'border-violet-500 border-2 shadow-lg' : 'border-slate-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-violet-600 text-white px-3">Most Popular</Badge>
                  </div>
                )}
                <CardContent className="p-6 pt-8">
                  <h3 className="text-lg font-semibold text-slate-900">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                    <span className="text-slate-500 ml-1">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-6 ${plan.popular ? 'bg-violet-600 hover:bg-violet-700' : ''}`} variant={plan.popular ? 'default' : 'outline'}>
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900">Stop missing conversations about your brand</h2>
          <p className="text-slate-500 mt-4 text-lg">Right now, someone on Reddit might be asking for exactly what you sell. Would you know?</p>
          <Link href="/dashboard">
            <Button size="lg" className="mt-8 bg-violet-600 hover:bg-violet-700 text-lg px-8 h-12">
              Start Monitoring Free <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-slate-700">Aggrestat</span>
          </div>
          <p className="text-sm text-slate-400">© 2026 Aggrestat. Social listening for bootstrappers.</p>
        </div>
      </footer>
    </div>
  );
}
