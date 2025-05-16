import React, { useState } from 'react'

// 基础组件（用户信息展示）
const UserProfile = ({ user, lastLogin }) => {
  console.log('用户信息组件重新渲染') // 用于验证缓存效果
  return (
    <div>
      <h2>{user.name}</h2>
      <p>ID: {user.id}</p>
      <p>最后登录: {lastLogin}</p>
    </div>
  )
}

const DeepMemoUserProfile = React.memo(UserProfile, (prevProps, nextProps) => {
  // 仅当用户ID或最后登录时间变化时重新渲染
  return (
    prevProps.user.id === nextProps.user.id &&
    prevProps.lastLogin === nextProps.lastLogin
  )
})

export default DeepMemoUserProfile
