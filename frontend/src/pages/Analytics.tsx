import { useAsync } from '@hooks/useAsync'
import { apiService } from '@services/apiService'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement } from 'chart.js'
import { Pie, Line, Bar } from 'react-chartjs-2'
import AnimatedCard from '@components/AnimatedCard'
import LoadingState from '@components/Common/LoadingState'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, BarElement)

export default function Analytics() {
  const { data: analytics, loading } = useAsync(() => apiService.getAnalyticsData())

  const productsByStatusData = analytics?.productsByStatus ? {
    labels: analytics.productsByStatus.map(item => item.status),
    datasets: [{
      data: analytics.productsByStatus.map(item => item.count),
      backgroundColor: [
        '#0ea5e9',
        '#a855f7',
        '#22c55e',
        '#f59e0b',
        '#ef4444'
      ],
      borderWidth: 0
    }]
  } : null

  const eventsByTypeData = analytics?.eventsByType ? {
    labels: analytics.eventsByType.map(item => item.eventType),
    datasets: [{
      label: 'Events',
      data: analytics.eventsByType.map(item => item.count),
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.1)',
      fill: true,
      tension: 0.4
    }]
  } : null

  const productsOverTimeData = analytics?.productsOverTime ? {
    labels: analytics.productsOverTime.map(item => item.date),
    datasets: [{
      label: 'Products',
      data: analytics.productsOverTime.map(item => item.count),
      borderColor: '#a855f7',
      backgroundColor: 'rgba(168, 85, 247, 0.1)',
      fill: true,
      tension: 0.4
    }]
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#9ca3af'
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151' }
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151' }
      }
    }
  }

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#9ca3af',
          padding: 20
        }
      }
    }
  }

  return (
    <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">
          Track supply chain metrics and product statistics
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <LoadingState text="Loading analytics..." />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Pie Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Products by Status */}
            <AnimatedCard>
              <h2 className="text-xl font-bold text-white mb-4">Products by Status</h2>
              {productsByStatusData ? (
                <div className="h-64">
                  <Pie data={productsByStatusData} options={pieOptions} />
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No data available</p>
              )}
            </AnimatedCard>

            {/* Products by Category */}
            <AnimatedCard>
              <h2 className="text-xl font-bold text-white mb-4">Products by Category</h2>
              {analytics?.productsByCategory && analytics.productsByCategory.length > 0 ? (
                <div className="h-64">
                  <Pie
                    data={{
                      labels: analytics.productsByCategory.map(item => item.category),
                      datasets: [{
                        data: analytics.productsByCategory.map(item => item.count),
                        backgroundColor: [
                          '#0ea5e9', '#a855f7', '#22c55e', '#f59e0b',
                          '#ef4444', '#ec4899', '#14b8a6', '#f97316'
                        ],
                        borderWidth: 0
                      }]
                    }}
                    options={pieOptions}
                  />
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">No data available</p>
              )}
            </AnimatedCard>
          </div>

          {/* Line Chart - Events Over Time */}
          <AnimatedCard>
            <h2 className="text-xl font-bold text-white mb-4">Events Distribution</h2>
            {eventsByTypeData ? (
              <div className="h-80">
                <Bar data={eventsByTypeData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No data available</p>
            )}
          </AnimatedCard>

          {/* Line Chart - Products Over Time */}
          <AnimatedCard>
            <h2 className="text-xl font-bold text-white mb-4">Products Registered Over Time</h2>
            {productsOverTimeData ? (
              <div className="h-80">
                <Line data={productsOverTimeData} options={chartOptions} />
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No data available</p>
            )}
          </AnimatedCard>

          {/* Summary Stats */}
          <AnimatedCard>
            <h2 className="text-xl font-bold text-white mb-4">Summary Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-dark-800 rounded-lg text-center">
                <p className="text-3xl font-bold text-primary-400">
                  {analytics?.totalProducts || 0}
                </p>
                <p className="text-gray-400 mt-1">Total Products</p>
              </div>
              <div className="p-4 bg-dark-800 rounded-lg text-center">
                <p className="text-3xl font-bold text-secondary-400">
                  {analytics?.totalEvents || 0}
                </p>
                <p className="text-gray-400 mt-1">Total Events</p>
              </div>
              <div className="p-4 bg-dark-800 rounded-lg text-center">
                <p className="text-3xl font-bold text-success-400">
                  {analytics?.verifiedProducts || 0}
                </p>
                <p className="text-gray-400 mt-1">Verified Products</p>
              </div>
              <div className="p-4 bg-dark-800 rounded-lg text-center">
                <p className="text-3xl font-bold text-warning-400">
                  {analytics?.pendingVerifications || 0}
                </p>
                <p className="text-gray-400 mt-1">Pending Verifications</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
      )}
    </div>
  )
}
