import Head from "next/head";
import { useIntl } from 'react-intl';
import { Footer } from '@/components/sections/Footer';
import { TopMenu } from "@/components/sections/TopMenu";
import { Button } from "@/components/ui/Button";
import { MeshGradient1 } from "@/components/effects/MeshGradient.1";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FlaskConical, Bug, Sparkles, Zap } from "lucide-react";
import { Onest } from 'next/font/google';
import { cn } from "@/lib/utils";
import { DAMUS_APP_STORE_URL, DAMUS_TESTFLIGHT_URL } from "@/lib/constants";

const onest = Onest({ subsets: ['latin'] });

function BoldText({ children }: { children: string }) {
  return (
    <>
      {children.split(/\*\*(.*?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? <strong key={i} className="text-white font-semibold">{part}</strong> : part
      )}
    </>
  );
}

export function TestflightPage() {
  const intl = useIntl();

  const benefits = [
    {
      icon: <Sparkles className="h-10 w-10 text-white opacity-80" />,
      headline: intl.formatMessage({ id: "testflight.benefit1.name", defaultMessage: "Early Access" }),
      description: intl.formatMessage({ id: "testflight.benefit1.description", defaultMessage: "Be the first to try new features before they ship to the App Store. Get a sneak peek at what's coming to Damus." }),
    },
    {
      icon: <Bug className="h-10 w-10 text-white opacity-80" />,
      headline: intl.formatMessage({ id: "testflight.benefit2.name", defaultMessage: "Shape the App" }),
      description: intl.formatMessage({ id: "testflight.benefit2.description", defaultMessage: "Report bugs and give feedback directly to the Damus team. Your input helps us build the best free-speech social network." }),
    },
    {
      icon: <Zap className="h-10 w-10 text-white opacity-80" />,
      headline: intl.formatMessage({ id: "testflight.benefit3.name", defaultMessage: "Free & Open Source" }),
      description: intl.formatMessage({ id: "testflight.benefit3.description", defaultMessage: "Damus is free to use and open source. The TestFlight beta is open to everyone — no invite required." }),
    },
  ];

  const steps = [
    intl.formatMessage({ id: "testflight.how_to.step1", defaultMessage: "Install the **TestFlight** app from the App Store on your iPhone or iPad." }),
    intl.formatMessage({ id: "testflight.how_to.step2", defaultMessage: 'Tap the **"Join the Beta"** button on this page (or open the link on your iOS device).' }),
    intl.formatMessage({ id: "testflight.how_to.step3", defaultMessage: "Follow the prompts in TestFlight to install the **Damus beta**." }),
    intl.formatMessage({ id: "testflight.how_to.step4", defaultMessage: "Enjoy early access and feel free to **share your feedback** with us!" }),
  ];

  return (<>
    <Head>
      <title>Damus TestFlight Beta</title>
      <meta name="description" content={intl.formatMessage({ id: "testflight.meta_description", defaultMessage: "Join the Damus iOS TestFlight beta and get early access to new features before they ship to the App Store." })} />
    </Head>
    <main style={{ scrollBehavior: "smooth" }}>
      {/* Hero */}
      <div className="bg-black overflow-hidden relative min-h-screen">
        <div className="absolute z-0 pointer-events-none">
          <MeshGradient1 className="-translate-x-1/3" />
        </div>
        <TopMenu
          className="w-full"
          customCTA={
            <Link href={DAMUS_TESTFLIGHT_URL} target="_blank">
              <Button variant="accent" className="hidden lg:flex gap-x-2">
                <FlaskConical className="w-4 h-4" />
                {intl.formatMessage({ id: "testflight.hero.join_button", defaultMessage: "Join Beta" })}
              </Button>
            </Link>
          }
        />
        <div className="container mx-auto px-6 pb-32 pt-12 z-10 relative">
          <div className="flex flex-col lg:flex-row items-center justify-center mt-32 lg:mt-24 gap-12">
            {/* Text */}
            <div className="w-full z-20">
              <motion.p
                className={cn("text-lg md:text-2xl uppercase text-white/80 mb-8 tracking-widest", onest.className)}
                style={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3, duration: 1 } }}
              >
                {intl.formatMessage({ id: "testflight.hero.eyebrow", defaultMessage: "Beta Program" })}
              </motion.p>
              <div className="flex gap-x-4 items-center mb-6">
                <Image
                  src="/logo_icon.png"
                  alt="Damus logo"
                  width={80}
                  height={80}
                  className="rounded-lg md:rounded-xl lg:rounded-2xl w-12 md:w-16 lg:w-20 aspect-square"
                />
                <motion.h1
                  className={cn("text-4xl sm:text-5xl md:text-7xl text-transparent bg-clip-text font-semibold max-w-4xl tracking-wide leading-tight", onest.className)}
                  style={{
                    backgroundImage: "linear-gradient(to right, #ffffff -100%, #ffffff -80%, #2D175B 100%)",
                    opacity: 0,
                  }}
                  animate={{
                    backgroundImage: "linear-gradient(to right, #ffffff 0%, #ffffff 70%, #2D175B 130%)",
                    transition: { duration: 3 },
                    opacity: 1,
                  }}
                >
                  TestFlight
                </motion.h1>
              </div>
              <motion.h2
                className="text-white/80 text-lg md:text-xl max-w-xl mb-10"
                style={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.8, duration: 1 } }}
              >
                {intl.formatMessage({ id: "testflight.hero.subheadline", defaultMessage: "Try the latest Damus iOS features before anyone else. Join our public TestFlight beta and help shape the future of free-speech social media." })}
              </motion.h2>
              <motion.div
                className="flex flex-col md:flex-row gap-4"
                style={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 1.2, duration: 1 } }}
              >
                <Link href={DAMUS_TESTFLIGHT_URL} target="_blank" className="w-full md:w-auto">
                  <Button variant="accent" className="w-full flex gap-x-2 text-lg font-semibold px-6 py-3 h-auto">
                    <FlaskConical className="w-5 h-5" />
                    {intl.formatMessage({ id: "testflight.hero.cta_primary", defaultMessage: "Join the Beta" })}
                  </Button>
                </Link>
                <Link href={DAMUS_APP_STORE_URL} target="_blank" className="w-full md:w-auto">
                  <Button variant="default" className="w-full flex gap-x-2 text-lg px-6 py-3 h-auto">
                    {intl.formatMessage({ id: "testflight.hero.cta_secondary", defaultMessage: "Get Damus on the App Store" })}
                    <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* App Icon */}
            <motion.div
              className="flex-shrink-0 flex items-center justify-center"
              style={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.8, duration: 1 } }}
            >
              <div
                className="relative w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl"
                style={{ boxShadow: "0 0 60px 10px rgba(180,80,140,0.25)" }}
              >
                <Image
                  src="/logo_icon.png"
                  fill
                  className="object-cover"
                  sizes="256px"
                  alt="Damus app icon"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="bg-black overflow-hidden relative">
        <div className="container mx-auto px-6 py-24">
          <motion.h2
            className={cn("text-3xl md:text-5xl text-center text-transparent bg-clip-text font-semibold mb-16", onest.className)}
            style={{
              backgroundImage: "linear-gradient(to right, #ffffff 0%, #ffffff 60%, #2D175B 120%)",
            }}
          >
            {intl.formatMessage({ id: "testflight.benefits.headline", defaultMessage: "Why join the beta?" })}
          </motion.h2>
          <div className="flex flex-wrap gap-x-8 gap-y-12 items-start justify-center">
            {benefits.map((benefit, index) => (
              <div key={index} className="w-72 flex flex-col items-start justify-start">
                <div className="mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{benefit.headline}</h3>
                <p className="text-white/70 text-base leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How to join */}
      <div className="bg-black overflow-hidden relative">
        <div className="container mx-auto px-6 py-24 max-w-2xl">
          <motion.h2
            className={cn("text-3xl md:text-5xl text-center text-transparent bg-clip-text font-semibold mb-12", onest.className)}
            style={{
              backgroundImage: "linear-gradient(to right, #ffffff 0%, #ffffff 60%, #2D175B 120%)",
            }}
          >
            {intl.formatMessage({ id: "testflight.how_to.headline", defaultMessage: "How to join" })}
          </motion.h2>
          <ol className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-5 items-start">
                <span className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-damuspink-500 to-damuspink-600 flex items-center justify-center text-white font-bold text-lg">
                  {i + 1}
                </span>
                <span className="text-white/80 text-lg leading-relaxed pt-1">
                  <BoldText>{step}</BoldText>
                </span>
              </li>
            ))}
          </ol>
          <div className="flex justify-center mt-16">
            <Link href={DAMUS_TESTFLIGHT_URL} target="_blank">
              <Button variant="accent" className="flex gap-x-2 text-lg font-semibold px-8 py-3 h-auto">
                <FlaskConical className="w-5 h-5" />
                {intl.formatMessage({ id: "testflight.hero.cta_primary", defaultMessage: "Join the Beta" })}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  </>);
}
