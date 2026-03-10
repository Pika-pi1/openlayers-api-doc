<template>
  <div class="placeholder-page">
    <el-card class="placeholder-card">
      <div class="placeholder-content">
        <el-icon class="placeholder-icon"><Construction /></el-icon>
        <h2>文档开发中</h2>
        <p class="api-name">{{ pageTitle }}</p>
        <p class="description">该模块的 API 文档正在编写中，敬请期待。</p>

        <div class="action-buttons">
          <el-button type="primary" @click="$router.push('/view')">
            <el-icon><View /></el-icon>
            查看 View API
          </el-button>
          <el-button @click="goBack">
            <el-icon><Back /></el-icon>
            返回上一页
          </el-button>
        </div>

        <div class="official-link">
          <el-link
            type="primary"
            :href="officialDocUrl"
            target="_blank"
          >
            <el-icon><Link /></el-icon>
            查看官方文档
          </el-link>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => {
  return route.meta.title || 'Unknown'
})

const officialDocUrl = computed(() => {
  const category = route.meta.category
  const path = route.path.split('/').pop()
  return `https://openlayers.org/en/latest/apidoc/module-ol_${category}_${path}.html`
})

const goBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.placeholder-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 40px;
  background-color: #f5f7fa;
}

.placeholder-card {
  width: 100%;
  max-width: 500px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  :deep(.el-card__body) {
    padding: 0;
  }
}

.placeholder-content {
  padding: 40px;
  text-align: center;

  .placeholder-icon {
    font-size: 80px;
    color: #e6a23c;
    margin-bottom: 20px;
  }

  h2 {
    margin: 0 0 10px 0;
    color: #303133;
    font-size: 24px;
  }

  .api-name {
    color: #409eff;
    font-size: 18px;
    font-weight: 600;
    margin: 10px 0;
    font-family: 'Consolas', 'Monaco', monospace;
  }

  .description {
    color: #909399;
    font-size: 14px;
    margin: 15px 0 30px 0;
    line-height: 1.6;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .official-link {
    margin-top: 15px;
  }
}
</style>
