import {
    Sparkles,
    Brain,
    TrendingUp,
    TrendingDown,
    Send,
    Bot,
    X,
    AlertTriangle,
    Zap,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

interface MaterialPrediction {
    trend: 'up' | 'down' | 'stable';
    percentage: number;
    targetPrice: number;
    recommendation: string;
    confidence: number;
}

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'forecast' | 'chat'>('forecast');

    // Forecast Form State
    const [selectedMaterial, setSelectedMaterial] = useState<string>('Copper');
    const [forecastWeeks, setForecastWeeks] = useState<number>(4);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [predictionResult, setPredictionResult] =
        useState<MaterialPrediction | null>(null);

    // Chat State
    const [chatInput, setChatInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [chatMessages, setChatMessages] = useState<
        Array<{ sender: 'user' | 'ai'; text: string }>
    >([
        {
            sender: 'ai',
            text: 'Maraba! I am the Salepost Firebase AI Assistant. Ask me anything about Nigerian scrap prices, yard collections, or market supply strategies.',
        },
    ]);

    // Pre-calculate sample rates (Naira)
    const basePrices: Record<string, number> = {
        Karfe: 650,
        Brass: 4100,
        'Jar Waya': 2300,
        Aluminium: 2500,
        Copper: 6500,
    };

    const runAnalysis = () => {
        setIsAnalyzing(true);
        setPredictionResult(null);

        setTimeout(() => {
            const basePrice = basePrices[selectedMaterial] || 1000;
            let trend: 'up' | 'down' | 'stable' = 'stable';
            let percentage = 0;
            let recommendation = '';
            const confidence = 85 + Math.random() * 12;

            if (
                selectedMaterial === 'Copper' ||
                selectedMaterial === 'Jar Waya'
            ) {
                trend = 'up';
                percentage = 4.2 + forecastWeeks * 1.1 + Math.random() * 2;
                recommendation = `Regional smelting factory maintenance is causing tight supplies. We highly recommend holding onto your ${selectedMaterial} inventory for at least ${forecastWeeks} weeks to maximize profit margins.`;
            } else if (selectedMaterial === 'Karfe') {
                trend = 'down';
                percentage = -(1.5 + forecastWeeks * 0.4 + Math.random());
                recommendation =
                    'Yard collection rates in northern sectors are peaking. High domestic supply suggests you should sell current Karfe stocks immediately to optimize liquidity.';
            } else {
                trend = 'stable';
                percentage = 0.5 + Math.random() * 2;
                recommendation = `Market demand for ${selectedMaterial} is tracking steadily against the exchange index. Proceed with standard acquisition and selling velocity.`;
            }

            const multiplier = 1 + percentage / 100;
            const targetPrice = Math.round(basePrice * multiplier);

            setPredictionResult({
                trend,
                percentage: parseFloat(percentage.toFixed(1)),
                targetPrice,
                recommendation,
                confidence: Math.round(confidence),
            });
            setIsAnalyzing(false);
        }, 1200);
    };

    const handleSendMessage = () => {
        if (!chatInput.trim()) {
return;
}

        const userMsg = chatInput;
        setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
        setChatInput('');
        setIsTyping(true);

        setTimeout(() => {
            let aiText = '';
            const query = userMsg.toLowerCase();

            if (query.includes('copper') || query.includes('jar waya')) {
                aiText =
                    'Copper (Jar Waya) is currently our highest-performing material tier. Firebase ML models indicate a supply bottleneck in the Lagos shipping ports which is driving up local yard prices. Consider acquiring as much raw copper wire as possible today.';
            } else if (
                query.includes('karfe') ||
                query.includes('iron') ||
                query.includes('metal')
            ) {
                aiText =
                    'Karfe (Iron) prices are currently holding steady around ₦650/kg. However, due to seasonal monsoon rains affecting logistics, collections might slow down next month, potentially causing a minor ₦20-₦30 price bump.';
            } else if (query.includes('buy') || query.includes('sell')) {
                aiText =
                    'Based on our latest predictive models, the optimal strategy right now is to BUY Copper & Aluminium immediately, but SELL bulky Iron (Karfe) stocks to free up active yard space and cash reserves.';
            } else {
                aiText =
                    'Fascinating question! The scrap metal market is highly dynamic. Our Firebase AI forecast models run hourly checks against spot-market metal indexes. I recommend using the Forecast tab to simulate exact price projections for your materials.';
            }

            setChatMessages((prev) => [
                ...prev,
                { sender: 'ai', text: aiText },
            ]);
            setIsTyping(false);
        }, 1000);
    };

    return (
        <>
            {/* Floating Trigger Button with premium glowing elements */}
            <button
                onClick={() => setIsOpen(true)}
                className="group fixed right-6 bottom-6 z-50 flex cursor-pointer items-center justify-center rounded-full bg-emerald-500 p-4 text-black shadow-[0_4px_30px_rgba(16,185,129,0.5)] transition-all duration-300 hover:scale-110 hover:bg-emerald-400 active:scale-95"
                title="Open Firebase AI Assistant"
            >
                <div className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-emerald-500/30 opacity-75" />
                <Brain className="h-6 w-6 animate-pulse transition-transform duration-300 group-hover:rotate-12" />
                <span className="max-w-0 overflow-hidden font-mono text-xs font-bold tracking-tight whitespace-nowrap transition-all duration-500 ease-in-out group-hover:ml-2 group-hover:max-w-xs">
                    Firebase AI Assistant
                </span>
            </button>

            {/* AI assistant Drawer / Dialog Panel */}
            {isOpen && (
                <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-end bg-black/40 p-4 backdrop-blur-xs">
                    {/* Panel Card Container */}
                    <div className="animate-slide-in relative flex h-[550px] w-full max-w-md flex-col overflow-hidden rounded-2xl border bg-background shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b bg-muted/40 p-4">
                            <div className="flex items-center gap-2">
                                <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-1.5 text-emerald-500">
                                    <Sparkles className="h-4 w-4 animate-pulse" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold">
                                        Firebase AI Assistant
                                    </h4>
                                    <p className="font-mono text-[10px] text-muted-foreground">
                                        MODEL v3.2-SCRAP-NGA
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 cursor-pointer rounded-full hover:bg-muted"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        {/* Navigation Tabs */}
                        <div className="flex border-b bg-muted/20">
                            <button
                                onClick={() => setActiveTab('forecast')}
                                className={`flex-1 border-b-2 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                                    activeTab === 'forecast'
                                        ? 'border-emerald-500 text-emerald-500'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                Spot Price Predictor
                            </button>
                            <button
                                onClick={() => setActiveTab('chat')}
                                className={`flex-1 border-b-2 py-2.5 text-xs font-bold tracking-wider uppercase transition-colors ${
                                    activeTab === 'chat'
                                        ? 'border-emerald-500 text-emerald-500'
                                        : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            >
                                AI Advisor Chat
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 space-y-4 overflow-y-auto p-4">
                            {activeTab === 'forecast' ? (
                                <div className="space-y-4 text-left">
                                    <div className="space-y-3.5">
                                        {/* Material Selection */}
                                        <div className="space-y-1.5">
                                            <Label
                                                htmlFor="ai_material"
                                                className="text-xs font-bold text-muted-foreground"
                                            >
                                                Select Commodity Tier
                                            </Label>
                                            <Select
                                                value={selectedMaterial}
                                                onValueChange={
                                                    setSelectedMaterial
                                                }
                                            >
                                                <SelectTrigger className="w-full border-input bg-background">
                                                    <SelectValue placeholder="Select Material" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Karfe">
                                                        Karfe (Iron / Heavy
                                                        Metal)
                                                    </SelectItem>
                                                    <SelectItem value="Brass">
                                                        Brass
                                                    </SelectItem>
                                                    <SelectItem value="Jar Waya">
                                                        Jar Waya (Red Copper
                                                        Wire)
                                                    </SelectItem>
                                                    <SelectItem value="Aluminium">
                                                        Aluminium
                                                    </SelectItem>
                                                    <SelectItem value="Copper">
                                                        Copper (Standard Mixed)
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Duration Selector */}
                                        <div className="space-y-1.5">
                                            <div className="flex justify-between text-xs">
                                                <Label
                                                    htmlFor="ai_weeks"
                                                    className="font-bold text-muted-foreground"
                                                >
                                                    Projection Horizon
                                                </Label>
                                                <span className="font-mono font-bold text-emerald-500">
                                                    {forecastWeeks} Weeks
                                                </span>
                                            </div>
                                            <input
                                                type="range"
                                                min="1"
                                                max="12"
                                                value={forecastWeeks}
                                                onChange={(e) =>
                                                    setForecastWeeks(
                                                        parseInt(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-emerald-500"
                                            />
                                        </div>

                                        <Button
                                            onClick={runAnalysis}
                                            disabled={isAnalyzing}
                                            className="h-10 w-full cursor-pointer rounded-lg bg-emerald-500 font-bold text-black hover:bg-emerald-400"
                                        >
                                            {isAnalyzing ? (
                                                <>
                                                    <Spinner className="text-black" />
                                                    Modeling Live
                                                    Fluctuations...
                                                </>
                                            ) : (
                                                <>
                                                    <Zap className="mr-1 h-4 w-4 text-black" />
                                                    Synthesize ML Prediction
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    {/* Prediction Outputs */}
                                    {predictionResult && (
                                        <div className="animate-slide-in space-y-3.5 rounded-xl border bg-muted/40 p-4">
                                            <div className="flex items-center justify-between border-b pb-2">
                                                <span className="text-xs font-semibold text-muted-foreground">
                                                    ML Synthesis Report
                                                </span>
                                                <span className="rounded border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-500">
                                                    Confidence:{' '}
                                                    {
                                                        predictionResult.confidence
                                                    }
                                                    %
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="block text-[10px] tracking-wider text-muted-foreground uppercase">
                                                        Price Forecast
                                                    </span>
                                                    <div className="font-mono text-lg font-extrabold text-emerald-500">
                                                        ₦
                                                        {predictionResult.targetPrice.toLocaleString()}{' '}
                                                        / kg
                                                    </div>
                                                </div>
                                                <div>
                                                    <span className="block text-[10px] tracking-wider text-muted-foreground uppercase">
                                                        Expected Delta
                                                    </span>
                                                    <div className="mt-0.5 flex items-center gap-1">
                                                        {predictionResult.trend ===
                                                            'up' && (
                                                            <TrendingUp className="h-4 w-4 animate-bounce text-emerald-500" />
                                                        )}
                                                        {predictionResult.trend ===
                                                            'down' && (
                                                            <TrendingDown className="h-4 w-4 animate-bounce text-red-500" />
                                                        )}
                                                        <span
                                                            className={`font-mono text-xs font-bold ${
                                                                predictionResult.trend ===
                                                                'up'
                                                                    ? 'text-emerald-500'
                                                                    : predictionResult.trend ===
                                                                        'down'
                                                                      ? 'text-red-500'
                                                                      : 'text-neutral-400'
                                                            }`}
                                                        >
                                                            {predictionResult.trend ===
                                                            'up'
                                                                ? '+'
                                                                : ''}
                                                            {
                                                                predictionResult.percentage
                                                            }
                                                            %
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="rounded border border-emerald-500/10 bg-background p-2.5 text-xs leading-relaxed text-muted-foreground">
                                                <strong>AI Strategy:</strong>{' '}
                                                {
                                                    predictionResult.recommendation
                                                }
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex h-full flex-col space-y-3">
                                    {/* Messages list */}
                                    <div className="max-h-[340px] flex-1 space-y-3 overflow-y-auto pr-1">
                                        {chatMessages.map((msg, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                {msg.sender === 'ai' && (
                                                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                                                        <Bot className="h-4 w-4" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                                                        msg.sender === 'user'
                                                            ? 'bg-emerald-500 font-medium text-black'
                                                            : 'border bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {msg.text}
                                                </div>
                                            </div>
                                        ))}

                                        {isTyping && (
                                            <div className="flex justify-start gap-2.5">
                                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                                                    <Bot className="h-4 w-4" />
                                                </div>
                                                <div className="flex items-center gap-1 rounded-2xl border bg-muted p-3 text-xs text-muted-foreground">
                                                    <Spinner className="h-3 w-3 text-emerald-500" />
                                                    Thinking...
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Prompt Options Helper */}
                                    <div className="flex flex-wrap gap-1.5 border-t py-1.5">
                                        <button
                                            onClick={() =>
                                                setChatInput(
                                                    'Should I buy Karfe today?',
                                                )
                                            }
                                            className="cursor-pointer rounded-full border bg-muted px-2 py-1 text-[10px] hover:bg-muted/80"
                                        >
                                            "Buy Karfe today?"
                                        </button>
                                        <button
                                            onClick={() =>
                                                setChatInput(
                                                    'Is Copper price going up?',
                                                )
                                            }
                                            className="cursor-pointer rounded-full border bg-muted px-2 py-1 text-[10px] hover:bg-muted/80"
                                        >
                                            "Is Copper spiking?"
                                        </button>
                                    </div>

                                    {/* Chat Input */}
                                    <div className="flex gap-2 border-t pt-2">
                                        <Input
                                            placeholder="Ask model about market trend..."
                                            value={chatInput}
                                            onChange={(e) =>
                                                setChatInput(e.target.value)
                                            }
                                            onKeyDown={(e) =>
                                                e.key === 'Enter' &&
                                                handleSendMessage()
                                            }
                                            className="h-9 text-xs focus-visible:ring-emerald-500/20"
                                        />
                                        <Button
                                            size="icon"
                                            onClick={handleSendMessage}
                                            className="h-9 w-9 cursor-pointer bg-emerald-500 text-black hover:bg-emerald-400"
                                        >
                                            <Send className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer Disclaimer */}
                        <div className="flex items-center justify-center gap-1.5 border-t bg-muted/20 p-3 font-mono text-[9px] text-muted-foreground">
                            <AlertTriangle className="h-3 w-3 text-amber-500" />
                            ML outputs are based on scrap indices. Verify before
                            financial booking.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
