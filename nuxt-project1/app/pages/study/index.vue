<template>
    <div>
        <p v-if="pending">这是测试api页</p>
        <div v-else>
            <ul>
                <li v-for="(item,index) in data?.list" :key="index">
                    <p>{{item.title}}</p>
                    <button @click="toggleLike(item.title)">
                        {{ isLiked(item.title) ? '♥ 已收藏' : '☆ 收藏' }}
                    </button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
const $api = useApi()
const { data, pending } = await useAsyncData('study-posts', () =>
    $api<{ list: { title: string }[]; total: number }>('/api/posts'),
)

// useState(key, initFn)：key 要全局唯一，initFn 只在第一次创建时执行
const likedTitles = useState<string[]>('study-liked-titles', () => [])

const toggleLike = (title: string) => {
    const i = likedTitles.value.indexOf(title)
    if (i > -1) {
        likedTitles.value.splice(i, 1) // 取消收藏
    } else {
        likedTitles.value.push(title)   // 收藏
    }
}

const isLiked = (title: string) => likedTitles.value.includes(title)
</script>
