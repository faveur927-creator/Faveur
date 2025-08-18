import { Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="p-2 bg-primary rounded-lg shadow-md">
        <Rocket className="w-6 h-6 text-primary-foreground" />
      </div>
      <span className="text-2xl font-bold font-headline text-foreground">SuperApp</span>
    </div>
  );
}
