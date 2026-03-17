<template>
  <el-card class="position-list">
    <template #header>
      <span>持仓列表</span>
    </template>
    
    <el-table :data="positions" style="width: 100%">
      <el-table-column prop="symbol" label="交易对" width="80" />
      <el-table-column prop="positionSide" label="方向" width="60">
        <template #default="{ row }">
          <el-tag :type="row.positionSide === 'LONG' ? 'success' : 'danger'">
            {{ row.positionSide === 'LONG' ? '多' : '空' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="positionAmt" label="数量" width="80" />
      <el-table-column prop="entryPrice" label="入场价" width="100" />
      <el-table-column prop="unrealizedProfit" label="未实现盈亏" width="100">
        <template #default="{ row }">
          <span :class="{ 'profit': row.unrealizedProfit > 0, 'loss': row.unrealizedProfit < 0 }">
            {{ row.unrealizedProfit }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="leverage" label="杠杆" width="60" />
      <el-table-column label="操作" width="80">
        <template #default="{ row }">
          <el-button 
            size="small" 
            type="danger" 
            @click="handleClosePosition(row)"
          >
            平仓
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
interface Props {
  positions: any[]
}

const props = defineProps<Props>()
const emit = defineEmits(['close-position'])

const handleClosePosition = (position: any) => {
  emit('close-position', position)
}
</script>

<style scoped>
.position-list {
  margin-bottom: 20px;
}
.profit {
  color: #f56c6c;
}
.loss {
  color: #67c23a;
}
</style>