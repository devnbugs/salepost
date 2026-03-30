import { Button } from '@/components/ui/button';
import { Moon, SunMedium } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() =>
                setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
            }
        >
            {resolvedTheme === 'dark' ? (
                <SunMedium className="h-4 w-4" />
            ) : (
                <Moon className="h-4 w-4" />
            )}
        </Button>
    );
}
