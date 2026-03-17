import request from '@/utils/request'

// 开仓下单
export const openOrder = (data: any) => {
  return request({
    url: '/binance/order/open',
    method: 'post',
    data
  })
}

// 平仓
export const closePosition = (symbol: string, positionSide: string) => {
  return request({
    url: '/binance/order/close',
    method: 'post',
    params: { symbol, positionSide }
  })
}

// 查询持仓列表
export const getPositions = () => {
  return request({
    url: '/binance/position/list',
    method: 'get'
  })
}

// 查询账户余额
export const getAccountBalance = () => {
  return request({
    url: '/binance/account/balance',
    method: 'get'
  })
}

// 查询订单历史
export const getOrderHistory = (symbol?: string) => {
  return request({
    url: '/binance/order/history',
    method: 'get',
    params: { symbol }
  })
}