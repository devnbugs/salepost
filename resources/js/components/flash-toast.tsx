import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function FlashToast() {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }

        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.error, flash?.success]);

    return null;
}
