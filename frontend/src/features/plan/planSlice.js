import { createSlice } from '@reduxjs/toolkit'

const planSlice = createSlice({
  name: 'plan',
  initialState: {
    plans: [],
    loading: false,
    error: null,
    stats: {
      totalPlans: 0,
      completedPlans: 0,
      pendingPlans: 0,
      completionRate: 0
    },
    statsLoading: false
  },
  reducers: {
    fetchPlansStart: (state) => {
      state.loading = true
      state.error = null
    },
    fetchPlansSuccess: (state, action) => {
      state.loading = false
      state.plans = action.payload
    },
    fetchPlansFail: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    createPlanStart: (state) => {
      state.loading = true
      state.error = null
    },
    createPlanSuccess: (state, action) => {
      state.loading = false
      state.plans.unshift(action.payload) // Add to beginning
    },
    createPlanFail: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    deletePlanStart: (state) => {
      state.loading = true
      state.error = null
    },
    deletePlanSuccess: (state, action) => {
      state.loading = false
      state.plans = state.plans.filter((plan) => plan._id !== action.payload)
    },
    deletePlanFail: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    updatePlanStart: (state) => {
      state.loading = true
      state.error = null
    },
    updatePlanSuccess: (state, action) => {
      state.loading = false
      const index = state.plans.findIndex(plan => plan._id === action.payload._id)
      if (index !== -1) {
        state.plans[index] = action.payload
      }
    },
    updatePlanFail: (state, action) => {
      state.loading = false
      state.error = action.payload
    },
    // Statistics reducers
    fetchStatsStart: (state) => {
      state.statsLoading = true
    },
    fetchStatsSuccess: (state, action) => {
      state.statsLoading = false
      state.stats = action.payload
    },
    fetchStatsFail: (state, action) => {
      state.statsLoading = false
      state.error = action.payload
    },
    clearPlanError: (state) => {
      state.error = null
    },
  },
})

export const {
  fetchPlansStart,
  fetchPlansSuccess,
  fetchPlansFail,
  createPlanStart,
  createPlanSuccess,
  createPlanFail,
  deletePlanStart,
  deletePlanSuccess,
  deletePlanFail,
  updatePlanStart,
  updatePlanSuccess,
  updatePlanFail,
  fetchStatsStart,
  fetchStatsSuccess,
  fetchStatsFail,
  clearPlanError,
} = planSlice.actions

export default planSlice.reducer