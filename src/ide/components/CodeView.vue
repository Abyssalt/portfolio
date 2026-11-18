<script setup>
defineProps({ lines: { type: Array, required: true } })

const isExternal = (href) => /^https?:/.test(href)
</script>

<template>
  <div class="code" tabindex="0">
    <div v-for="(line, i) in lines" :key="i" class="line">
      <span class="gutter" aria-hidden="true">{{ i + 1 }}</span>
      <span class="text"><template v-for="(token, j) in line" :key="j"><a
            v-if="token.href"
            :href="token.href"
            :class="`tok-${token.c}`"
            :target="isExternal(token.href) ? '_blank' : null"
            :rel="isExternal(token.href) ? 'noopener' : null"
          >{{ token.s }}</a><span v-else :class="`tok-${token.c}`">{{ token.s }}</span></template></span>
    </div>
  </div>
</template>

<style scoped>
.code {
  padding: 14px 0 80px;
  font-family: var(--mono);
  font-size: 13.5px;
  line-height: 1.65;
  outline: none;
}

.line {
  display: flex;
  min-height: 1.65em;
}
.line:hover { background: var(--ide-line-hover); }

.gutter {
  flex: none;
  width: 56px;
  padding-right: 18px;
  text-align: right;
  color: var(--text-faint);
  user-select: none;
}
.line:hover .gutter { color: var(--text-dim); }

.text {
  flex: 1;
  min-width: 0;
  padding-right: 24px;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

@media (max-width: 760px) {
  .code { font-size: 12.5px; }
  .gutter { width: 40px; padding-right: 10px; }
}
</style>
