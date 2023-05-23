export let InitialState = {
  program: {},
  programs: [],
  loading: false,
  query: {
    next: '',
    previous: '',
    page: 0,
    total_pages: 0,
    count: 0,
  },
  programRouteNames: [
    'Program',
    'ProgramCreate',
    'ProgramEdit',
    'ProgramEditPreview',
    'ProgramFindings',
    'ProgramSubmissions',
    'ProgramSettings',
    'ProgramSettingsIntegrations',
    'ProgramSettingsTeam',
    'ProgramSettingsSubmissionTemplate',
    'ProgramTransactions',
  ],
}
