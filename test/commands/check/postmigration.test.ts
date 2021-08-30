import {expect, test} from '@oclif/test'

describe('check:postmigration', () => {
  test
  .stdout()
  .command(['check:postmigration'])
  .it('runs hello', ctx => {
    expect(ctx.stdout).to.contain('hello world')
  })

  test
  .stdout()
  .command(['check:postmigration', '--name', 'jeff'])
  .it('runs hello --name jeff', ctx => {
    expect(ctx.stdout).to.contain('hello jeff')
  })
})
