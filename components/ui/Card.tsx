import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  navy?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ navy, className = '', children, ...rest }, ref) => {
  return (
    <div
      ref={ref}
      className={[
        'rounded-card p-[18px] mb-4 animate-fadeUp',
        navy
          ? 'bg-gradient-to-br from-navy to-navy-mid text-white border-0'
          : 'bg-white border border-line shadow-card',
        className
      ].join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';

export default Card;
