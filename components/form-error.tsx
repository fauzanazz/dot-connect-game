import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface FormErrorProps {
    message?: string;
};

export const FormError = ({ message }: FormErrorProps) => {
    if (!message) return null;
    return (
        <div className="p-3 rounded-md flex items-center text-sm text-destructive gap-x-2 bg-destructive/15">
            <ExclamationTriangleIcon className='h-4 w-4'/>
            <span>{message}</span>
        </div>
    );
};