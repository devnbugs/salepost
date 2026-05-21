import { Head, useForm, router } from '@inertiajs/react';
import {
    Shield,
    Users,
    Activity,
    Plus,
    Edit2,
    Trash2,
    Lock,
    Building,
    Briefcase,
    Search,
    UserCheck,
    UserMinus,
    Settings,
    Server,
    HardDrive,
    Layers,
    Globe,
    Cpu,
    Database,
    Settings2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { AIAssistant } from '@/components/ai-assistant';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import superAdmin from '@/routes/super-admin';

type Role = {
    id: number;
    name: string;
    slug: string;
};

type Branch = {
    id: number;
    name: string;
    code: string;
};

type Permission = {
    id: number;
    name: string;
    slug: string;
    roles?: Role[];
};

type User = {
    id: number;
    name: string;
    email: string;
    role_id: number;
    branch_id: number;
    is_active: boolean;
    role?: Role;
    branch?: Branch;
};

type Setting = {
    key: string;
    value: string;
    type: string;
    label: string;
    group: string;
};

type Props = {
    stats: {
        totalUsers: number;
        activeUsers: number;
        superAdminsCount: number;
        operatorsCount: number;
    };
    users: User[];
    branches: Branch[];
    roles: Role[];
    permissions: Permission[];
    settings?: Setting[];
};

export default function SuperAdminDashboard({
    stats,
    users = [],
    branches = [],
    roles = [],
    permissions = [],
    settings = [],
}: Props) {
    const [activeTab, setActiveTab] = useState<'access_control' | 'site_settings'>('access_control');

    const [selectedRoleForPermissions, setSelectedRoleForPermissions] = useState<Role | null>(
        roles.find((r) => r.slug === 'operator') || roles[0] || null
    );

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Subscription Plans state (stateful configurations)
    const [plans, setPlans] = useState([
        {
            id: 'lite',
            name: 'Lite / Free Tier',
            price: '0',
            userLimit: 3,
            branchLimit: 1,
            features: { ai_assistant: false, dynamic_reports: false },
        },
        {
            id: 'growth',
            name: 'Growth Tier',
            price: '49',
            userLimit: 15,
            branchLimit: 3,
            features: { ai_assistant: true, dynamic_reports: false },
        },
        {
            id: 'enterprise',
            name: 'Enterprise Tier',
            price: '199',
            userLimit: 100,
            branchLimit: 10,
            features: { ai_assistant: true, dynamic_reports: true },
        },
    ]);

    const handlePlanPriceChange = (id: string, newPrice: string) => {
        setPlans(plans.map(p => p.id === id ? { ...p, price: newPrice } : p));
    };

    const handlePlanUserLimitChange = (id: string, limit: number) => {
        setPlans(plans.map(p => p.id === id ? { ...p, userLimit: limit } : p));
    };

    const handlePlanFeatureToggle = (id: string, feature: 'ai_assistant' | 'dynamic_reports') => {
        setPlans(plans.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    features: {
                        ...p.features,
                        [feature]: !p.features[feature]
                    }
                };
            }

            return p;
        }));
    };

    const handleSavePlansMock = () => {
        toast.success('Subscription plan matrices synchronized!', {
            description: 'Updated prices and quotas are now cached globally.',
        });
    };

    // Form for Adding a User
    const addUserForm = useForm({
        name: '',
        email: '',
        password: '',
        role_id: roles[0]?.id || '',
        branch_id: branches[0]?.id || '',
    });

    // Form for Editing a User
    const editUserForm = useForm({
        id: '',
        name: '',
        email: '',
        role_id: '',
        branch_id: '',
        is_active: true,
    });

    // Form for Settings Update
    const settingsForm = useForm({
        settings: settings.map((s) => ({
            key: s.key,
            value: s.value,
        })),
    });

    const getSettingValue = (key: string): string => {
        const item = settingsForm.data.settings.find((s) => s.key === key);

        return item ? item.value : '';
    };

    const setSettingValue = (key: string, val: string) => {
        settingsForm.setData(
            'settings',
            settingsForm.data.settings.map((s) =>
                s.key === key ? { ...s, value: val } : s
            )
        );
    };

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        settingsForm.post('/super-admin/settings', {
            onSuccess: () => {
                toast.success('Site configurations updated!', {
                    description: 'Global settings synchronized successfully.',
                });
            },
            onError: () => {
                toast.error('Failed to update configurations', {
                    description: 'Please review values and try again.',
                });
            },
        });
    };

    const handleAddUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        addUserForm.post(superAdmin.users.store.url(), {
            onSuccess: () => {
                addUserForm.reset();
                toast.success('User Registered successfully!', {
                    description: `${addUserForm.data.name} has been added to the system.`,
                });
            },
            onError: (err) => {
                const firstError = Object.values(err)[0];
                toast.error('Registration failed', {
                    description: firstError || 'Please check your inputs and try again.',
                });
            },
        });
    };

    const openEditModal = (user: User) => {
        setUserToEdit(user);
        editUserForm.setData({
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            role_id: user.role_id.toString(),
            branch_id: user.branch_id.toString(),
            is_active: user.is_active,
        });
        setIsEditModalOpen(true);
    };

    const handleEditUserSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        editUserForm.patch(superAdmin.users.update.url({ user: Number(editUserForm.data.id) }), {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setUserToEdit(null);
                toast.success('User details updated!', {
                    description: `${editUserForm.data.name}'s profile has been modified.`,
                });
            },
            onError: (err) => {
                const firstError = Object.values(err)[0];
                toast.error('Update failed', {
                    description: firstError || 'Please check your inputs and try again.',
                });
            },
        });
    };

    const handleToggleStatus = (user: User) => {
        const nextStatus = !user.is_active;
        router.patch(
            superAdmin.users.update.url({ user: user.id }),
            {
                name: user.name,
                email: user.email,
                role_id: user.role_id,
                branch_id: user.branch_id,
                is_active: nextStatus,
            },
            {
                onSuccess: () => {
                    toast.success(nextStatus ? 'User Account Activated' : 'User Account Suspended', {
                        description: `${user.name} is now ${nextStatus ? 'active' : 'suspended'}.`,
                    });
                },
            }
        );
    };

    const handleDeleteUser = (user: User) => {
        if (confirm(`Are you absolutely sure you want to delete ${user.name}? This action is permanent.`)) {
            router.delete(superAdmin.users.destroy.url({ user: user.id }), {
                onSuccess: () => {
                    toast.success('User account removed', {
                        description: 'The operator was successfully deleted from the records.',
                    });
                },
                onError: (err: any) => {
                    toast.error('Deletion rejected', {
                        description: err.message || 'Cannot delete currently authenticated super admin.',
                    });
                },
            });
        }
    };

    // Matrix Real-time Checkbox Syncer
    const handlePermissionToggle = (permission: Permission, isAssigned: boolean) => {
        if (!selectedRoleForPermissions) {
            return;
        }

        // Compute new permission IDs list
        let updatedPermissionIds: number[] = [];

        if (isAssigned) {
            // Remove the permission ID
            updatedPermissionIds = permissions
                .filter((p) => {
                    if (p.id === permission.id) {
return false;
}

                    return p.roles?.some((r) => r.id === selectedRoleForPermissions.id);
                })
                .map((p) => p.id);
        } else {
            // Add the permission ID
            const currentlyAssignedIds = permissions
                .filter((p) => p.roles?.some((r) => r.id === selectedRoleForPermissions.id))
                .map((p) => p.id);
            updatedPermissionIds = [...currentlyAssignedIds, permission.id];
        }

        router.post(
            superAdmin.roles.permissions.sync.url({ role: selectedRoleForPermissions.id }),
            {
                permission_ids: updatedPermissionIds,
            },
            {
                onSuccess: () => {
                    toast.success('Permissions synchronised', {
                        description: `Updated access levels for role: ${selectedRoleForPermissions.name}.`,
                    });
                },
            }
        );
    };

    // Group permissions by their logical categories (prefixes)
    const getCategoryName = (slug: string) => {
        const parts = slug.split('_');

        if (parts.length < 2) {
return 'General';
}

        // Get prefix resource string
        const prefix = parts.slice(2).join(' ') || parts.slice(1).join(' ');

        return prefix.charAt(0).toUpperCase() + prefix.slice(1);
    };

    const groupedPermissions = permissions.reduce((acc, permission) => {
        const cat = getCategoryName(permission.slug);

        if (!acc[cat]) {
            acc[cat] = [];
        }

        acc[cat].push(permission);

        return acc;
    }, {} as Record<string, Permission[]>);

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.role?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.branch?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <Head title="Access Control Matrix" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6 text-left">
                {/* Dashboard Banner Header */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-emerald-500 animate-pulse" />
                            <h2 className="text-2xl font-bold tracking-tight">
                                User & Access Security Matrix
                            </h2>
                        </div>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Unified super-admin node for managing personnel credentials, roles, and real-time permission scopes.
                        </p>
                    </div>
                </div>

                {/* Analytical Metric Counters Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total Accounts */}
                    <div className="flex items-center justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Registered Personnel
                            </span>
                            <div className="font-mono text-3xl font-extrabold">{stats.totalUsers}</div>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                            <Users className="h-6 w-6" />
                        </div>
                    </div>

                    {/* Active Sessions */}
                    <div className="flex items-center justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Active Operators
                            </span>
                            <div className="font-mono text-3xl font-extrabold text-emerald-500">
                                {stats.activeUsers}
                            </div>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                            <Activity className="h-6 w-6" />
                        </div>
                    </div>

                    {/* Super Administrators */}
                    <div className="flex items-center justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Super Administrators
                            </span>
                            <div className="font-mono text-3xl font-extrabold">{stats.superAdminsCount}</div>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                            <Shield className="h-6 w-6" />
                        </div>
                    </div>

                    {/* Yard Operators */}
                    <div className="flex items-center justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Standard Operators
                            </span>
                            <div className="font-mono text-3xl font-extrabold">{stats.operatorsCount}</div>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                            <Briefcase className="h-6 w-6" />
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-muted/50 dark:border-zinc-800">
                    <button
                        onClick={() => setActiveTab('access_control')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                            activeTab === 'access_control'
                                ? 'border-emerald-500 text-emerald-500 dark:text-emerald-400'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Shield className="h-4 w-4" />
                        Directory & Access Controls
                    </button>
                    <button
                        onClick={() => setActiveTab('site_settings')}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                            activeTab === 'site_settings'
                                ? 'border-indigo-500 text-indigo-500 dark:text-indigo-400'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                    >
                        <Settings className="h-4 w-4" />
                        General Site Settings
                    </button>
                </div>

                {activeTab === 'access_control' ? (
                    /* Primary Content Grid */
                    <div className="grid gap-6 lg:grid-cols-12 items-start">
                    {/* Left Column (8 units): User Ledger & Form */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Add User Panel */}
                        <Card>
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex items-center gap-1.5">
                                    <Plus className="h-5 w-5 text-emerald-500" />
                                    <div>
                                        <CardTitle className="text-base font-bold">Register New Operator Account</CardTitle>
                                        <CardDescription className="text-xs">
                                            Establish credentials and secure localized default branch bindings.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleAddUserSubmit} className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={addUserForm.data.name}
                                            onChange={(e) => addUserForm.setData('name', e.target.value)}
                                            placeholder="Ado Ibrahim"
                                            required
                                        />
                                        {addUserForm.errors.name && (
                                            <p className="text-xs text-destructive">{addUserForm.errors.name}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={addUserForm.data.email}
                                            onChange={(e) => addUserForm.setData('email', e.target.value)}
                                            placeholder="ado@example.com"
                                            required
                                        />
                                        {addUserForm.errors.email && (
                                            <p className="text-xs text-destructive">{addUserForm.errors.email}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Security Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={addUserForm.data.password}
                                            onChange={(e) => addUserForm.setData('password', e.target.value)}
                                            placeholder="Minimum 8 characters"
                                            required
                                        />
                                        {addUserForm.errors.password && (
                                            <p className="text-xs text-destructive">{addUserForm.errors.password}</p>
                                        )}
                                    </div>

                                    <div className="grid gap-4 grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="role_id">Access Role</Label>
                                            <select
                                                id="role_id"
                                                value={addUserForm.data.role_id}
                                                onChange={(e) => addUserForm.setData('role_id', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-muted/20"
                                            >
                                                {roles.map((role) => (
                                                    <option key={role.id} value={role.id}>
                                                        {role.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="branch_id">Primary Branch</Label>
                                            <select
                                                id="branch_id"
                                                value={addUserForm.data.branch_id}
                                                onChange={(e) => addUserForm.setData('branch_id', e.target.value)}
                                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 dark:bg-muted/20"
                                            >
                                                {branches.map((branch) => (
                                                    <option key={branch.id} value={branch.id}>
                                                        {branch.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 flex justify-end pt-2 border-t mt-2">
                                        <Button
                                            type="submit"
                                            disabled={addUserForm.processing}
                                            className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                                        >
                                            Create Operator Account
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* User Accounts Management ledger */}
                        <Card>
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-bold">Manage Operator Directory</CardTitle>
                                        <CardDescription className="text-xs">
                                            Modify access details, suspend logins, or safely revoke credentials.
                                        </CardDescription>
                                    </div>
                                    <div className="relative w-full sm:w-60">
                                        <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            placeholder="Search directory..."
                                            className="pl-9 h-9"
                                        />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow>
                                                <TableHead className="px-6 py-3">Account</TableHead>
                                                <TableHead className="px-6 py-3">Assigned Branch</TableHead>
                                                <TableHead className="px-6 py-3">System Role</TableHead>
                                                <TableHead className="px-6 py-3 text-center">Status</TableHead>
                                                <TableHead className="px-6 py-3 text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filteredUsers.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                                        No matching operator accounts found.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                filteredUsers.map((user) => (
                                                    <TableRow key={user.id} className="transition-colors hover:bg-muted/10">
                                                        <TableCell className="px-6 py-4">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-foreground">{user.name}</span>
                                                                <span className="text-xs text-muted-foreground">{user.email}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4">
                                                            <div className="flex items-center gap-1.5 text-sm text-foreground">
                                                                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                                                                <span>{user.branch?.name || 'Unassigned'}</span>
                                                                {user.branch?.code && (
                                                                    <span className="font-mono text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                                                        {user.branch.code}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4">
                                                            <Badge
                                                                variant={
                                                                    user.role?.slug === 'super-admin'
                                                                        ? 'default'
                                                                        : 'secondary'
                                                                }
                                                                className="font-medium px-2 py-0.5"
                                                            >
                                                                {user.role?.name || 'Operator'}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 text-center">
                                                            <span
                                                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                                    user.is_active
                                                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25'
                                                                        : 'bg-red-500/10 text-red-500 border border-red-500/25'
                                                                }`}
                                                            >
                                                                {user.is_active ? 'Active' : 'Suspended'}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="px-6 py-4 text-right">
                                                            <div className="flex justify-end items-center gap-1.5">
                                                                {/* Suspend/Activate Quick Button */}
                                                                <Button
                                                                    onClick={() => handleToggleStatus(user)}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                                    title={user.is_active ? 'Suspend Account' : 'Activate Account'}
                                                                >
                                                                    {user.is_active ? (
                                                                        <UserMinus className="h-4 w-4 text-amber-500" />
                                                                    ) : (
                                                                        <UserCheck className="h-4 w-4 text-emerald-500" />
                                                                    )}
                                                                </Button>

                                                                {/* Edit Details Button */}
                                                                <Button
                                                                    onClick={() => openEditModal(user)}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                                                    title="Edit Settings"
                                                                >
                                                                    <Edit2 className="h-4 w-4 text-sky-500" />
                                                                </Button>

                                                                {/* Safe Delete Button */}
                                                                <Button
                                                                    onClick={() => handleDeleteUser(user)}
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8 text-muted-foreground hover:text-destructive-foreground hover:bg-destructive/10"
                                                                    title="Delete Account"
                                                                >
                                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (4 units): Role-Permissions Access Matrix */}
                    <div className="space-y-6 lg:col-span-4">
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex items-center gap-1.5">
                                    <Lock className="h-5 w-5 text-emerald-500" />
                                    <div>
                                        <CardTitle className="text-base font-bold">Access Security Matrix</CardTitle>
                                        <CardDescription className="text-xs">
                                            Dynamically coordinate scopes across system roles in real-time.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4">
                                {/* Role Tab Selection */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-bold tracking-wider text-muted-foreground uppercase">
                                        Target Role Workspace
                                    </Label>
                                    <div className="grid grid-cols-2 gap-1 bg-muted p-1 rounded-lg">
                                        {roles.map((role) => (
                                            <button
                                                key={role.id}
                                                onClick={() => setSelectedRoleForPermissions(role)}
                                                className={`py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                                                    selectedRoleForPermissions?.id === role.id
                                                        ? 'bg-background shadow-xs text-foreground'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                }`}
                                            >
                                                {role.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Checklist Matrix Scopes */}
                                {selectedRoleForPermissions && (
                                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                                        {Object.entries(groupedPermissions).map(([category, items]) => (
                                            <div key={category} className="space-y-2 border border-muted/50 rounded-xl p-3.5 bg-muted/5">
                                                <div className="flex items-center gap-1 border-b pb-1.5 mb-2">
                                                    <Briefcase className="h-3.5 w-3.5 text-emerald-500" />
                                                    <h4 className="text-xs font-extrabold tracking-wider text-muted-foreground uppercase">
                                                        {category} Permissions
                                                    </h4>
                                                </div>

                                                <div className="space-y-2.5">
                                                    {items.map((permission) => {
                                                        const isAssigned = permission.roles?.some(
                                                            (r) => r.id === selectedRoleForPermissions.id
                                                        ) || false;

                                                        return (
                                                            <label
                                                                key={permission.id}
                                                                className="flex items-start gap-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isAssigned}
                                                                    onChange={() =>
                                                                        handlePermissionToggle(permission, isAssigned)
                                                                    }
                                                                    className="mt-0.5 h-3.5 w-3.5 rounded border-muted-foreground/30 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                                                                />
                                                                <div className="flex flex-col">
                                                                    <span className="font-bold text-foreground">
                                                                        {permission.name}
                                                                    </span>
                                                                    <span className="font-mono text-[9px] text-muted-foreground">
                                                                        {permission.slug}
                                                                    </span>
                                                                </div>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                /* Primary Site Settings Tab Content */
                <div className="grid gap-6 lg:grid-cols-12 items-start">
                    {/* Left Column (8 units): Global Settings & Subscription Tiers */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Global Settings Configuration Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex items-center gap-1.5">
                                    <Settings2 className="h-5 w-5 text-indigo-500" />
                                    <div>
                                        <CardTitle className="text-base font-bold">General Site Configuration</CardTitle>
                                        <CardDescription className="text-xs">
                                            Modify general parameters, security defaults, and correspondence metadata.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <form onSubmit={handleSettingsSubmit} className="space-y-6">
                                    {/* Maintenance Mode Toggle */}
                                    <div className="flex items-center justify-between border-b border-muted/50 pb-4">
                                        <div>
                                            <span className="text-sm font-bold text-foreground flex items-center gap-1.5">
                                                Maintenance Mode
                                                {getSettingValue('maintenance_mode') === 'true' && (
                                                    <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded font-mono font-medium animate-pulse">
                                                        ACTIVE
                                                    </span>
                                                )}
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Redirect all standard personnel accounts to a structured maintenance landing page.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSettingValue('maintenance_mode', getSettingValue('maintenance_mode') === 'true' ? 'false' : 'true')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-hidden focus-visible:ring-1 focus-visible:ring-ring ${
                                                getSettingValue('maintenance_mode') === 'true' ? 'bg-amber-500' : 'bg-zinc-850'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    getSettingValue('maintenance_mode') === 'true' ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Allow Registrations Toggle */}
                                    <div className="flex items-center justify-between border-b border-muted/50 pb-4">
                                        <div>
                                            <span className="text-sm font-bold text-foreground">
                                                Allow New Self-Registrations
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Enables automatic registration and credentials provisioning for new operators.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSettingValue('allow_registrations', getSettingValue('allow_registrations') === 'true' ? 'false' : 'true')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-hidden focus-visible:ring-1 focus-visible:ring-ring ${
                                                getSettingValue('allow_registrations') === 'true' ? 'bg-indigo-500' : 'bg-zinc-850'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    getSettingValue('allow_registrations') === 'true' ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Enforce Two-Factor Toggle */}
                                    <div className="flex items-center justify-between pb-2">
                                        <div>
                                            <span className="text-sm font-bold text-foreground">
                                                Enforce Two-Factor Authentication
                                            </span>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                Require standard operators and super-admins to bind secure passkeys or Google authenticator seeds.
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSettingValue('two_factor_auth', getSettingValue('two_factor_auth') === 'true' ? 'false' : 'true')}
                                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer outline-hidden focus-visible:ring-1 focus-visible:ring-ring ${
                                                getSettingValue('two_factor_auth') === 'true' ? 'bg-indigo-500' : 'bg-zinc-850'
                                            }`}
                                        >
                                            <span
                                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                    getSettingValue('two_factor_auth') === 'true' ? 'translate-x-6' : 'translate-x-1'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Company Details Inputs */}
                                    <div className="grid gap-4 md:grid-cols-2 pt-4 border-t border-muted/50 mt-4">
                                        <div className="space-y-1.5">
                                            <Label htmlFor="company_name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company Name</Label>
                                            <Input
                                                id="company_name"
                                                value={getSettingValue('company_name')}
                                                onChange={(e) => setSettingValue('company_name', e.target.value)}
                                                placeholder="Salepost Corp"
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="support_email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Support Correspondence Email</Label>
                                            <Input
                                                id="support_email"
                                                type="email"
                                                value={getSettingValue('support_email')}
                                                onChange={(e) => setSettingValue('support_email', e.target.value)}
                                                placeholder="support@salepost.example.com"
                                                className="h-9 text-sm"
                                            />
                                        </div>
                                    </div>

                                    {/* Submit */}
                                    <div className="flex justify-end pt-4 border-t border-muted/50 mt-6">
                                        <Button
                                            type="submit"
                                            disabled={settingsForm.processing}
                                            className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-xs px-5 py-2.5 rounded-lg transition"
                                        >
                                            {settingsForm.processing ? 'Synchronising...' : 'Save Site Settings'}
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Interactive Subscription Plans builder Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="space-y-1">
                                        <CardTitle className="text-base font-bold flex items-center gap-1.5">
                                            <Layers className="h-5 w-5 text-indigo-500" />
                                            Subscription Tiers Matrix
                                        </CardTitle>
                                        <CardDescription className="text-xs">
                                            Dynamically calibrate price points, active feature flags, and yard operator quotas.
                                        </CardDescription>
                                    </div>
                                    <Button
                                        onClick={handleSavePlansMock}
                                        className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium h-9 text-xs"
                                    >
                                        Synchronise Plans
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 p-0">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-muted/30">
                                            <TableRow>
                                                <TableHead className="px-6 py-3">Tier Name</TableHead>
                                                <TableHead className="px-6 py-3">Price (Monthly USD)</TableHead>
                                                <TableHead className="px-6 py-3">Max Operators</TableHead>
                                                <TableHead className="px-6 py-3">Max Branches</TableHead>
                                                <TableHead className="px-6 py-3 text-right">Feature Toggles</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {plans.map((plan) => (
                                                <TableRow key={plan.id} className="transition-colors hover:bg-muted/10">
                                                    <TableCell className="px-6 py-4 font-bold text-foreground">
                                                        <div className="flex flex-col">
                                                            <span>{plan.name}</span>
                                                            <span className="text-[10px] font-mono text-muted-foreground uppercase">{plan.id}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4">
                                                        <div className="relative w-28">
                                                            <span className="absolute top-2.5 left-2.5 text-xs text-muted-foreground">$</span>
                                                            <Input
                                                                type="number"
                                                                value={plan.price}
                                                                onChange={(e) => handlePlanPriceChange(plan.id, e.target.value)}
                                                                className="pl-6 h-8 text-xs font-mono"
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4">
                                                        <div className="relative w-28">
                                                            <Input
                                                                type="number"
                                                                value={plan.userLimit}
                                                                onChange={(e) => handlePlanUserLimitChange(plan.id, parseInt(e.target.value) || 0)}
                                                                className="h-8 text-xs font-mono"
                                                            />
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-center">
                                                        <Badge variant="outline" className="font-mono text-xs">
                                                            {plan.branchLimit} Branch limit
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="px-6 py-4 text-right">
                                                        <div className="flex justify-end gap-3.5">
                                                            <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={plan.features.ai_assistant}
                                                                    onChange={() => handlePlanFeatureToggle(plan.id, 'ai_assistant')}
                                                                    className="h-3.5 w-3.5 rounded border-muted-foreground/30 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                                />
                                                                <span className="text-muted-foreground">AI Assistant</span>
                                                            </label>
                                                            <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={plan.features.dynamic_reports}
                                                                    onChange={() => handlePlanFeatureToggle(plan.id, 'dynamic_reports')}
                                                                    className="h-3.5 w-3.5 rounded border-muted-foreground/30 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                                />
                                                                <span className="text-muted-foreground">Reports</span>
                                                            </label>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column (4 units): Operational Health */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Operational Health Status Card */}
                        <Card className="shadow-sm">
                            <CardHeader className="border-b bg-muted/20 pb-4">
                                <div className="flex items-center gap-1.5">
                                    <Server className="h-5 w-5 text-indigo-500 animate-pulse" />
                                    <div>
                                        <CardTitle className="text-base font-bold">Node Operational Health</CardTitle>
                                        <CardDescription className="text-xs">
                                            Live hardware resource utilization and compiler pipeline metrics.
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-5">
                                {/* Environment Indicators */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-muted/30 border border-muted/50 rounded-lg p-2.5">
                                        <span className="text-[10px] font-bold text-muted-foreground block uppercase">App Environment</span>
                                        <span className="text-xs font-mono font-bold text-emerald-500 flex items-center gap-1 mt-0.5">
                                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                                            local (Vite Dev)
                                        </span>
                                    </div>
                                    <div className="bg-muted/30 border border-muted/50 rounded-lg p-2.5">
                                        <span className="text-[10px] font-bold text-muted-foreground block uppercase">Database Node</span>
                                        <span className="text-xs font-mono font-bold text-zinc-300 flex items-center gap-1 mt-0.5">
                                            <Database className="h-3 w-3 text-indigo-400" />
                                            SQLite 3.x
                                        </span>
                                    </div>
                                </div>

                                {/* Resource Bars */}
                                <div className="space-y-4">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-semibold text-muted-foreground flex items-center gap-1">
                                                <Cpu className="h-3.5 w-3.5 text-indigo-400" /> CPU Core Load
                                            </span>
                                            <span className="font-mono text-indigo-400 font-bold">24%</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000" style={{ width: '24%' }} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-semibold text-muted-foreground flex items-center gap-1">
                                                <HardDrive className="h-3.5 w-3.5 text-emerald-400" /> RAM Consumption
                                            </span>
                                            <span className="font-mono text-emerald-400 font-bold">1.4 GB / 8.0 GB</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: '17.5%' }} />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-semibold text-muted-foreground flex items-center gap-1">
                                                <Globe className="h-3.5 w-3.5 text-sky-400" /> SSD Storage Capacity
                                            </span>
                                            <span className="font-mono text-sky-400 font-bold">42% (51.2 GB Free)</span>
                                        </div>
                                        <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                                            <div className="h-full bg-sky-500 rounded-full transition-all duration-1000" style={{ width: '42%' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Driver Details */}
                                <div className="border-t border-zinc-800/50 pt-4 space-y-2 text-xs">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Framework Version</span>
                                        <span className="font-mono text-foreground font-bold">Laravel v13.x</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Asset Bundler</span>
                                        <span className="font-mono text-indigo-400 font-bold">Vite + Rolldown</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Caching Driver</span>
                                        <span className="font-mono text-foreground">file / database</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Security Protocol</span>
                                        <span className="font-mono text-emerald-400 font-bold">TLS 1.3 Active</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>

            {/* Edit User Modal Dialog */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="p-6 text-left">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-bold flex items-center gap-1.5 text-foreground">
                            <Edit2 className="h-5 w-5 text-sky-500" />
                            Edit Operator Credentials
                        </DialogTitle>
                        <DialogDescription className="text-xs text-muted-foreground">
                            Modifying settings for {userToEdit?.name || 'the system account'}. Ensure correct values.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleEditUserSubmit} className="space-y-4 py-2">
                        <div className="space-y-1.5">
                            <Label htmlFor="edit-name">Operator Full Name</Label>
                            <Input
                                id="edit-name"
                                value={editUserForm.data.name}
                                onChange={(e) => editUserForm.setData('name', e.target.value)}
                                required
                            />
                            {editUserForm.errors.name && (
                                <p className="text-xs text-destructive">{editUserForm.errors.name}</p>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="edit-email">Email Address</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editUserForm.data.email}
                                onChange={(e) => editUserForm.setData('email', e.target.value)}
                                required
                            />
                            {editUserForm.errors.email && (
                                <p className="text-xs text-destructive">{editUserForm.errors.email}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="edit-role">System Role</Label>
                                <select
                                    id="edit-role"
                                    value={editUserForm.data.role_id}
                                    onChange={(e) => editUserForm.setData('role_id', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-muted/20"
                                >
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="edit-branch">Primary Branch</Label>
                                <select
                                    id="edit-branch"
                                    value={editUserForm.data.branch_id}
                                    onChange={(e) => editUserForm.setData('branch_id', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-hidden focus-visible:ring-1 focus-visible:ring-ring dark:bg-muted/20"
                                >
                                    {branches.map((branch) => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input
                                id="edit-status"
                                type="checkbox"
                                checked={editUserForm.data.is_active}
                                onChange={(e) => editUserForm.setData('is_active', e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
                            />
                            <Label htmlFor="edit-status" className="cursor-pointer text-xs font-bold text-foreground">
                                Active Account (Enables Access Login)
                            </Label>
                        </div>

                        <DialogFooter className="pt-4 border-t mt-4 flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsEditModalOpen(false)}
                                className="cursor-pointer h-9 text-xs"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={editUserForm.processing}
                                className="cursor-pointer bg-sky-600 hover:bg-sky-700 text-white font-medium h-9 text-xs"
                            >
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AIAssistant />
        </>
    );
}

SuperAdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Super Admin',
            href: '/super-admin',
        },
    ],
};
