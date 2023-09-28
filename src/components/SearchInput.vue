<template>
  <form class="input-group" @submit.prevent="doSearch">
    <input
      type="text"
      class="form-control"
      v-model="search"
      :placeholder="disabled ? 'Loading ...' : placeholder"
      aria-label="Search"
      aria-describedby="button-search"
      :disabled="disabled"
    />
    <button class="btn btn-outline-secondary" type="submit" :disabled="disabled" id="button-search">Search</button>
  </form>
</template>

<script>
export default {
  props: ['disabled', 'placeholder'],
  data() {
    return {
      search: ''
    }
  },
  methods: {
    doSearch() {
      this.$emit('search', this.search)
    }
  }
}
</script>
