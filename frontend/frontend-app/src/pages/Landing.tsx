import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMessageSquare, 
  FiUpload, 
  FiMic, 
  FiStar, 
  FiUsers,
  FiBookOpen,
  FiAward,
  FiClock,
  FiTrendingUp,
  FiTarget,
  FiBriefcase,
  FiCheckCircle
} from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import logo from '/logo.png';

// Scroll Animation Hook
const useScrollAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isVisible };
};

// Fade In Up Component
const FadeInUp = ({ children, delay = 0, className = '' }: { children: React.ReactNode, delay?: number, className?: string }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay: delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Children Component
const StaggerContainer = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Stagger Item Component
const StaggerItem = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.6, ease: "easeOut" }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function Landing() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-[#0A0A0F] flex flex-col items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative"
            >
              <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-2xl animate-pulse"></div>
              <img 
                src={logo} 
                alt="JobGenie Logo" 
                className="relative w-24 h-24 rounded-2xl object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-6 text-center"
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                JobGenie
              </h1>
              <p className="text-sm text-white/40 mt-1 tracking-wider">AI PLACEMENT MENTOR</p>
            </motion.div>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 200 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="mt-8 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex gap-2 mt-4"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ 
                    duration: 0.6, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                  className="w-2 h-2 rounded-full bg-cyan-400"
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="min-h-screen bg-[#0A0A0F] overflow-x-hidden"
      >
        {/* Navbar */}
        <motion.nav 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5, type: "spring", stiffness: 100 }}
          className="glass-card mx-6 mt-6 px-8 py-0 flex flex-wrap justify-between items-center sticky top-4 z-40 backdrop-blur-xl"
        >
          <Link to="/" className="flex items-center gap-0">
            <motion.img 
              whileHover={{ rotate: -8, scale: 1.08 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              src={logo} 
              alt="JobGenie Logo" 
              className="w-20 h-20 rounded-xl object-cover"
            />
            <div>
              <motion.span 
                whileHover={{ scale: 1.02 }}
                className="font-bold text-3xl bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
              >
                JobGenie
              </motion.span>
              <p className="text-xs text-white/40 -mt-0.5 tracking-wider">AI PLACEMENT MENTOR</p>
            </div>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            {['Features', 'How It Works', 'Success Stories', 'Pricing'].map((item, index) => (
              <motion.a
                key={index}
                href={`#${item.toLowerCase().replace(/\s/g, '-')}`}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-white/70 hover:text-cyan-400 transition-colors text-sm cursor-pointer relative group"
              >
                {item}
                <motion.span 
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                  className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                />
              </motion.a>
            ))}
          </div>
          
          <div className="flex gap-3">
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Start Free</Link>
            </motion.div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-6 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, type: "spring", stiffness: 80 }}
            className="text-center"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.9, type: "spring", stiffness: 200 }}
              className="inline-block px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm mb-6"
            >
              🧞 Your AI-Powered Placement Assistant
            </motion.div>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.1, type: "spring", stiffness: 100 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Ace Your <span className="gradient-text">Placements</span> with AI
            </motion.h1>
            
            <motion.p 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.3 }}
              className="text-xl text-white/60 max-w-2xl mx-auto mb-12"
            >
              AI-powered resume optimization, mock interviews, personalized roadmaps, and 24/7 career guidance - all in one platform.
            </motion.p>
            
            <motion.div 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.5 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <motion.div whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn-primary shadow-lg shadow-cyan-500/30">Start Free Trial</Link>
              </motion.div>
              <motion.button 
                whileHover={{ scale: 1.08, y: -3 }} 
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                Watch Demo
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <StaggerContainer className="grid md:grid-cols-4 gap-6 mt-20">
            {[
              { icon: FiUsers, number: "10,000+", label: "Students Placed", color: "text-cyan-400" },
              { icon: FiBriefcase, number: "500+", label: "Partner Companies", color: "text-purple-400" },
              { icon: FiAward, number: "85%", label: "Success Rate", color: "text-pink-400" },
              { icon: FiStar, number: "4.9", label: "User Rating", color: "text-yellow-400" },
            ].map((stat, index) => (
              <StaggerItem key={index}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.03 }}
                  className="glass-card p-6 text-center cursor-pointer"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className={`text-3xl ${stat.color} mx-auto mb-3`} />
                  </motion.div>
                  <motion.p 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-2xl font-bold"
                  >
                    {stat.number}
                  </motion.p>
                  <p className="text-white/40 text-sm">{stat.label}</p>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* AI Features Section */}
          <FadeInUp className="mt-24" delay={0.3}>
            <div id="features">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered <span className="gradient-text">Placement Tools</span></h2>
                <p className="text-white/60 max-w-2xl mx-auto">Everything you need to crack your dream job</p>
              </div>
              
              <StaggerContainer className="grid md:grid-cols-3 gap-6">
                {[
                  { path: "/chat", icon: FiMessageSquare, title: "AI Chat Mentor", desc: "24/7 personalized career advice and placement strategies. Ask anything about your career!" },
                  { path: "/resume", icon: FiUpload, title: "Resume AI Analyzer", desc: "ATS-optimized resume review with smart suggestions to improve your chances." },
                  { path: "/interview", icon: FiMic, title: "AI Mock Interview", desc: "Practice with real interview questions and get instant AI feedback." },
                ].map((feature, index) => (
                  <StaggerItem key={index}>
                    <motion.div whileHover={{ y: -10, scale: 1.02 }}>
                      <Link to={feature.path} className="glass-card p-8 hover:border-cyan-500/50 transition-all text-center group block">
                        <motion.div 
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                        >
                          <feature.icon className="text-3xl text-cyan-400" />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                        <p className="text-white/60">{feature.desc}</p>
                      </Link>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeInUp>

          {/* How It Works Section */}
          <FadeInUp className="mt-24" delay={0.4}>
            <div id="how-it-works">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How <span className="gradient-text">JobGenie</span> Works</h2>
                <p className="text-white/60 max-w-2xl mx-auto">Your journey to placement success in 4 simple steps</p>
              </div>
              
              <StaggerContainer className="grid md:grid-cols-4 gap-6">
                {[
                  { step: "1", icon: FiTarget, title: "Set Your Goal", desc: "Tell us your dream role and target companies" },
                  { step: "2", icon: FiUpload, title: "Upload Resume", desc: "AI analyzes and suggests improvements" },
                  { step: "3", icon: FiBookOpen, title: "Practice", desc: "Mock interviews and skill assessments" },
                  { step: "4", icon: FiCheckCircle, title: "Get Placed", desc: "Crack interviews with confidence" },
                ].map((item, i) => (
                  <StaggerItem key={i}>
                    <motion.div whileHover={{ y: -8 }} className="glass-card p-6 text-center cursor-pointer">
                      <motion.div 
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl"
                      >
                        {item.step}
                      </motion.div>
                      <item.icon className="text-2xl text-cyan-400 mx-auto mb-3" />
                      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                      <p className="text-white/40 text-sm">{item.desc}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeInUp>

          {/* Benefits Section */}
          <FadeInUp className="mt-24" delay={0.5}>
            <div>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="gradient-text">JobGenie</span></h2>
                <p className="text-white/60 max-w-2xl mx-auto">We're different from other platforms</p>
              </div>
              
              <StaggerContainer className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: FiTrendingUp, title: "Personalized Learning", desc: "AI adapts to your skill level and learning pace", color: "bg-cyan-500/10", iconColor: "text-cyan-400" },
                  { icon: FiStar, title: "Industry Experts", desc: "Content designed with input from top recruiters", color: "bg-purple-500/10", iconColor: "text-purple-400" },
                  { icon: FiClock, title: "24/7 Availability", desc: "Practice anytime, anywhere with AI mentor", color: "bg-pink-500/10", iconColor: "text-pink-400" },
                ].map((benefit, index) => (
                  <StaggerItem key={index}>
                    <motion.div whileHover={{ y: -8, scale: 1.02 }} className="glass-card p-6 text-center cursor-pointer">
                      <motion.div 
                        whileHover={{ rotate: 15 }}
                        className={`w-14 h-14 rounded-xl ${benefit.color} flex items-center justify-center mx-auto mb-3`}
                      >
                        <benefit.icon className={`text-3xl ${benefit.iconColor}`} />
                      </motion.div>
                      <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                      <p className="text-white/40 text-sm">{benefit.desc}</p>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeInUp>

          {/* Testimonials Section */}
          <FadeInUp className="mt-24" delay={0.6}>
            <div id="testimonials">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Success <span className="gradient-text">Stories</span></h2>
                <p className="text-white/60 max-w-2xl mx-auto">Join 10,000+ students who cracked their dream jobs</p>
              </div>
              
              <StaggerContainer className="grid md:grid-cols-3 gap-6">
                {[
                  { name: "Rahul Sharma", company: "Google", role: "Software Engineer", quote: "JobGenie's mock interviews helped me crack Google!", image: "R" },
                  { name: "Priya Patel", company: "Microsoft", role: "Product Manager", quote: "The AI resume review was a game-changer for me.", image: "P" },
                  { name: "Amit Kumar", company: "Amazon", role: "SDE", quote: "24/7 AI mentor answered all my placement doubts.", image: "A" },
                ].map((testimonial, i) => (
                  <StaggerItem key={i}>
                    <motion.div whileHover={{ y: -8 }} className="glass-card p-6 cursor-pointer">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl"
                        >
                          {testimonial.image}
                        </motion.div>
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-white/40 text-sm">{testimonial.role} at {testimonial.company}</p>
                        </div>
                      </div>
                      <p className="text-white/70 italic">"{testimonial.quote}"</p>
                      <div className="flex mt-3">
                        {[...Array(5)].map((_, j) => (
                          <motion.div
                            key={j}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: j * 0.1 }}
                          >
                            <FiStar className="text-yellow-500 text-sm fill-yellow-500" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeInUp>

          {/* Pricing Section */}
          <FadeInUp className="mt-24" delay={0.7}>
            <div id="pricing">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, <span className="gradient-text">Transparent Pricing</span></h2>
                <p className="text-white/60 max-w-2xl mx-auto">Choose the plan that works for you</p>
              </div>
              
              <StaggerContainer className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                {[
                  { title: "Basic", price: "Free", features: ["✓ Basic AI Chat", "✓ 1 Resume Upload", "✓ 3 Mock Interviews", "✓ Basic Support"], popular: false },
                  { title: "Pro", price: "₹999", period: "/month", features: ["✓ Unlimited AI Chat", "✓ Unlimited Resume Upload", "✓ Unlimited Mock Interviews", "✓ Priority Support", "✓ Resume Analysis"], popular: true },
                  { title: "Enterprise", price: "Custom", features: ["✓ Everything in Pro", "✓ Team Dashboard", "✓ API Access", "✓ Dedicated Support", "✓ Custom Solutions"], popular: false },
                ].map((plan, index) => (
                  <StaggerItem key={index}>
                    <motion.div 
                      whileHover={{ y: -10, scale: 1.02 }}
                      className={`glass-card p-6 text-center ${plan.popular ? 'border-2 border-cyan-500 relative' : ''}`}
                    >
                      {plan.popular && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                          className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 rounded-full text-xs text-white font-medium"
                        >
                          Most Popular
                        </motion.div>
                      )}
                      <h3 className="text-xl font-bold mb-2">{plan.title}</h3>
                      <motion.p 
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.05 }}
                        className="text-3xl font-bold mb-4"
                      >
                        {plan.price}<span className="text-sm text-white/40">{plan.period || ''}</span>
                      </motion.p>
                      <ul className="space-y-2 text-white/60 text-sm mb-6">
                        {plan.features.map((feature, i) => (
                          <motion.li 
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                          >
                            {feature}
                          </motion.li>
                        ))}
                      </ul>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link to="/register" className={`${plan.popular ? 'btn-primary' : 'btn-secondary'} py-2 px-4 w-full inline-block`}>
                          {plan.popular ? 'Start Pro Trial' : 'Get Started'}
                        </Link>
                      </motion.div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeInUp>

          {/* CTA Section */}
          <FadeInUp className="mt-24" delay={0.8}>
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className="glass-card p-12 text-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10"
            >
              <motion.h2 
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Ready to Ace Your Placements?
              </motion.h2>
              <p className="text-white/60 max-w-2xl mx-auto mb-8">
                Join thousands of students who transformed their placement journey with JobGenie
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <motion.div whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/register" className="btn-primary shadow-lg shadow-cyan-500/30">Start Free Trial</Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/login" className="btn-secondary">Sign In</Link>
                </motion.div>
              </div>
            </motion.div>
          </FadeInUp>

          {/* Footer */}
          <motion.footer 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mt-24 pt-12 border-t border-white/10"
          >
            <div className="grid md:grid-cols-4 gap-8">
              <motion.div whileHover={{ y: -3 }}>
                <Link to="/" className="flex items-center gap-3 mb-4">
                  <img src={logo} alt="JobGenie Logo" className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <span className="font-semibold text-lg bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                      JobGenie
                    </span>
                    <p className="text-[8px] text-white/40 -mt-0.5">AI PLACEMENT MENTOR</p>
                  </div>
                </Link>
                <p className="text-white/40 text-sm">Your AI-powered placement assistant for landing dream jobs.</p>
              </motion.div>
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2 text-white/40 text-sm">
                  {['AI Chat Mentor', 'Resume Analyzer', 'Mock Interview'].map((item, index) => (
                    <motion.li 
                      key={index}
                      whileHover={{ x: 5 }}
                    >
                      <Link to={`/${item.toLowerCase().replace(/\s/g, '-')}`} className="hover:text-cyan-400 transition-colors">
                        {item}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-white/40 text-sm">
                  {['About Us', 'Contact', 'Privacy Policy'].map((item, index) => (
                    <motion.li 
                      key={index}
                      whileHover={{ x: 5 }}
                    >
                      <a href="#" className="hover:text-cyan-400 transition-colors">{item}</a>
                    </motion.li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Support</h4>
                <ul className="space-y-2 text-white/40 text-sm">
                  {['Help Center', 'FAQs', 'Contact Support'].map((item, index) => (
                    <motion.li 
                      key={index}
                      whileHover={{ x: 5 }}
                    >
                      <a href="#" className="hover:text-cyan-400 transition-colors">{item}</a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8 }}
              className="text-center text-white/40 text-sm py-8 border-t border-white/5 mt-8"
            >
              © 2025 JobGenie. All rights reserved. 🧞 Your AI Placement Assistant
            </motion.div>
          </motion.footer>
        </main>
      </motion.div>
    </>
  );
}