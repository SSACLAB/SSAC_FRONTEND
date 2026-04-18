import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

function Card({ className, children }: CardProps) {
  return (
    <div className={cn('rounded-lg border border-gray-200 bg-white shadow-sm', className)}>
      {children}
    </div>
  );
}

function CardHeader({ className, children }: CardProps) {
  return <div className={cn('border-b border-gray-100 px-6 py-4', className)}>{children}</div>;
}

function CardBody({ className, children }: CardProps) {
  return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

function CardFooter({ className, children }: CardProps) {
  return (
    <div className={cn('border-t border-gray-100 px-6 py-4', className)}>{children}</div>
  );
}

export { Card, CardHeader, CardBody, CardFooter };
