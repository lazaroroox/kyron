import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowUpCircle, ArrowDownCircle, Users, Mail, Lock, Calculator } from 'lucide-react';
import { traderNames, tradingCategories, getAllTradingPairs } from './data/traders';
import { auth } from './lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import toast from 'react-hot-toast';

interface TraderResult {
  trader: string;
  profit: string;
}

interface ProjectionDetail {
  title: string;
  bankRange: string;
  daily: string;
  weekly: string;
  monthly: string;
}

interface SignalNotification {
  type: 'buy' | 'sell';
  message: string;
  timestamp: number;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [showPreSignalAlert, setShowPreSignalAlert] = useState(false);
  const [buySignal, setBuySignal] = useState(50);
  const [sellSignal, setSellSignal] = useState(50);
  const [selectedCategory, setSelectedCategory] = useState('CRIPTOS');
  const [selectedPair, setSelectedPair] = useState(tradingCategories.CRIPTOS[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('M5');
  const [traderResults, setTraderResults] = useState<TraderResult[]>([]);
  const [notifications, setNotifications] = useState<SignalNotification[]>([]);
  const [bankValue, setBankValue] = useState<string>('1000');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const calculateEntryValue = (signal: number): string => {
    const bankNumeric = parseFloat(bankValue.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    let percentage = 0;

    if (signal >= 85) {
      percentage = 0.10; // 10%
    } else if (signal >= 70) {
      percentage = 0.05; // 5%
    } else if (signal > 50) {
      percentage = 0.02; // 2%
    }

    const entryValue = bankNumeric * percentage;
    return entryValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatCurrency = (value: string): string => {
    value = value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    return `R$ ${value}`;
  };

  const handleBankValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value === '') {
      setBankValue('0');
      return;
    }
    setBankValue(formatCurrency(value));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer logout');
    }
  };

  const projectionDetails: ProjectionDetail[] = [
    {
      title: "Projeção de lucro futura",
      bankRange: "Banca de R$200,00 a R$400,00",
      daily: "Entre R$20,00 e R$120,00",
      weekly: "Entre R$140,00 e R$840,00",
      monthly: "Entre R$600,00 e R$3.600,00"
    },
    {
      title: "Projeção futura de banca",
      bankRange: "Banca de R$450,00 a R$900,00",
      daily: "Entre R$45,00 e R$270,00",
      weekly: "Entre R$315,00 e R$1.890,00",
      monthly: "Entre R$1.350,00 e R$8.100,00"
    },
    {
      title: "Projeção futura de banca",
      bankRange: "Banca de R$950,00 a R$2.000,00",
      daily: "Entre R$95,00 e R$600,00",
      weekly: "Entre R$665,00 e R$4.200,00",
      monthly: "Entre R$2.850,00 e R$18.000,00"
    },
    {
      title: "Projeção de banca",
      bankRange: "Banca acima de R$3.000,00",
      daily: "Entre R$300,00 e R$900,00",
      weekly: "Entre R$2.100,00 e R$6.300,00",
      monthly: "Entre R$9.000,00 e R$27.000,00"
    }
  ];

  const timeframes = [
    { value: 'M1', label: '1 minuto' },
    { value: 'M5', label: '5 minutos' },
    { value: 'M15', label: '15 minutos' }
  ];

  const getConfidenceLevel = (signal: number) => {
    if (signal <= 50) return '';
    if (signal <= 69) return 'Baixa';
    if (signal <= 84) return 'Média';
    return 'Alta';
  };

  const getSignalStrength = (signal: number) => {
    if (signal <= 50) return '';
    if (signal <= 69) return 'Baixo';
    if (signal <= 84) return 'Médio';
    return 'Forte';
  };

  const generateRandomProfit = () => {
    const min = 1373;
    const max = 378530;
    const profit = Math.floor(Math.random() * (max - min + 1) + min) / 100;
    return profit.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const generateTraderResult = () => {
    const trader = traderNames[Math.floor(Math.random() * traderNames.length)];
    const profit = generateRandomProfit();
    return { trader, profit };
  };

  const addNotification = (type: 'buy' | 'sell', message: string) => {
    const notification: SignalNotification = {
      type,
      message,
      timestamp: Date.now()
    };
    
    setNotifications(prev => [...prev, notification]);
    
    const timeout = Math.floor(Math.random() * (11000 - 4000) + 4000);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.timestamp !== notification.timestamp));
    }, timeout);
  };

  useEffect(() => {
    const initialResults = Array.from({ length: 10 }, generateTraderResult);
    setTraderResults(initialResults);

    const interval = setInterval(() => {
      const newResults = Array.from({ length: 10 }, generateTraderResult);
      setTraderResults(newResults);
    }, 600000);

    return () => clearInterval(interval);
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setSelectedCategory(newCategory);
    setSelectedPair(tradingCategories[newCategory as keyof typeof tradingCategories][0]);
    setBuySignal(50);
    setSellSignal(50);
    setShowAlert(false);
    setShowPreSignalAlert(false);
  };

  const handlePairChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedPair(e.target.value);
    setBuySignal(50);
    setSellSignal(50);
    setShowAlert(false);
    setShowPreSignalAlert(false);
  };

  const handleTimeframeChange = (value: string) => {
    setSelectedTimeframe(value);
    setBuySignal(50);
    setSellSignal(50);
    setShowAlert(false);
    setShowPreSignalAlert(false);
  };

  const generateBalancedSignals = () => {
    const baseSignal = Math.floor(Math.random() * (70 - 30 + 1)) + 30;
    const isBuyStronger = Math.random() > 0.5;
    const boost = Math.floor(Math.random() * 31);
    
    if (isBuyStronger) {
      const newBuySignal = baseSignal + boost;
      const newSellSignal = 100 - newBuySignal;
      return { buySignal: newBuySignal, sellSignal: newSellSignal };
    } else {
      const newSellSignal = baseSignal + boost;
      const newBuySignal = 100 - newSellSignal;
      return { buySignal: newBuySignal, sellSignal: newSellSignal };
    }
  };

  useEffect(() => {
    const checkTimeAndGenerateSignal = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const minutes = now.getMinutes();

      let shouldGenerateSignal = false;
      let shouldShowPreSignal = false;

      switch (selectedTimeframe) {
        case 'M1':
          shouldShowPreSignal = seconds === 50;
          shouldGenerateSignal = seconds === 55;
          break;
        case 'M5':
          shouldShowPreSignal = seconds === 50 && (minutes + 1) % 5 === 0;
          shouldGenerateSignal = seconds === 0 && minutes % 5 === 0;
          break;
        case 'M15':
          shouldShowPreSignal = seconds === 50 && (minutes + 1) % 15 === 0;
          shouldGenerateSignal = seconds === 0 && minutes % 15 === 0;
          break;
      }

      if (shouldShowPreSignal) {
        setShowPreSignalAlert(true);
        setTimeout(() => setShowPreSignalAlert(false), 5000);
      }

      if (shouldGenerateSignal) {
        const { buySignal: newBuySignal, sellSignal: newSellSignal } = generateBalancedSignals();
        
        setBuySignal(newBuySignal);
        setSellSignal(newSellSignal);

        if (newBuySignal > 70) {
          addNotification('buy', `Oportunidade de COMPRA em ${selectedPair} - Força: ${getSignalStrength(newBuySignal)}`);
        }
        
        if (newSellSignal > 70) {
          addNotification('sell', `Oportunidade de VENDA em ${selectedPair} - Força: ${getSignalStrength(newSellSignal)}`);
        }

        if (Math.random() > 0.7) {
          setShowAlert(true);
          setTimeout(() => setShowAlert(false), 3000);
        }
      }
    };

    const interval = setInterval(checkTimeAndGenerateSignal, 1000);
    return () => clearInterval(interval);
  }, [selectedTimeframe, selectedPair]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-white text-center mb-8">KYRON</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 pl-10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg py-2 px-4 hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">KYRON</h1>
          <button className="bg-green-600 text-white rounded-lg py-2 px-4 hover:bg-green-700 transition-colors">
            Grupo Gratuito
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white rounded-lg py-2 px-4 hover:bg-red-700 transition-colors"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="h-6 w-6 text-blue-400" />
            <h2 className="text-xl font-bold">Cálculo de Entrada</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Valor da Banca
              </label>
              <input
                type="text"
                value={bankValue}
                onChange={handleBankValueChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="R$ 0,00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Entrada Sugerida
              </label>
              <div className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-blue-400 font-bold">
                {calculateEntryValue(Math.max(buySignal, sellSignal))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-400 mb-2">Categoria</label>
              <select 
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(tradingCategories).map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-400 mb-2">Ativo</label>
              <select 
                value={selectedPair}
                onChange={handlePairChange}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {tradingCategories[selectedCategory as keyof typeof tradingCategories].map(pair => (
                  <option key={pair} value={pair}>{pair}</option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-400 mb-2">Timeframe</label>
              <div className="grid grid-cols-3 gap-2">
                {timeframes.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => handleTimeframeChange(value)}
                    className={`p-2 rounded-lg font-medium transition-colors ${
                      selectedTimeframe === value 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="fixed top-4 right-4 z-50 space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.timestamp}
              className={`p-4 rounded-lg shadow-lg animate-fade-in ${
                notification.type === 'buy' 
                  ? 'bg-green-500/20 border border-green-500/50' 
                  : 'bg-red-500/20 border border-red-500/50'
              }`}
            >
              <div className="flex items-center gap-2">
                {notification.type === 'buy' ? (
                  <ArrowUpCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <ArrowDownCircle className="h-5 w-5 text-red-400" />
                )}
                <span className="font-bold">{notification.message}</span>
              </div>
            </div>
          ))}
        </div>

        {showPreSignalAlert && (
          <div className="bg-yellow-500 text-white p-4 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>Movimento de entrada significativo em {selectedPair}!</span>
            </div>
          </div>
        )}

        {showAlert && (
          <div className="bg-red-500 text-white p-4 rounded-lg mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              <span>Movimento significativo detectado em {selectedPair}!</span>
            </div>
            <button 
              onClick={() => setShowAlert(false)}
              className="text-white hover:text-gray-200"
            >
              ×
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 lg:gap-8 mb-8">
          <div className={`rounded-lg shadow-lg overflow-hidden ${buySignal > 51 ? 'bg-green-600' : 'bg-gray-800'}`}>
            <div className="p-4 lg:p-6 flex items-center justify-between border-b border-green-500">
              <h2 className="text-lg lg:text-2xl font-bold">Sinal de Compra</h2>
              <ArrowUpCircle className="h-8 w-8 lg:h-10 lg:w-10" />
            </div>
            <div className="p-4 lg:p-6">
              <div className="text-center">
                <div className="text-4xl lg:text-7xl font-bold mb-4">{buySignal}%</div>
                <div className="bg-green-900/30 rounded-full h-4 mb-4 overflow-hidden">
                  <div 
                    className="h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${buySignal}%`,
                      background: 'linear-gradient(90deg, rgba(34,197,94,0.2) 0%, rgba(34,197,94,1) 100%)',
                      boxShadow: '0 0 10px rgba(34,197,94,0.5)'
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 lg:gap-4 text-sm">
                  <div className="bg-green-700/30 rounded p-2">
                    <div className="font-medium text-xs lg:text-sm">Força do Sinal</div>
                    <div className="text-base lg:text-xl font-bold">{getSignalStrength(buySignal)}</div>
                  </div>
                  <div className="bg-green-700/30 rounded p-2">
                    <div className="font-medium text-xs lg:text-sm">Confiança</div>
                    <div className="text-base lg:text-xl font-bold">{getConfidenceLevel(buySignal)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-lg shadow-lg overflow-hidden ${sellSignal > 51 ? 'bg-red-600' : 'bg-gray-800'}`}>
            <div className="p-4 lg:p-6 flex items-center justify-between border-b border-red-500">
              <h2 className="text-lg lg:text-2xl font-bold">Sinal de Venda</h2>
              <ArrowDownCircle className="h-8 w-8 lg:h-10 lg:w-10" />
            </div>
            <div className="p-4 lg:p-6">
              <div className="text-center">
                <div className="text-4xl lg:text-7xl font-bold mb-4">{sellSignal}%</div>
                <div className="bg-red-900/30 rounded-full h-4 mb-4 overflow-hidden">
                  <div 
                    className="h-4 rounded-full transition-all duration-500"
                    style={{
                      width: `${sellSignal}%`,
                      background: 'linear-gradient(90deg, rgba(239,68,68,0.2) 0%, rgba(239,68,68,1) 100%)',
                      boxShadow: '0 0 10px rgba(239,68,68,0.5)'
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 lg:gap-4 text-sm">
                  <div className="bg-red-700/30 rounded p-2">
                    <div className="font-medium text-xs lg:text-sm">Força do Sinal</div>
                    <div className="text-base lg:text-xl font-bold">{getSignalStrength(sellSignal)}</div>
                  </div>
                  <div className="bg-red-700/30 rounded p-2">
                    <div className="font-medium text-xs lg:text-sm">Confiança</div>
                    <div className="text-base lg:text-xl font-bold">{getConfidenceLevel(sellSignal)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <iframe src="https://plataforma.kyron.space/register" style={{width: "100%",height: "650px"}}/>

        

        
      </main>
    </div>
  );
}

export default App;