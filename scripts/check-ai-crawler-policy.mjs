#!/usr/bin/env node

import { loadAiCrawlerPolicy, validateAiCrawlerRobots } from './robots-policy.mjs';

const baseIndex = process.argv.indexOf('--base');
const base = (baseIndex >= 0 ? process.argv[baseIndex + 1] : 'http://localhost:3000').replace(/\/$/, '');

try {
  const response = await fetch(`${base}/robots.txt`, {
    headers: { 'user-agent': 'ai-crawler-policy-check/1.0' },
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) throw new Error(`robots.txt returned HTTP ${response.status}`);

  const body = await response.text();
  const policy = loadAiCrawlerPolicy();
  const errors = validateAiCrawlerRobots(body, policy);

  if (errors.length) {
    console.error(`AI-01 crawler policy failed at ${base}/robots.txt:`);
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log(`AI-01 crawler policy passed at ${base}/robots.txt.`);
    console.log(`Explicit decisions: ${policy.blockedFromAllPaths.length} blocked, ${policy.allowedOnPublicPaths.length} public-search/user retrieval allowed.`);
  }
} catch (error) {
  console.error(`AI-01 crawler policy check could not complete: ${error.message}`);
  process.exitCode = 2;
}
