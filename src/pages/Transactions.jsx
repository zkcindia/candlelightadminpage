import React, { useState } from 'react';
import {
  CreditCardIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CurrencyRupeeIcon,
  CalendarIcon,
  UserIcon,
  BanknotesIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  ArrowPathIcon,
  EyeIcon,
//   DownloadIcon,
  ArrowDownTrayIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

export default function Transactions() {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'received', 'paid'

  // Mock Transaction Data
  const transactions = [
    {
      id: 1,
      type: 'received',
      amount: 350,
      from: 'Rahul Sharma',
      purpose: 'Course Enrollment - Mathematics',
      date: '2024-07-23 10:30 AM',
      status: 'completed',
      transactionId: 'TXN-001234',
    },
    {
      id: 2,
      type: 'paid',
      amount: 5000,
      to: 'Dr. Rahul Sharma',
      purpose: 'Teacher Payout - July 2024',
      date: '2024-07-22 03:15 PM',
      status: 'completed',
      transactionId: 'TXN-001235',
    },
    {
      id: 3,
      type: 'received',
      amount: 350,
      from: 'Priya Patel',
      purpose: 'Course Enrollment - Physics',
      date: '2024-07-22 11:45 AM',
      status: 'pending',
      transactionId: 'TXN-001236',
    },
    {
      id: 4,
      type: 'paid',
      amount: 2500,
      to: 'Agent Suresh',
      purpose: 'Referral Commission - June 2024',
      date: '2024-07-21 09:00 AM',
      status: 'failed',
      transactionId: 'TXN-001237',
    },
    {
      id: 5,
      type: 'received',
      amount: 350,
      from: 'Amit Kumar',
      purpose: 'Course Enrollment - Chemistry',
      date: '2024-07-21 02:20 PM',
      status: 'completed',
      transactionId: 'TXN-001238',
    },
    {
      id: 6,
      type: 'received',
      amount: 700,
      from: 'Sneha Reddy',
      purpose: 'Course Enrollment - Biology (2 Students)',
      date: '2024-07-20 04:00 PM',
      status: 'pending',
      transactionId: 'TXN-001239',
    },
    {
      id: 7,
      type: 'paid',
      amount: 5000,
      to: 'Prof. Priya Patel',
      purpose: 'Teacher Payout - July 2024',
      date: '2024-07-20 10:30 AM',
      status: 'completed',
      transactionId: 'TXN-001240',
    },
    {
      id: 8,
      type: 'received',
      amount: 1050,
      from: 'Vikram Singh',
      purpose: 'Course Enrollment - History (3 Students)',
      date: '2024-07-19 01:15 PM',
      status: 'completed',
      transactionId: 'TXN-001241',
    },
    {
      id: 9,
      type: 'paid',
      amount: 3000,
      to: 'Agent Priya',
      purpose: 'Referral Commission - July 2024',
      date: '2024-07-18 11:00 AM',
      status: 'completed',
      transactionId: 'TXN-001242',
    },
    {
      id: 10,
      type: 'received',
      amount: 350,
      from: 'Arjun Reddy',
      purpose: 'Course Enrollment - Computer Science',
      date: '2024-07-18 09:30 AM',
      status: 'completed',
      transactionId: 'TXN-001243',
    },
  ];

  // Balance Summary
  const summary = {
    balance: 24500,
    totalReceived: 38500,
    totalPaid: 14000,
    pendingReceived: 1050,
    completedReceived: 37450,
    completedPaid: 14000,
  };

  // Filter Transactions
  const getFilteredTransactions = () => {
    let filtered = transactions;

    // Search filter
    if (search) {
      filtered = filtered.filter(t =>
        t.from?.toLowerCase().includes(search.toLowerCase()) ||
        t.to?.toLowerCase().includes(search.toLowerCase()) ||
        t.purpose.toLowerCase().includes(search.toLowerCase()) ||
        t.transactionId.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Tab filter
    if (activeTab === 'received') {
      filtered = filtered.filter(t => t.type === 'received');
    } else if (activeTab === 'paid') {
      filtered = filtered.filter(t => t.type === 'paid');
    }

    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
    };
    return styles[status] || styles.pending;
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
    if (status === 'pending') return <ClockIcon className="w-4 h-4 text-yellow-600" />;
    return <XCircleIcon className="w-4 h-4 text-red-600" />;
  };

  const getTypeIcon = (type) => {
    if (type === 'received') return <ArrowDownIcon className="w-4 h-4 text-green-600" />;
    return <ArrowUpIcon className="w-4 h-4 text-red-600" />;
  };

  // Received Transactions
  const receivedTransactions = transactions.filter(t => t.type === 'received');
  const paidTransactions = transactions.filter(t => t.type === 'paid');

  return (
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <CreditCardIcon className="w-8 h-8 text-blue-600" />
            Transactions
          </h1>
          <p className="text-gray-500 text-sm mt-1">View all your financial transactions</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md">
            <ArrowDownTrayIcon className="w-5 h-5" />
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-sm hover:shadow-md">
            <ArrowPathIcon className="w-5 h-5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Balance</p>
              <p className="text-2xl font-bold mt-1">₹{summary.balance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <BanknotesIcon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Received</p>
              <p className="text-2xl font-bold mt-1">₹{summary.totalReceived.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <ArrowDownIcon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-5 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Paid</p>
              <p className="text-2xl font-bold mt-1">₹{summary.totalPaid.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <ArrowUpIcon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-5 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Pending Received</p>
              <p className="text-2xl font-bold mt-1">₹{summary.pendingReceived.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <ClockIcon className="w-6 h-6" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Separate Sections: Received & Paid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Received Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 rounded-xl p-4 border border-green-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ArrowDownIcon className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-green-800">Received</p>
                <p className="text-xs text-green-600">Total: {receivedTransactions.length} transactions</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-green-700">₹{summary.totalReceived.toLocaleString()}</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-white/60 rounded-lg px-3 py-1.5 text-center">
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-sm font-bold text-green-600">₹{summary.completedReceived.toLocaleString()}</p>
            </div>
            <div className="bg-white/60 rounded-lg px-3 py-1.5 text-center">
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-sm font-bold text-yellow-600">₹{summary.pendingReceived.toLocaleString()}</p>
            </div>
          </div>
        </motion.div>

        {/* Paid Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-red-50 rounded-xl p-4 border border-red-200"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ArrowUpIcon className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-800">Paid</p>
                <p className="text-xs text-red-600">Total: {paidTransactions.length} transactions</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-red-700">₹{summary.totalPaid.toLocaleString()}</p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-white/60 rounded-lg px-3 py-1.5 text-center">
              <p className="text-xs text-gray-500">Completed</p>
              <p className="text-sm font-bold text-green-600">₹{summary.completedPaid.toLocaleString()}</p>
            </div>
            <div className="bg-white/60 rounded-lg px-3 py-1.5 text-center">
              <p className="text-xs text-gray-500">Failed</p>
              <p className="text-sm font-bold text-red-600">₹0</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'all'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          All Transactions
        </button>
        <button
          onClick={() => setActiveTab('received')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'received'
              ? 'border-green-500 text-green-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Received
        </button>
        <button
          onClick={() => setActiveTab('paid')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-all ${
            activeTab === 'paid'
              ? 'border-red-500 text-red-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Paid
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, purpose, or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
        >
          <option value="all">All Transactions</option>
          <option value="received">Received</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTransactions.map((transaction, index) => (
                <motion.tr
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === 'received' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {getTypeIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.type === 'received' ? 'Received from' : 'Paid to'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {transaction.type === 'received' ? transaction.from : transaction.to}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`text-sm font-bold ${
                      transaction.type === 'received' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'received' ? '+' : '-'} ₹{transaction.amount.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-900 max-w-[200px] truncate">{transaction.purpose}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-sm text-gray-600">{transaction.date}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      {getStatusIcon(transaction.status)}
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusBadge(transaction.status)}`}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-xs text-gray-400 font-mono">{transaction.transactionId}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <CreditCardIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}