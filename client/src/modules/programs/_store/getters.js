export default {
  programStates: state => state.programStates,
  programDetails: state => state.programDetails,
  searchTerms: state => state.searchTerms,
  activeProgramType: state => {
    return state.activeProgramType
  },
  filterProgramStates(state) {
    return programType => {
      return state.programStates.filter(p => p.type === programType)
    }
  },
  viewingSearchResults: state => state.searchTerms && state.searchTerms.length > 0 && state.showSearchResults,
}
