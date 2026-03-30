import AppShell from '@/components/app-shell';
import FormError from '@/components/form-error';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

export default function ProductsForm({ product, categories, branches, status_options }: any) {
    const { data, setData, post, put, processing, errors } = useForm<any>({
        branch_id: product?.branch_id ?? branches[0]?.id ?? '',
        product_category_id: product?.product_category_id ?? '',
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        sku: product?.sku ?? '',
        unit_of_measure: product?.unit_of_measure ?? 'kg',
        cost_price: product?.cost_price ?? 0,
        selling_price: product?.selling_price ?? 0,
        current_stock: product?.current_stock ?? 0,
        reorder_level: product?.reorder_level ?? 0,
        status: product?.status ?? 'active',
        description: product?.description ?? '',
        notes: product?.notes ?? '',
    });

    const submit = (event: any) => {
        event.preventDefault();

        if (product) {
            put(route('products.update', product.id));
            return;
        }

        post(route('products.store'));
    };

    return (
        <AppShell title={product ? 'Edit Material' : 'Add Material'}>
            <PageHeader
                title={product ? 'Edit Material' : 'Add Material'}
                description="Register a scrap material with stock, pricing, and reorder controls."
            />

            <Card>
                <CardContent className="p-6">
                    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label>Name</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <FormError message={errors.name} />
                        </div>
                        <div>
                            <Label>Slug / Code</Label>
                            <Input value={data.slug} onChange={(e) => setData('slug', e.target.value)} />
                            <FormError message={errors.slug} />
                        </div>
                        <div>
                            <Label>Category</Label>
                            <Select value={data.product_category_id} onChange={(e) => setData('product_category_id', e.target.value)}>
                                <option value="">No category</option>
                                {categories.map((category: any) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label>Branch</Label>
                            <Select value={data.branch_id} onChange={(e) => setData('branch_id', e.target.value)}>
                                {branches.map((branch: any) => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label>Unit</Label>
                            <Input value={data.unit_of_measure} onChange={(e) => setData('unit_of_measure', e.target.value)} />
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                {status_options.map((option: any) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label>Cost Price</Label>
                            <Input type="number" value={data.cost_price} onChange={(e) => setData('cost_price', e.target.value)} />
                        </div>
                        <div>
                            <Label>Selling Price</Label>
                            <Input type="number" value={data.selling_price} onChange={(e) => setData('selling_price', e.target.value)} />
                        </div>
                        <div>
                            <Label>Current Stock</Label>
                            <Input type="number" value={data.current_stock} onChange={(e) => setData('current_stock', e.target.value)} />
                        </div>
                        <div>
                            <Label>Reorder Level</Label>
                            <Input type="number" value={data.reorder_level} onChange={(e) => setData('reorder_level', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Description</Label>
                            <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Notes</Label>
                            <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Button disabled={processing}>{product ? 'Update Material' : 'Save Material'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppShell>
    );
}
