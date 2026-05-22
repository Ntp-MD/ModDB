import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  defaultLabelMap,
  getLabelMap,
  saveLabelMap,
  getCustomLabels,
  getLabelText,
  getLabelColor,
  getAllLabels,
  customLabels,
  labelMap,
} from './supabase-data'

// Mock supabase before importing
vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          limit: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
        neq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}))

describe('Label Functions', () => {
  let originalGetItem: Storage['getItem']
  let originalSetItem: Storage['setItem']

  beforeEach(() => {
    vi.clearAllMocks()
    customLabels.value = []
    labelMap.value = { ...defaultLabelMap }
    
    // Save original localStorage methods
    originalGetItem = localStorage.getItem
    originalSetItem = localStorage.setItem
  })

  afterEach(() => {
    // Restore original localStorage methods
    localStorage.getItem = originalGetItem
    localStorage.setItem = originalSetItem
  })

  describe('getLabelMap', () => {
    it('should return default label map when localStorage is empty', () => {
      const result = getLabelMap()
      expect(result).toEqual(defaultLabelMap)
    })

    it('should return saved label map from localStorage', () => {
      const savedMap = { blue: 'DMS Updated', yellow: 'PlusVenture' }
      localStorage.setItem('labelMap', JSON.stringify(savedMap))
      
      const result = getLabelMap()
      expect(result).toEqual(savedMap)
      
      localStorage.removeItem('labelMap')
    })

    it('should return default map on localStorage error', () => {
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage error')
      })
      
      const result = getLabelMap()
      expect(result).toEqual(defaultLabelMap)
    })
  })

  describe('saveLabelMap', () => {
    it('should save label map to localStorage', () => {
      const testMap = { blue: 'Test', yellow: 'Test2' }
      saveLabelMap(testMap)
      
      const saved = localStorage.getItem('labelMap')
      expect(saved).toBe(JSON.stringify(testMap))
      
      localStorage.removeItem('labelMap')
    })
  })

  describe('getCustomLabels', () => {
    it('should return empty array when localStorage is empty', () => {
      const result = getCustomLabels()
      expect(result).toEqual([])
    })

    it('should return saved custom labels from localStorage', () => {
      const savedLabels = [
        { id: 'custom_1', label: 'Test Label', color: '#ff0000' }
      ]
      localStorage.setItem('customLabels', JSON.stringify(savedLabels))
      
      const result = getCustomLabels()
      expect(result).toEqual(savedLabels)
      
      localStorage.removeItem('customLabels')
    })

    it('should return empty array on localStorage error', () => {
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage error')
      })
      
      const result = getCustomLabels()
      expect(result).toEqual([])
    })
  })

  describe('getLabelText', () => {
    it('should return custom label text for custom label ID', () => {
      customLabels.value = [
        { id: 'custom_1', label: 'Custom Label', color: '#ff0000' }
      ]
      
      const result = getLabelText('custom_1')
      expect(result).toBe('Custom Label')
    })

    it('should return preset label text for preset label ID', () => {
      labelMap.value = { ...defaultLabelMap }
      
      const result = getLabelText('blue')
      expect(result).toBe('DMS')
    })

    it('should return Personal for unknown label ID', () => {
      const result = getLabelText('unknown')
      expect(result).toBe('Personal')
    })
  })

  describe('getLabelColor', () => {
    it('should return CSS variable for preset colors', () => {
      const result = getLabelColor('blue')
      expect(result).toBe('var(--label-blue)')
    })

    it('should return hex color for custom labels', () => {
      customLabels.value = [
        { id: 'custom_1', label: 'Test', color: '#ff0000' }
      ]
      
      const result = getLabelColor('custom_1')
      expect(result).toBe('#ff0000')
    })

    it('should return default blue color for unknown label', () => {
      const result = getLabelColor('unknown')
      expect(result).toBe('var(--label-blue)')
    })
  })

  describe('getAllLabels', () => {
    it('should return only preset labels when no custom labels exist', () => {
      customLabels.value = []
      
      const result = getAllLabels()
      expect(result).toHaveLength(5)
      expect(result[0]).toEqual({ id: 'blue', label: 'DMS', color: 'blue' })
    })

    it('should return preset and custom labels combined', () => {
      customLabels.value = [
        { id: 'custom_1', label: 'Custom', color: '#ff0000' }
      ]
      
      const result = getAllLabels()
      expect(result).toHaveLength(6)
      expect(result[5]).toEqual({ id: 'custom_1', label: 'Custom', color: '#ff0000' })
    })
  })
})
