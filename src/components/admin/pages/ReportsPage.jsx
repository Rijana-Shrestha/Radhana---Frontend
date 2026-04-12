import React, { useEffect, useState } from 'react'
import { PieChart, BarChart3, TrendingUp, AlertCircle, Loader } from 'lucide-react'
import { axiosInstance } from '../../../utils/axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Pie, Bar } from 'react-chartjs-2'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
)

const ReportsPage = () => {
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch reports data from backend
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true)
        setError('')
        const response = await axiosInstance.get('/admin/reports/summary')
        setReportData(response.data)
      } catch (err) {
        console.error('Error fetching reports:', err)
        setError(err.response?.data?.message || 'Failed to fetch reports data')
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='text-center'>
          <Loader className='w-12 h-12 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600 font-semibold'>Loading analytics...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto mt-8'>
        <div className='flex items-center gap-3 mb-3'>
          <AlertCircle className='w-6 h-6 text-red-600' />
          <h3 className='text-lg font-bold text-red-800'>Error Loading Reports</h3>
        </div>
        <p className='text-red-700'>{error}</p>
        <button
          onClick={() => window.location.reload()}
          className='mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition'
        >
          Retry
        </button>
      </div>
    )
  }

  // No data state
  if (!reportData) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500 text-lg'>No data available</p>
      </div>
    )
  }

  // Extract data
  const totalRevenue = reportData.totalRevenue || 0
  const totalOrders = reportData.totalOrders || 0
  const ordersByStatus = reportData.ordersByStatus || []

  // Calculate delivered orders
  const deliveredOrder = ordersByStatus.find(
    (order) => order._id.toLowerCase() === 'delivered'
  )
  const deliveredCount = deliveredOrder?.count || 0

  // Prepare Pie Chart Data for Order Status
  const pieChartData = {
    labels: ordersByStatus.map((status) =>
      status._id.charAt(0).toUpperCase() + status._id.slice(1)
    ),
    datasets: [
      {
        label: 'Orders by Status',
        data: ordersByStatus.map((status) => status.count),
        backgroundColor: [
          '#3B82F6', // Blue - Pending
          '#10B981', // Green - Delivered
          '#EF4444', // Red - Cancelled
          '#F59E0B', // Amber - Processing
        ],
        borderColor: [
          '#1E40AF',
          '#047857',
          '#DC2626',
          '#D97706',
        ],
        borderWidth: 2,
      },
    ],
  }

  // Prepare Bar Chart Data for Revenue and Orders
  const barChartData = {
    labels: ['Revenue', 'Total Orders'],
    datasets: [
      {
        label: 'Revenue (₹)',
        data: [totalRevenue, 0],
        backgroundColor: '#3B82F6',
        borderColor: '#1E40AF',
        borderWidth: 1,
      },
      {
        label: 'Total Orders',
        data: [0, totalOrders],
        backgroundColor: '#10B981',
        borderColor: '#047857',
        borderWidth: 1,
      },
    ],
  }

  // Chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { size: 12 },
          padding: 15,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        titleFont: { size: 14 },
        bodyFont: { size: 12 },
      },
    },
  }

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        ...chartOptions.plugins.legend,
        position: 'bottom',
      },
    },
  }

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='mb-8'>
        <h1 className='text-4xl font-bold text-gray-800 flex items-center gap-3'>
          <BarChart3 className='w-8 h-8 text-blue-600' />
          Analytics & Reports
        </h1>
        <p className='text-gray-600 mt-2'>Dashboard analytics and business insights</p>
      </div>

      {/* KPI Cards Section */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        {/* Total Revenue Card */}
        <div className='bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-lg p-6 border border-blue-200'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-gray-700 font-semibold text-lg'>Total Revenue</h3>
            <TrendingUp className='w-6 h-6 text-blue-600' />
          </div>
          <p className='text-4xl font-bold text-blue-900'>
            ₹{totalRevenue.toLocaleString('en-IN')}
          </p>
          <p className='text-sm text-blue-700 mt-2'>Overall revenue generated</p>
        </div>

        {/* Total Orders Card */}
        <div className='bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-lg p-6 border border-green-200'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-gray-700 font-semibold text-lg'>Total Orders</h3>
            <BarChart3 className='w-6 h-6 text-green-600' />
          </div>
          <p className='text-4xl font-bold text-green-900'>{totalOrders.toLocaleString()}</p>
          <p className='text-sm text-green-700 mt-2'>All orders combined</p>
        </div>

        {/* Delivered Orders Card */}
        <div className='bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg shadow-lg p-6 border border-purple-200'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-gray-700 font-semibold text-lg'>Delivered</h3>
            <PieChart className='w-6 h-6 text-purple-600' />
          </div>
          <p className='text-4xl font-bold text-purple-900'>{deliveredCount.toLocaleString()}</p>
          <p className='text-sm text-purple-700 mt-2'>Successfully delivered orders</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        {/* Pie Chart - Order Status Distribution */}
        <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-200'>
          <div className='mb-6'>
            <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
              <PieChart className='w-5 h-5 text-blue-600' />
              Order Status Distribution
            </h2>
            <p className='text-gray-600 text-sm mt-1'>Breakdown of orders by status</p>
          </div>

          {ordersByStatus.length > 0 ? (
            <div className='relative h-80'>
              <Pie data={pieChartData} options={pieOptions} />
            </div>
          ) : (
            <div className='text-center py-16 text-gray-500'>
              <p>No order status data available</p>
            </div>
          )}
        </div>

        {/* Bar Chart - Revenue vs Orders */}
        <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-200'>
          <div className='mb-6'>
            <h2 className='text-xl font-bold text-gray-800 flex items-center gap-2'>
              <BarChart3 className='w-5 h-5 text-green-600' />
              Revenue & Orders Overview
            </h2>
            <p className='text-gray-600 text-sm mt-1'>Total revenue and order count comparison</p>
          </div>

          <div className='relative h-80'>
            <Bar
              data={barChartData}
              options={{
                ...chartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Amount / Count' },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Summary Stats Table */}
      <div className='bg-white rounded-lg shadow-lg p-6 border border-gray-200'>
        <h2 className='text-xl font-bold text-gray-800 mb-6'>Order Status Summary</h2>

        {ordersByStatus.length > 0 ? (
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead>
                <tr className='bg-gray-100 border-b-2 border-gray-300'>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
                    Count
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
                    Percentage
                  </th>
                  <th className='px-6 py-3 text-left text-sm font-semibold text-gray-700'>
                    Visual
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordersByStatus.map((status, index) => {
                  const percentage = ((status.count / totalOrders) * 100).toFixed(1)
                  const colors = [
                    'bg-blue-500',
                    'bg-green-500',
                    'bg-red-500',
                    'bg-amber-500',
                  ]

                  return (
                    <tr key={index} className='border-b border-gray-200 hover:bg-gray-50'>
                      <td className='px-6 py-4 text-sm font-medium text-gray-900 capitalize'>
                        {status._id}
                      </td>
                      <td className='px-6 py-4 text-sm font-semibold text-gray-700'>
                        {status.count}
                      </td>
                      <td className='px-6 py-4 text-sm text-gray-600'>{percentage}%</td>
                      <td className='px-6 py-4'>
                        <div className='w-full bg-gray-200 rounded-full h-2'>
                          <div
                            className={`${colors[index % colors.length]} h-2 rounded-full transition-all duration-300`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className='text-center py-8 text-gray-500'>
            <p>No order status data available</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className='bg-blue-50 border border-blue-200 rounded-lg p-6 text-center'>
        <p className='text-blue-900 text-sm'>
          📊 This dashboard displays real-time analytics data from your business metrics.
        </p>
        <p className='text-blue-700 text-xs mt-2'>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  )
}

export default ReportsPage
