import {
    Pagination as ShadcnPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Link } from '@inertiajs/react';

interface Props {
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export default function Pagination({ links }: Props) {
    if (links.length <= 3) return null;

    return (
        <ShadcnPagination className="mt-6">
            <PaginationContent>
                {links.map((link, i) => {
                    const isFirst = i === 0;
                    const isLast = i === links.length - 1;
                    const isEllipsis = link.label === '...';

                    if (isEllipsis) {
                        return (
                            <PaginationItem key={i}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    const Comp = isFirst
                        ? PaginationPrevious
                        : isLast
                          ? PaginationNext
                          : PaginationLink;

                    return (
                        <PaginationItem key={i}>
                            {/* @ts-ignore */}
                            <Comp
                                asChild
                                isActive={link.active}
                                href={link.url || '#'}
                                className={
                                    !link.url
                                        ? 'pointer-events-none opacity-50'
                                        : ''
                                }
                            >
                                <Link href={link.url || '#'}>
                                    {isFirst ? (
                                        'Previous'
                                    ) : isLast ? (
                                        'Next'
                                    ) : (
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    )}
                                </Link>
                            </Comp>
                        </PaginationItem>
                    );
                })}
            </PaginationContent>
        </ShadcnPagination>
    );
}
