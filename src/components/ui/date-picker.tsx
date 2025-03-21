import { format, addDays, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface DatePickerProps {
    date: Date;
    onDateChange: (date: Date) => void;
    className?: string;
}

export function DatePicker({ date, onDateChange, className }: DatePickerProps) {
    // Función para navegar a días anteriores
    const goToPreviousDay = () => {
        onDateChange(subDays(date, 1));
    };

    // Función para navegar a días siguientes
    const goToNextDay = () => {
        onDateChange(addDays(date, 1));
    };

    // Función para ir a hoy
    const goToToday = () => {
        onDateChange(new Date());
    };

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousDay}
                className="px-2"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center px-3 py-1 border rounded-md bg-white">
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">
                    {format(date, "d 'de' MMMM, yyyy", { locale: es })}
                </span>
            </div>

            <Button
                variant="outline"
                size="sm"
                onClick={goToNextDay}
                className="px-2"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
                variant="ghost"
                size="sm"
                onClick={goToToday}
            >
                Hoy
            </Button>
        </div>
    );
}
