const publicProgramRoute = {
  path: '/programs/public/:name',
  name: 'ProgramPublic',
  component: () => import(/* webpackChunkName: "program-public" */ '@/modules/programs/_pages/ProgramPublic'),
  meta: { secure: false },
}

export default [publicProgramRoute]
