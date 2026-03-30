import AppShell from '@/components/app-shell';
import FormError from '@/components/form-error';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';

export default function SettingsIndex({ business, theme }: any) {
    const { data, setData, patch, processing, errors } = useForm<any>({
        business_name: business.business_name ?? '',
        business_address: business.business_address ?? '',
        phone: business.phone ?? '',
        email: business.email ?? '',
        currency: business.currency ?? 'NGN',
        invoice_prefix: business.invoice_prefix ?? 'INV',
        allow_negative_stock: Boolean(business.allow_negative_stock),
        default_theme: theme.default_theme ?? 'system',
    });

    return (
        <AppShell title="Settings">
            <PageHeader
                title="Business Settings"
                description="Control invoice branding, currency, stock rules, and default theme behavior."
            />
            <Card>
                <CardContent className="p-6">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            patch(route('settings.update'));
                        }}
                        className="grid gap-4 md:grid-cols-2"
                    >
                        <div>
                            <Label>Business Name</Label>
                            <Input value={data.business_name} onChange={(e) => setData('business_name', e.target.value)} />
                            <FormError message={errors.business_name} />
                        </div>
                        <div>
                            <Label>Invoice Prefix</Label>
                            <Input value={data.invoice_prefix} onChange={(e) => setData('invoice_prefix', e.target.value)} />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        </div>
                        <div>
                            <Label>Currency</Label>
                            <Input value={data.currency} onChange={(e) => setData('currency', e.target.value)} />
                        </div>
                        <div>
                            <Label>Default Theme</Label>
                            <Select value={data.default_theme} onChange={(e) => setData('default_theme', e.target.value)}>
                                <option value="system">System</option>
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                            </Select>
                        </div>
                        <div className="md:col-span-2">
                            <Label>Business Address</Label>
                            <Input value={data.business_address} onChange={(e) => setData('business_address', e.target.value)} />
                        </div>
                        <div className="md:col-span-2 flex items-center gap-3">
                            <input
                                id="allow_negative_stock"
                                type="checkbox"
                                checked={data.allow_negative_stock}
                                onChange={(e) => setData('allow_negative_stock', e.target.checked)}
                            />
                            <Label htmlFor="allow_negative_stock">Allow negative stock overrides</Label>
                        </div>
                        <div className="md:col-span-2">
                            <Button disabled={processing}>Save Settings</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppShell>
    );
}
