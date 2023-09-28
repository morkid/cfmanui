<template>
  <div class="modal" tabindex="-1" id="modalPurgeCache">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Purge Cache</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <p>Purge all cache from zone <strong>{{ zoneName }}</strong>?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click.prevent="doPurgeCache">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['zoneName'],
  methods: {
    doPurgeCache() {
      this.$emit('purge')
    }
  }
}
</script>