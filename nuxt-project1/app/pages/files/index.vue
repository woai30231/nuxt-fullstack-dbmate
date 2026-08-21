<script setup lang="ts">
interface FileItem {
  id: number
  originalName: string
  storedName: string
  ext: string | null
  mimeType: string
  size: number
  uploader: string | null
  createdAt: string
}

const $api = useApi()
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const uploadError = ref('')
const deletingId = ref<number | null>(null)

// 文件列表
const { data, refresh } = await useAsyncData('files-list', () =>
  $api<{ list: FileItem[]; total: number }>('/api/files'),
)

const list = computed(() => data.value?.list ?? [])

// 格式化文件大小
function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

// 格式化时间
function formatTime(iso: string) {
  return iso.replace('T', ' ').slice(0, 19)
}

// 触发文件选择
function triggerPick() {
  fileInput.value?.click()
}

// 处理上传
async function handleUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''

  try {
    const form = new FormData()
    form.append('file', file)
    await $api('/api/files', { method: 'POST', body: form })
    await refresh() // 刷新列表
  }
  catch (err: any) {
    uploadError.value = err?.data?.statusMessage || err?.message || '上传失败'
  }
  finally {
    uploading.value = false
    target.value = '' // 清空,允许重复选择同一文件
  }
}

// 删除文件
async function handleDelete(item: FileItem) {
  if (!confirm(`确定删除「${item.originalName}」吗？`)) return
  deletingId.value = item.id
  try {
    await $api(`/api/files/${item.id}`, { method: 'DELETE' })
    await refresh()
  }
  catch (err: any) {
    alert(err?.data?.statusMessage || '删除失败')
  }
  finally {
    deletingId.value = null
  }
}

// 判断是否为图片(用于预览)
function isImage(item: FileItem) {
  return item.mimeType.startsWith('image/')
}

// 生成下载地址
const downloadUrl = (id: number) => `/api/files/${id}/download`
</script>

<template>
  <section>
    <h1>文件上传</h1>
    <p>支持任意类型文件，单个最大 10MB。上传后展示文件列表，可预览/下载/删除。</p>

    <!-- 上传区 -->
    <div class="upload-zone" @click="triggerPick">
      <input
        ref="fileInput"
        type="file"
        class="hidden-input"
        @change="handleUpload"
      >
      <div class="upload-icon">＋</div>
      <div class="upload-text">
        <strong>{{ uploading ? '上传中…' : '点击选择文件上传' }}</strong>
        <span>单个文件不超过 10MB</span>
      </div>
    </div>
    <p v-if="uploadError" class="error">{{ uploadError }}</p>

    <!-- 文件列表 -->
    <h2>已上传文件（{{ list.length }}）</h2>

    <div v-if="list.length === 0" class="empty">还没有上传任何文件</div>

    <ul v-else class="file-list">
      <li v-for="item in list" :key="item.id" class="file-item">
        <!-- 缩略图 / 图标 -->
        <div class="file-thumb">
          <img
            v-if="isImage(item)"
            :src="downloadUrl(item.id)"
            :alt="item.originalName"
          >
          <span v-else class="file-ext">{{ (item.ext || 'FILE').toUpperCase().slice(0, 4) }}</span>
        </div>

        <!-- 信息 -->
        <div class="file-info">
          <div class="file-name" :title="item.originalName">{{ item.originalName }}</div>
          <div class="file-meta">
            {{ formatSize(item.size) }}
            · {{ item.mimeType }}
            · {{ formatTime(item.createdAt) }}
          </div>
        </div>

        <!-- 操作 -->
        <div class="file-actions">
          <a class="btn" :href="downloadUrl(item.id)" target="_blank" rel="noopener">预览</a>
          <a class="btn" :href="downloadUrl(item.id)" :download="item.originalName">下载</a>
          <button
            class="btn danger"
            :disabled="deletingId === item.id"
            @click="handleDelete(item)"
          >
            {{ deletingId === item.id ? '删除中…' : '删除' }}
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.upload-zone {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  border: 2px dashed #cbd5e1;
  border-radius: 12px;
  background: #fff;
  cursor: pointer;
  transition: border-color 0.2s;
}

.upload-zone:hover {
  border-color: #00dc82;
}

.hidden-input {
  display: none;
}

.upload-icon {
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  font-size: 1.8rem;
  color: #00dc82;
  background: #ecfdf5;
  border-radius: 10px;
}

.upload-text {
  display: grid;
  gap: 0.25rem;
}

.upload-text span {
  color: #6b7280;
  font-size: 0.85rem;
}

.error {
  margin-top: 0.75rem;
  color: #dc2626;
}

.empty {
  padding: 2rem;
  text-align: center;
  color: #9ca3af;
  background: #fff;
  border-radius: 10px;
}

.file-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.9rem 1rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.file-thumb {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
}

.file-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-ext {
  font-size: 0.7rem;
  font-weight: 700;
  color: #4b5563;
}

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-meta {
  margin-top: 0.25rem;
  font-size: 0.8rem;
  color: #9ca3af;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn {
  padding: 0.35rem 0.7rem;
  font-size: 0.82rem;
  color: #374151;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  text-decoration: none;
  cursor: pointer;
}

.btn:hover {
  border-color: #00dc82;
  color: #00dc82;
}

.btn.danger {
  color: #dc2626;
  border-color: #fecaca;
}

.btn.danger:hover {
  background: #fef2f2;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
