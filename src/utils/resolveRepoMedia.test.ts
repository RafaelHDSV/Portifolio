import { beforeEach, describe, expect, it, vi } from 'vitest'
import { GithubRepository } from '../repository/GithubRepository'
import {
  clearRepoMediaCacheForTests,
  resolveConfigMediaForRepo,
  resolveRepoMedia
} from './resolveRepoMedia'

vi.mock('../constants/projects.config', () => ({
  projectsConfig: [
    {
      key: '1',
      repoName: 'Config-First',
      name: 'Config First',
      image: 'https://cdn.example/config.png',
      description: { pt: 'p', en: 'e' },
      languages: ['React'],
      urlGitHub: 'https://github.com/RafaelHDSV/Config-First',
      demoPriority: 'config'
    },
    {
      key: '2',
      repoName: 'Readme-First',
      name: 'Readme First',
      image: 'https://cdn.example/ignored.png',
      description: { pt: 'p', en: 'e' },
      languages: ['React'],
      urlGitHub: 'https://github.com/RafaelHDSV/Readme-First',
      demoPriority: 'readme'
    }
  ]
}))

vi.mock('../repository/GithubRepository', () => ({
  GithubRepository: {
    repoFileExists: vi.fn().mockResolvedValue(false),
    getReadme: vi.fn()
  }
}))

describe('resolveRepoMedia demoPriority', () => {
  beforeEach(() => {
    clearRepoMediaCacheForTests()
    vi.mocked(GithubRepository.getReadme).mockReset()
    vi.mocked(GithubRepository.repoFileExists).mockReset()
    vi.mocked(GithubRepository.repoFileExists).mockResolvedValue(false)
  })

  it('usa imagem do config quando demoPriority e config', async () => {
    const media = await resolveRepoMedia('RafaelHDSV', 'Config-First')

    expect(media).toEqual({
      type: 'image',
      url: 'https://cdn.example/config.png'
    })
    expect(GithubRepository.getReadme).not.toHaveBeenCalled()
  })

  it('prioriza readme quando demoPriority e readme', async () => {
    vi.mocked(GithubRepository.getReadme).mockResolvedValue(
      '![demo](https://raw.githubusercontent.com/RafaelHDSV/Readme-First/HEAD/public/desktop.png)'
    )

    const media = await resolveRepoMedia('RafaelHDSV', 'Readme-First')

    expect(media).toEqual({
      type: 'image',
      url: 'https://raw.githubusercontent.com/RafaelHDSV/Readme-First/HEAD/public/desktop.png'
    })
  })

  it('resolveConfigMediaForRepo retorna null sem imagem valida', () => {
    expect(resolveConfigMediaForRepo('unknown')).toBeNull()
  })
})
