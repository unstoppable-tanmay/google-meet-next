/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  emoji: string;
  name: string;
  left: string;
  inverval: number;
}

const randomIntFromInterval = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generateRandomString = () =>
  (Math.random() + 1).toString(36).substring(7);

let addNotification: (emoji: string, name: string) => void;

const EmojiFy = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    addNotification = (emoji, name) => {
      const id = generateRandomString();
      const inverval = randomIntFromInterval(1700, 2000);
      const left = randomIntFromInterval(0, 100);
      setNotifications((prev) => [
        ...prev,
        { id, emoji, left: `${left}%`, name, inverval: inverval / 1000 },
      ]);
      setTimeout(
        () => setNotifications((prev) => prev.filter((n) => n.id !== id)),
        inverval
      );
    };
  }, []);

  return (
    <div className="absolute w-[clamp(100px,250px,15%)] h-[70%] left-[10px] pointer-events-none">
      <div className="wrapper bg-red-400 -z-10 w-full h-full relative">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: 1, y: "-75vh" }}
              exit={{ opacity: 0 }}
              transition={{ duration: notification.inverval }}
              className="absolute flex items-center justify-center flex-col gap-1.5"
              style={{ left: notification.left }}
            >
              <img
                className="w-7 aspect-square hover:scale-125 duration-200 cursor-pointer"
                src={`/emojies/${notification.emoji}.png`}
                alt=""
              />
              <span className="px-1.5 py-0.5 rounded-full bg-white/10 text-xs">
                {notification.name}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Export the addNotification function
export const emojify = (emoji: string, name: string) => {
  addNotification(emoji, name);
};

export default EmojiFy;
