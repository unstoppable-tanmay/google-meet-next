import { ReactNode, useEffect, useRef } from 'react';

interface Props {
  onOutsideClick: (e:MouseEvent) => void;
  children:ReactNode
  className?: string
}

const OutsideClickDetector: React.FC<Props> = ({ onOutsideClick, children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onOutsideClick(event);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [onOutsideClick]);

  return <div className={className} ref={containerRef}>{children}</div>;
};

export default OutsideClickDetector;
