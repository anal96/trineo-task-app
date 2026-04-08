import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Trash2, 
  ChevronLeft,
  IndianRupee,
  Calendar,
  X,
  Upload,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { financeAPI, projectsAPI, API_BASE } from "../../services/api";

interface FinanceScreenProps {
  onBack: () => void;
}

export function FinanceScreen({ onBack }: FinanceScreenProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({ income: 0, expense: 0, profit: 0 });
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    amount: '',
    type: 'expense',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    projectId: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<any | null>(null);

  useEffect(() => {
    loadData();
    loadProjects();
  }, []);

  const loadData = async (filters = {}, isManualRefresh = false) => {
    try {
      // Check cache first to avoid loading spinner
      if (!isManualRefresh) {
        const cached = localStorage.getItem('trineo_cache_/financeGET');
        if (cached) {
          const data = JSON.parse(cached);
          setTransactions(data.transactions);
          setStats(data.stats);
          setLoading(false);
          // Still fetch in background to get latest
        } else {
          setLoading(true);
        }
      } else {
        setLoading(true);
      }

      const data = await financeAPI.getTransactions(filters);
      setTransactions(data.transactions);
      setStats(data.stats);
    } catch (error) {
      console.error('Error loading finance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const data = await projectsAPI.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (selectedFile) {
        data.append('bill', selectedFile);
      }

      await financeAPI.createTransaction(data);
      setMessage({ type: 'success', text: 'Transaction added successfully!' });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        amount: '',
        type: 'expense',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
        projectId: ''
      });
      setSelectedFile(null);
      
      // Refresh data
      loadData();
      
      // Close modal after delay
      setTimeout(() => {
        setShowAddModal(false);
        setMessage(null);
      }, 1500);
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to add transaction' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await financeAPI.deleteTransaction(id);
      loadData();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-[#F8FAFC] dark:from-[#0F172A] to-[#EFF6FF] dark:to-[#1E293B] overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#1E293B]/80 backdrop-blur-2xl px-6 pt-10 pb-8 shadow-sm border-b border-white/20 dark:border-[#334155]/30 sticky top-0 z-30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#334155] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#475569] transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">Finance</h1>
              <p className="text-[#64748B] dark:text-[#94A3B8] text-xs font-medium">Expenses & Income Management</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E40AF] to-[#2563EB] text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 pb-24">
        {/* Statistics Cards */}
        <div className="bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] rounded-[38px] p-8 shadow-[0_25px_50px_-12px_rgba(30,64,175,0.4)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform duration-700 group-hover:scale-110"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/20 rounded-full blur-[80px] -ml-32 -mb-32 transition-transform duration-700 group-hover:scale-110"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/80 text-xs font-bold uppercase tracking-[2px]">Total Profit</p>
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Wallet className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-white text-4xl font-black mb-10 tracking-tight">
              ₹{stats.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-lg rounded-[24px] p-5 border border-white/10 transition-colors hover:bg-white/15">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-green-400/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-300" />
                  </div>
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-wider">Income</span>
                </div>
                <p className="text-white text-2xl font-black">₹{stats.income.toLocaleString()}</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-lg rounded-[24px] p-5 border border-white/10 transition-colors hover:bg-white/15">
                <div className="flex items-center gap-3 mb-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-400/20 flex items-center justify-center">
                    <TrendingDown className="w-5 h-5 text-red-300" />
                  </div>
                  <span className="text-white/60 text-[10px] font-black uppercase tracking-wider">Expense</span>
                </div>
                <p className="text-white text-2xl font-black">₹{stats.expense.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters/Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
            <input 
              type="text" 
              placeholder="Search transactions..."
              className="w-full bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB] transition-all dark:text-white"
            />
          </div>
          <button className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1E293B] border border-gray-200 dark:border-[#334155] flex items-center justify-center shadow-sm">
            <Filter className="w-5 h-5 text-[#64748B] dark:text-[#94A3B8]" />
          </button>
        </div>

        {/* Transaction List */}
        <div>
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-white">Recent Transactions</h3>
            <button className="text-[#2563EB] text-sm font-bold">View All</button>
          </div>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="w-10 h-10 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((t) => (
                <div 
                  key={t._id} 
                  onClick={() => setSelectedTransaction(t)}
                  className="bg-white dark:bg-[#1E293B] p-4 rounded-[28px] border border-gray-100 dark:border-[#334155]/50 shadow-sm active:scale-[0.98] transition-all flex items-center gap-4 cursor-pointer group"
                >
                  {/* Left: Icon */}
                  <div className="relative shrink-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      t.type === 'income' 
                        ? 'bg-green-100/50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                        : 'bg-red-100/50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}>
                      {t.type === 'income' ? <TrendingUp className="w-7 h-7" /> : <TrendingDown className="w-7 h-7" />}
                    </div>
                    {t.billUrl && (
                      <div 
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = t.billUrl.startsWith('http') ? t.billUrl : `${API_BASE}${t.billUrl}`;
                          window.open(url, '_blank');
                        }}
                        className="absolute -top-2 -right-2 w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-[#1E293B] animate-bounce-subtle cursor-pointer hover:scale-110 transition-transform"
                      >
                        <FileText className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Middle: Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[#0F172A] dark:text-white font-bold text-[15px] leading-snug break-words">
                      {t.title}
                    </h4>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md ${
                        t.type === 'income' 
                          ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                          : 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}>
                        {t.category}
                      </span>
                      <span className="text-[#94A3B8] text-[10px] flex items-center gap-1 font-bold">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        {new Date(t.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                      </span>
                      {t.description && (
                         <span className="text-gray-400 text-[10px] font-medium truncate max-w-[80px]">
                           {t.description}
                         </span>
                      )}
                      {t.billUrl && (
                        <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-800/20">
                          Proof Attached
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Amount */}
                  <div className="flex flex-col items-end shrink-0 pl-1">
                    <p className={`text-lg font-black tracking-tight ${
                      t.type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#1E293B] rounded-3xl p-12 text-center border border-dashed border-gray-300 dark:border-[#334155]">
              <div className="w-16 h-16 bg-gray-100 dark:bg-[#334155] rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-[#64748B] dark:text-[#94A3B8] font-bold">No transactions found</p>
              <p className="text-xs text-[#94A3B8] mt-1">Start tracking your finances by adding one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1E293B] w-full max-w-md rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="px-6 pt-6 flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-[#0F172A] dark:text-white">New Transaction</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-[#334155] flex items-center justify-center hover:bg-gray-200 dark:hover:bg-[#475569] transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 pb-40 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-2 bg-gray-100 dark:bg-[#334155] p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'income'})}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.type === 'income' 
                      ? 'bg-white dark:bg-[#1E293B] text-green-600 shadow-sm' 
                      : 'text-gray-500'
                  }`}
                >
                  INCOME
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, type: 'expense'})}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    formData.type === 'expense' 
                      ? 'bg-white dark:bg-[#1E293B] text-red-600 shadow-sm' 
                      : 'text-gray-500'
                  }`}
                >
                  EXPENSE
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Title</label>
                <input
                  required
                  type="text"
                  placeholder="What was this for?"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-[#0F172A] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#2563EB] dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Amount</label>
                  <div className="relative">
                    <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      required
                      type="number"
                      placeholder="0.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-[#0F172A] border-none rounded-2xl p-4 pl-10 text-sm focus:ring-2 focus:ring-[#2563EB] dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-[#0F172A] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#2563EB] dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-[#0F172A] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#2563EB] dark:text-white appearance-none"
                  >
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Sale">Sale</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Rent">Rent</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Travel">Travel</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Project (Link)</label>
                  <select
                    value={formData.projectId}
                    onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-[#0F172A] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#2563EB] dark:text-white appearance-none"
                  >
                    <option value="">None</option>
                    {projects.map(p => (
                      <option key={p._id} value={p._id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Description (Optional)</label>
                <textarea
                  placeholder="Add more details..."
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-gray-50 dark:bg-[#0F172A] border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-[#2563EB] dark:text-white resize-none h-20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Bill / Receipt Attachment</label>
                <div className="relative group">
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <div className={`w-full border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition-colors ${
                    selectedFile 
                      ? 'border-green-400 bg-green-50 dark:bg-green-900/10' 
                      : 'border-gray-200 dark:border-[#334155] group-hover:border-[#2563EB]'
                  }`}>
                    {selectedFile ? (
                      <>
                        <CheckCircle2 className="w-6 h-6 text-green-500 mb-1" />
                        <p className="text-[10px] text-green-600 font-bold truncate max-w-full px-4">{selectedFile.name}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-6 h-6 text-gray-400 mb-1" />
                        <p className="text-[10px] text-gray-500 font-bold">Tap to upload proof (PDF, JPG, PNG)</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {message && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                  message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  <p className="text-xs font-bold">{message.text}</p>
                </div>
              )}

              <button
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-[#1E40AF] to-[#2563EB] text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all disabled:opacity-50 mt-4"
              >
                {isSubmitting ? 'SAVING...' : 'ADD TRANSACTION'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#0F172A] w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-10 duration-300 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="relative h-40 flex items-center justify-center">
              <div className={`absolute inset-0 opacity-20 ${
                selectedTransaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <div className={`absolute inset-0 bg-gradient-to-b from-transparent to-white dark:to-[#0F172A]`}></div>
              
              <button 
                onClick={() => setSelectedTransaction(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 z-10"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-white" />
              </button>

              <div className={`relative z-10 w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl ${
                selectedTransaction.type === 'income' 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {selectedTransaction.type === 'income' ? <TrendingUp className="w-10 h-10" /> : <TrendingDown className="w-10 h-10" />}
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="px-8 pb-48 text-center -mt-4 relative z-10 overflow-y-auto flex-1">
              <h3 className="text-[#0F172A] dark:text-white text-2xl font-black leading-tight mb-2 uppercase tracking-wide">
                {selectedTransaction.title}
              </h3>
              <p className={`text-3xl font-black mb-8 tracking-tighter ${
                selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'
              }`}>
                {selectedTransaction.type === 'income' ? '+' : '-'}₹{selectedTransaction.amount.toLocaleString()}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-[#1E293B] p-4 rounded-3xl border border-gray-100 dark:border-[#334155]/50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[1.5px] mb-1">Category</p>
                  <p className="text-sm font-bold text-[#1E40AF] dark:text-blue-400">{selectedTransaction.category}</p>
                </div>
                <div className="bg-gray-50 dark:bg-[#1E293B] p-4 rounded-3xl border border-gray-100 dark:border-[#334155]/50">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-[1.5px] mb-1">Date</p>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {new Date(selectedTransaction.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                  </p>
                </div>
              </div>

              {selectedTransaction.description && (
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-6 rounded-[32px] mb-8 text-left border border-blue-100/50 dark:border-blue-800/20">
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[1.5px] mb-2">Description</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
                    {selectedTransaction.description}
                  </p>
                </div>
              )}

              {selectedTransaction.projectId && (
                <div className="flex items-center gap-3 mb-8 px-2">
                   <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600">
                     <FileText className="w-4 h-4" />
                   </div>
                   <div className="text-left">
                     <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Linked Project</p>
                     <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{selectedTransaction.projectId.name || 'Project'}</p>
                   </div>
                </div>
              )}

              <div className="flex flex-col gap-4">
                {selectedTransaction.billUrl ? (
                  <button 
                    onClick={() => {
                      const url = selectedTransaction.billUrl.startsWith('http') 
                        ? selectedTransaction.billUrl 
                        : `${API_BASE}${selectedTransaction.billUrl}`;
                      window.open(url, '_blank');
                    }}
                    className="w-full bg-indigo-600 dark:bg-indigo-500 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform active:scale-[0.98] transition-all"
                  >
                    <FileText className="w-5 h-5" />
                    OPEN ATTACHED BILL
                  </button>
                ) : (
                  <div className="w-full bg-gray-100 dark:bg-gray-800 text-gray-400 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 border border-dashed border-gray-300 dark:border-gray-700">
                    <FileText className="w-5 h-5 opacity-40" />
                    NO BILL ATTACHED
                  </div>
                )}
                
                <button 
                  onClick={() => {
                    handleDelete(selectedTransaction._id);
                    setSelectedTransaction(null);
                  }}
                  className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  DELETE TRANSACTION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
