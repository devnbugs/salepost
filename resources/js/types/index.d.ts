export interface AuthUser {
    id: number;
    branch_id?: number | null;
    name: string;
    email: string;
    phone?: string | null;
    job_title?: string | null;
    theme_preference?: string | null;
    email_verified_at?: string | null;
    roles?: string[];
    permissions?: string[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: AuthUser | null;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
    };
    settings?: {
        business?: Record<string, string | boolean | null>;
        theme?: Record<string, string | boolean | null>;
    };
};
