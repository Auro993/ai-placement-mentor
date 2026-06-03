import { motion } from 'framer-motion';
import type { ElementType } from 'react';  // ✅ Use React's ElementType instead

interface FeatureCardProps {
  icon: ElementType;  // ✅ This works perfectly
  title: string;
  description: string;
}

export default function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <motion.div whileHover={{ y: -8 }} className="glass-card p-6 hover:border-cyan-500/50 transition-all cursor-pointer">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center mb-4">
        <Icon className="text-cyan-400 text-2xl" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-white/60">{description}</p>
    </motion.div>
  );
}