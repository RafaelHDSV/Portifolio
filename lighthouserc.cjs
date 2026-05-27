/** @type {import('@lhci/cli').CiConfig} */
module.exports = {
  ci: {
    collect: {
      startServerCommand: 'yarn preview --host 127.0.0.1 --port 4173',
      startServerReadyPattern: 'Local',
      url: ['http://127.0.0.1:4173/?lang=pt'],
      numberOfRuns: 3,
      settings: {
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false
        },
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          requestLatencyMs: 150,
          downloadThroughputKbps: 1638.4,
          uploadThroughputKbps: 675,
          cpuSlowdownMultiplier: 4
        }
      }
    },
    assert: {
      assertions: {
        // Baseline local mobile ~0.42 (PNGs de projetos + GitHub API). Meta 90: warn ate follow-up de imagens.
        'categories:performance': ['warn', { minScore: 0.9 }],
        'categories:accessibility': ['warn', { minScore: 0.95 }],
        'categories:best-practices': ['warn', { minScore: 0.95 }],
        'categories:seo': ['warn', { minScore: 0.95 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
}
