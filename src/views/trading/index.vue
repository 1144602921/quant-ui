<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- K线图表区域 -->
      <el-col :span="16">
        <TradingViewChart 
          :symbol="selectedSymbol"
          :timeframe="selectedTimeframe"
          @symbol-change="handleSymbolChange"
        />
      </el-col>
      
      <!-- 交易面板区域 -->
      <el-col :span="8">
        <!-- 交易面板 -->
        <TradePanel 
          :symbol="selectedSymbol"
          :balance="accountBalance"
          @order-submit="handleOrderSubmit"
        />
        
        <!-- 持仓列表 -->
        <PositionList 
          :positions="positions"
          @close-position="handleClosePosition"
        />
        
        <!-- 实时数据 -->
        <RealTimeData 
          :symbol="selectedSymbol"
          :price="currentPrice"
        />
      </el-col>
    </el-row>
    
    <!-- 订单历史 -->
    <OrderHistory :orders="orders" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import TradingViewChart from './components/TradingViewChart.vue'
import TradePanel from './components/TradePanel.vue'
import PositionList from './components/PositionList.vue'
import OrderHistory from './components/OrderHistory.vue'
import RealTimeData from './components/RealTimeData.vue'
import { openOrder, closePosition, getPositions, getAccountBalance, getOrderHistory } from '@/api/trading'

const selectedSymbol = ref('BTCUSDT')
const selectedTimeframe = ref('1h')
const accountBalance = ref({})
const positions = ref([])
const orders = ref([])
const currentPrice = ref(0)

// WebSocket连接
let ws: WebSocket | null = null

onMounted(() => {
  initWebSocket()
  loadAccountData()
})

onUnmounted(() => {
  if (ws) {
    ws.close()
  }
})

const initWebSocket = () => {
  ws = new WebSocket(`ws://localhost:8080/ws/trading`)
  
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    handleWebSocketMessage(data)
  }
  
  ws.onclose = () => {
    console.log('WebSocket连接关闭')
  }
}

const handleWebSocketMessage = (data: any) => {
  switch (data.type) {
    case 'MARKET_DATA':
      currentPrice.value = data.price
      break
    case 'POSITION_UPDATE':
      positions.value = data.positions
      break
    case 'ORDER_UPDATE':
      orders.value = data.orders
      break
  }
}

const handleOrderSubmit = async (orderData: any) => {
  try {
    const result = await openOrder(orderData)
    ElMessage.success('下单成功')
  } catch (error: any) {
    ElMessage.error(`下单失败: ${error.message}`)
  }
}

const handleClosePosition = async (position: any) => {
  try {
    await closePosition(position.symbol, position.positionSide)
    ElMessage.success('平仓成功')
  } catch (error: any) {
    ElMessage.error(`平仓失败: ${error.message}`)
  }
}

const loadAccountData = async () => {
  try {
    accountBalance.value = await getAccountBalance()
    positions.value = await getPositions()
    orders.value = await getOrderHistory()
  } catch (error) {
    console.error('加载账户数据失败:', error)
  }
}

const handleSymbolChange = (symbol: string) => {
  selectedSymbol.value = symbol
}
</script>

<style scoped>
.app-container {
  padding: 20px;
}
</style>