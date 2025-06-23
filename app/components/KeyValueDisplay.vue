<script setup lang="ts" strict>
  interface Props {
    data: Record<string, unknown>;
    level?: number;
  }
  const props = defineProps<Props>();
  const level = props.level ?? 0;

  function humanizeKey(key: string): string {
    return key
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/^./, (s) => s.toUpperCase());
  }
  const indent = { paddingLeft: `${Math.min(level * 1.25, 7.5)}rem` }; // 1.25rem per level, up to 6 levels
</script>

<template>
  <dl>
    <template v-for="(value, key) in props.data" :key="key">
      <div :style="indent" class="mb-1 flex items-start text-sm">
        <dt class="min-w-[8rem] flex-shrink-0 font-medium text-gray-800">
          {{ humanizeKey(key) }}:
        </dt>
        <dd class="ml-1 flex-1 break-all">
          <KeyValueDisplay
            v-if="value && typeof value === 'object' && !Array.isArray(value)"
            :data="value as Record<string, unknown>"
            :level="level + 1"
          />
          <ul v-else-if="Array.isArray(value)" class="list-disc pl-5">
            <li v-for="(item, idx) in value" :key="idx" class="pr-1">
              <span v-if="typeof item === 'object' && item !== null">
                <KeyValueDisplay
                  :data="item as Record<string, unknown>"
                  :level="level + 1"
                />
              </span>
              <span v-else>{{ item }}</span>
            </li>
          </ul>
          <span
            v-else-if="typeof value === 'number' && String(value).length === 10"
            class="text-blue-700"
          >
            {{ new Date(value * 1000).toLocaleString() }}
            <span class="ml-1 text-xs text-gray-400">(timestamp)</span>
          </span>
          <span v-else>
            {{ value === null ? '—' : value }}
          </span>
        </dd>
      </div>
    </template>
  </dl>
</template>
