import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiMessageSquare, 
  FiUpload, 
  FiMic, 
  FiStar, 
  FiUsers,
  FiBookOpen,
  FiEdit3,
  FiArrowRight,
  FiCalendar,
  FiAward,
  FiClock,
  FiTrendingUp,
  FiTarget,
  FiBriefcase,
  FiCheckCircle
} from 'react-icons/fi';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Navbar */}
      <nav className="glass-card mx-6 mt-6 px-6 py-4 flex flex-wrap justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-xl">🧞</span>
          </div>
          <span className="font-semibold text-xl">JobGenie</span>
        </div>
        
        <div className="hidden md:flex items-center gap-6">
          <a href="#features" className="text-white/70 hover:text-cyan-400 transition-colors">Features</a>
          <a href="#how-it-works" className="text-white/70 hover:text-cyan-400 transition-colors">How It Works</a>
          <a href="#testimonials" className="text-white/70 hover:text-cyan-400 transition-colors">Success Stories</a>
          <a href="#pricing" className="text-white/70 hover:text-cyan-400 transition-colors">Pricing</a>
        </div>
        
        <div className="flex gap-3">
          <Link to="/login" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
          <Link to="/register" className="btn-primary text-sm py-2 px-4">Start Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm mb-6">
            🧞 Your AI-Powered Placement Assistant
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            Ace Your <span className="gradient-text">Placements</span> with AI
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto mb-12">
            AI-powered resume optimization, mock interviews, personalized roadmaps, and 24/7 career guidance - all in one platform.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-primary">Start Free Trial</Link>
            <Link to="/login" className="btn-secondary">Watch Demo</Link>
          </div>
        </motion.div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-20">
          <div className="glass-card p-6 text-center">
            <FiUsers className="text-3xl text-cyan-400 mx-auto mb-3" />
            <p className="text-2xl font-bold">10,000+</p>
            <p className="text-white/40 text-sm">Students Placed</p>
          </div>
          <div className="glass-card p-6 text-center">
            <FiBriefcase className="text-3xl text-cyan-400 mx-auto mb-3" />
            <p className="text-2xl font-bold">500+</p>
            <p className="text-white/40 text-sm">Partner Companies</p>
          </div>
          <div className="glass-card p-6 text-center">
            <FiAward className="text-3xl text-cyan-400 mx-auto mb-3" />
            <p className="text-2xl font-bold">85%</p>
            <p className="text-white/40 text-sm">Success Rate</p>
          </div>
          <div className="glass-card p-6 text-center">
            <FiStar className="text-3xl text-cyan-400 mx-auto mb-3" />
            <p className="text-2xl font-bold">4.9</p>
            <p className="text-white/40 text-sm">User Rating</p>
          </div>
        </div>

        {/* AI Features Section */}
        <div id="features" className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">AI-Powered <span className="gradient-text">Placement Tools</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto">Everything you need to crack your dream job</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/chat" className="glass-card p-8 hover:border-cyan-500/50 transition-all text-center group">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <FiMessageSquare className="text-3xl text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Chat Mentor</h3>
              <p className="text-white/60">24/7 personalized career advice and placement strategies. Ask anything about your career!</p>
            </Link>
            
            <Link to="/resume" className="glass-card p-8 hover:border-cyan-500/50 transition-all text-center group">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <FiUpload className="text-3xl text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Resume AI Analyzer</h3>
              <p className="text-white/60">ATS-optimized resume review with smart suggestions to improve your chances.</p>
            </Link>
            
            <Link to="/interview" className="glass-card p-8 hover:border-cyan-500/50 transition-all text-center group">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <FiMic className="text-3xl text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Mock Interview</h3>
              <p className="text-white/60">Practice with real interview questions and get instant AI feedback.</p>
            </Link>
          </div>
        </div>

        {/* How It Works Section */}
        <div id="how-it-works" className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How <span className="gradient-text">JobGenie</span> Works</h2>
            <p className="text-white/60 max-w-2xl mx-auto">Your journey to placement success in 4 simple steps</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", icon: FiTarget, title: "Set Your Goal", desc: "Tell us your dream role and target companies" },
              { step: "2", icon: FiUpload, title: "Upload Resume", desc: "AI analyzes and suggests improvements" },
              { step: "3", icon: FiBookOpen, title: "Practice", desc: "Mock interviews and skill assessments" },
              { step: "4", icon: FiCheckCircle, title: "Get Placed", desc: "Crack interviews with confidence" },
            ].map((item, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {item.step}
                </div>
                <item.icon className="text-2xl text-cyan-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/40 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose <span className="gradient-text">JobGenie</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto">We're different from other platforms</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card p-6">
              <FiTrendingUp className="text-3xl text-cyan-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Personalized Learning</h3>
              <p className="text-white/40 text-sm">AI adapts to your skill level and learning pace</p>
            </div>
            <div className="glass-card p-6">
              <FiStar className="text-3xl text-cyan-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Industry Experts</h3>
              <p className="text-white/40 text-sm">Content designed with input from top recruiters</p>
            </div>
            <div className="glass-card p-6">
              <FiClock className="text-3xl text-cyan-400 mb-3" />
              <h3 className="font-semibold text-lg mb-2">24/7 Availability</h3>
              <p className="text-white/40 text-sm">Practice anytime, anywhere with AI mentor</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div id="testimonials" className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Success <span className="gradient-text">Stories</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto">Join 10,000+ students who cracked their dream jobs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Rahul Sharma", company: "Google", role: "Software Engineer", quote: "JobGenie's mock interviews helped me crack Google!", image: "R" },
              { name: "Priya Patel", company: "Microsoft", role: "Product Manager", quote: "The AI resume review was a game-changer for me.", image: "P" },
              { name: "Amit Kumar", company: "Amazon", role: "SDE", quote: "24/7 AI mentor answered all my placement doubts.", image: "A" },
            ].map((testimonial, i) => (
              <motion.div key={i} whileHover={{ y: -5 }} className="glass-card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 flex items-center justify-center text-cyan-400 font-bold text-xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h3 className="font-semibold">{testimonial.name}</h3>
                    <p className="text-white/40 text-sm">{testimonial.role} at {testimonial.company}</p>
                  </div>
                </div>
                <p className="text-white/70 italic">"{testimonial.quote}"</p>
                <div className="flex mt-3">
                  {[...Array(5)].map((_, j) => (
                    <FiStar key={j} className="text-yellow-500 text-sm fill-yellow-500" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Section */}
        <div id="pricing" className="mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, <span className="gradient-text">Transparent Pricing</span></h2>
            <p className="text-white/60 max-w-2xl mx-auto">Choose the plan that works for you</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-card p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Basic</h3>
              <p className="text-3xl font-bold mb-4">Free</p>
              <ul className="space-y-2 text-white/60 text-sm mb-6">
                <li>✓ Basic AI Chat</li>
                <li>✓ 1 Resume Upload</li>
                <li>✓ 3 Mock Interviews</li>
                <li>✓ Basic Support</li>
              </ul>
              <Link to="/register" className="btn-secondary py-2 px-4 w-full inline-block">Get Started</Link>
            </div>
            
            <div className="glass-card p-6 text-center border-2 border-cyan-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 rounded-full text-xs">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-3xl font-bold mb-4">₹999<span className="text-sm text-white/40">/month</span></p>
              <ul className="space-y-2 text-white/60 text-sm mb-6">
                <li>✓ Unlimited AI Chat</li>
                <li>✓ Unlimited Resume Upload</li>
                <li>✓ Unlimited Mock Interviews</li>
                <li>✓ Priority Support</li>
                <li>✓ Resume Analysis</li>
              </ul>
              <Link to="/register" className="btn-primary py-2 px-4 w-full inline-block">Start Pro Trial</Link>
            </div>
            
            <div className="glass-card p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <p className="text-3xl font-bold mb-4">Custom</p>
              <ul className="space-y-2 text-white/60 text-sm mb-6">
                <li>✓ Everything in Pro</li>
                <li>✓ Team Dashboard</li>
                <li>✓ API Access</li>
                <li>✓ Dedicated Support</li>
                <li>✓ Custom Solutions</li>
              </ul>
              <button className="btn-secondary py-2 px-4 w-full inline-block">Contact Us</button>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 glass-card p-12 text-center bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Ace Your Placements?</h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-8">
            Join thousands of students who transformed their placement journey with JobGenie
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register" className="btn-primary">Start Free Trial</Link>
            <Link to="/login" className="btn-secondary">Sign In</Link>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-24 pt-12 border-t border-white/10">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold">🧞</span>
                </div>
                <span className="font-semibold text-lg">JobGenie</span>
              </div>
              <p className="text-white/40 text-sm">Your AI-powered placement assistant for landing dream jobs.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-white/40 text-sm">
                <li><Link to="/chat" className="hover:text-cyan-400">AI Chat Mentor</Link></li>
                <li><Link to="/resume" className="hover:text-cyan-400">Resume Analyzer</Link></li>
                <li><Link to="/interview" className="hover:text-cyan-400">Mock Interview</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-white/40 text-sm">
                <li><a href="#" className="hover:text-cyan-400">About Us</a></li>
                <li><a href="#" className="hover:text-cyan-400">Contact</a></li>
                <li><a href="#" className="hover:text-cyan-400">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="space-y-2 text-white/40 text-sm">
                <li><a href="#" className="hover:text-cyan-400">Help Center</a></li>
                <li><a href="#" className="hover:text-cyan-400">FAQs</a></li>
                <li><a href="#" className="hover:text-cyan-400">Contact Support</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-white/40 text-sm py-8">
            © 2025 JobGenie. All rights reserved. 🧞 Your AI Placement Assistant
          </div>
        </footer>
      </main>
    </div>
  );
}