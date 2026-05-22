import type { Reporter, TestCase, TestResult } from '@playwright/test/reporter'
import fs from 'fs'

type TestEntry = {
    title: string
    status: "passed" | "failed" | "timedOut" | "skipped" | "interrupted"
    duration: number
    retry: number
    flaky: boolean
}

export default class CustomReporter implements Reporter {

    private results: TestEntry[] = []

    onTestEnd(test: TestCase, result: TestResult) {
        const report = {
            title: test.title,
            status: result.status,
            duration: result.duration,
            retry: result.retry,
            flaky: result.retry > 0 && result.status === 'passed'
        }
        this.results.push(report)
    }

    onEnd() {
        fs.mkdirSync('test-results', { recursive: true })
        fs.writeFileSync('test-results/report.json', JSON.stringify(this.results, null, 2))
        this.consoleSummary()
    }

    private consoleSummary() {
        const passed = this.results.filter(r => r.status === 'passed' && !r.flaky).length
        const failed = this.results.filter(r => r.status === 'failed').length
        const flaky = this.results.filter(r => r.flaky).length
        const skipped = this.results.filter(r => r.status === 'skipped').length

        console.log(`\n📊 Test Summary`)
        console.log(`Total: ${this.results.length} | ✅ Passed: ${passed} | ❌ Failed: ${failed} | ⚠️ Flaky: ${flaky} | ⏭️ Skipped: ${skipped}`)
    }
}