<template>
  <el-card class="trade-panel">
    <template #header>
      <div class="card-header">
        <span>交易面板</span>
        <el-tag type="success">{{ symbol }}</el-tag>
      </div>
    </template>
    
    <el-form :model="orderForm" label-width="80px">
      <!-- 交易方向 -->
      <el-form-item label="方向">
        <el-radio-group v-model="orderForm.side">
          <el-radio-button label="BUY">做多</el-radio-button>
          <el-radio-button label="SELL">做空</el-radio-button>
        </el-radio-group>
      </el-form-item>
      
      <!-- 订单类型 -->
      <el-form-item label="类型">
        <el-select v-model="orderForm.type" style="width: 100%">
          <el-option label="市价" value="MARKET" />
          <el-option label="限价" value="LIMIT" />
        </el-select>
      </el-form-item>
      
      <!-- 数量 -->
      <el-form-item label="数量">
        <el-input-number 
          v-model="orderForm.quantity"
          :min="0.001"
          :step="0.001"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>
      
      <!-- 价格 (限价单) -->
      <el-form-item v-if="orderForm.type === 'LIMIT'" label="价格">
        <el-input-number 
          v-model="orderForm.price"
          :min="0.0001"
          :step="0.0001"
          controls-position="right"
          style="width: 100%"
        />
      </el-form-item>
      
      <!-- 杠杆 -->
      <el-form-item label="杠杆">
        <el-select v-model="orderForm.leverage" style="width: 100%">
          <el-option v-for="i in 20" :key="i" :label="`${i}X`" :value="i" />
        </el-select>
      </el-form-item>
      
      <!-- 下单按钮 -->
      <el-form-item>
        <el-button 
          type="primary" 
          style="width: 100%" 
          @click="handleSubmit"
          :loading="loading"
        >
          {{ getButtonText() }}
        </el-button>
      </el-form-item>
    </el-form>
    
    <!-- 风险提示 -->
    <el-alert
      title="风险提示"
      type="warning"
      description="杠杆交易风险极高，请谨慎操作"
      :closable="false"
    />
  </el-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

interface Props {
  symbol: string
  balance: any
}

const props = defineProps<Props>()
const emit = defineEmits(['order-submit'])

const loading = ref(false)

const orderForm = ref({
  symbol: props.symbol,
  side: 'BUY',
  type: 'MARKET',
  quantity: 0.001,
  price: 0,
  leverage: 10
})

const getButtonText = computed(() => {
  const sideText = orderForm.value.side === 'BUY' ? '做多' : '做空'
  return loading.value ? '下单中...' : `${sideText} ${props.symbol}`
})

const handleSubmit = async () => {
  if (orderForm.value.quantity <= 0) {
    ElMessage.warning('请输入有效的数量')
    return
  }
  
  loading.value = true
  try {
    await emit('order-submit', { ...orderForm.value })
    // 重置表单
    orderForm.value.quantity = 0.001
    orderForm.value.price = 0
  } catch (error) {
    console.error('下单失败:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.trade-panel {
  margin-bottom: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>