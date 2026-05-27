import { describe, expect, it } from 'vitest'
import { isRecruiterPath, RECRUITER_PATH } from './recruiterRoutes'

describe('recruiterRoutes', () => {
  it('exports recruiter path', () => {
    expect(RECRUITER_PATH).toBe('/recruiter')
  })

  it('detects recruiter pathname variants', () => {
    expect(isRecruiterPath('/recruiter')).toBe(true)
    expect(isRecruiterPath('/recruiter/')).toBe(true)
    expect(isRecruiterPath('/')).toBe(false)
    expect(isRecruiterPath('/about')).toBe(false)
  })
})
