import { memo } from 'react';
import { DatePicker } from '@/components/ui/date-picker';

interface DateFilterProps {
    selectedDate: Date;
    onDateChange: (date: Date) => void;
}

const DateFilter = memo(({ selectedDate, onDateChange }: DateFilterProps) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Asistencia
            </label>
            <DatePicker
                date={selectedDate}
                onDateChange={onDateChange}
            />
        </div>
    );
});

DateFilter.displayName = "DateFilter";

export { DateFilter };
