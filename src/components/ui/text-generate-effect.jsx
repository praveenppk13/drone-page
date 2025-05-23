import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";
import { cn } from "/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
  delay = 0,
}) => {
  const [scope, animate] = useAnimate();
  let wordsArray = words.split(" ");
  
  useEffect(() => {
    animate("span", {
      opacity: 1,
      filter: filter ? "blur(0px)" : "none",
      y: 0,
    }, {
      duration: duration,
      delay: stagger(0.15, { startDelay: delay }),
      ease: [0.25, 0.1, 0.25, 1],
    });
  }, [scope, animate, duration, filter, delay]);

  const renderWords = () => {
    return (
      <motion.div ref={scope}>
        {wordsArray.map((word, idx) => (
          <motion.span
            key={word + idx}
            className="opacity-0"
            style={{
              filter: filter ? "blur(10px)" : "none",
              y: 20,
            }}
          >
            {word}{" "}
          </motion.span>
        ))}
      </motion.div>
    );
  };

  return (
    <div className={cn(className)}>
      {renderWords()}
    </div>
  );
};