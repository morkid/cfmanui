import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserinfoStore = defineStore('userinfo', () => {
  const userinfoData = ref()
  const userinfo = computed(() => userinfoData.value)
  const username = computed(() => {
    let currentUsername = 'anonymous'
      
    if (userinfoData.value) {
      let nameFields = [
        'email',
        'sub',
        'id',
      ]

      let localConfig = localStorage.getItem('username_field')
      if (localConfig) {
        nameFields.unshift(localConfig)
      }

      for (let i in nameFields) {
        let name = userinfoData.value[nameFields[i]]
        if (name && name !== '') {
          currentUsername = name
          break
        }
      }
    }

    return currentUsername
  })

  const displayname = computed(() => {
    let currentDisplayName = 'anonymous'
      
    if (userinfoData.value) {
      let nameFields = [
        'name',
        'username',
        'email',
        'full_name',
        'first_name',
        'email',
        'sub'
      ]

      let localConfig = localStorage.getItem('displayname_field')
      if (localConfig) {
        nameFields.unshift(localConfig)
      }

      for (let i in nameFields) {
        let name = userinfoData.value[nameFields[i]]
        if (name && name !== '') {
          currentDisplayName = name
          break
        }
      }
    }

    return currentDisplayName
  })

  const setUserinfo = data => {
    userinfoData.value = data
  }

  return { userinfoData, userinfo, username, displayname, setUserinfo }
})
