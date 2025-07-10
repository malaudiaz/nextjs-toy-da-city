import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { useTranslations } from "next-intl";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  className?: string;
}

const ExpandableText = ({ 
  text, 
  maxLength = 200,
  className = '' 
}: ExpandableTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = useTranslations("expandableText");

  if (!text || text.length <= maxLength) {
    return <p className={`text-gray-700 ${className}`}>{text}</p>;
  }

  const toggleText = () => setIsExpanded(!isExpanded);

  return (
    <div className={`space-y-2 ${className}`}>
      <AnimatePresence>
        <motion.div
          key={isExpanded ? 'expanded' : 'collapsed'}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p className="text-gray-700">
            {isExpanded ? text : `${text.substring(0, maxLength)}...`}
          </p>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-end">
        <button
          onClick={toggleText}
          className="flex items-center justify-end text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              <span>{t('ShowLess')}</span>
              <ChevronUpIcon className="h-4 w-4 ml-1" />
            </>
          ) : (
            <>
              <span>{t('ShowMore')}</span>
              <ChevronDownIcon className="h-4 w-4 ml-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ExpandableText;