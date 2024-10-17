"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "./motion";

const SectionWrapper = (Component: any, idName: any) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer(0.5, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        animate="show"
      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>

        <motion.div
          whileInView={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, type: "tween" }}
        >
          <Component />
        </motion.div>
      </motion.section>
    );
  };

export default SectionWrapper;
