import { CheckCircledIcon } from '@radix-ui/react-icons';

interface FormSuccessProps {
    message?: string;
};

export const FormSuccess = ({ message }: FormSuccessProps) => {
    if (!message) return null;
    return (
        <div className="p-3 rounded-md flex items-center text-sm text-emerald-500 gap-x-2 bg-emerald-500/15">
            <CheckCircledIcon className='h-4 w-4'/>
            <span>{message}</span>
        </div>
    );
};