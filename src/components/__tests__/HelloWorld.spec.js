import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import SearchInput from '../SearchInput.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(SearchInput, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Search')
  })
})
