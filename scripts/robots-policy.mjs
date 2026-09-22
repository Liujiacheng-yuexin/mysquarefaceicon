import { readFileSync } from 'node:fs';

export const requiredAiCrawlerAgents = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-User',
  'Claude-SearchBot',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'Bytespider',
  'Applebot-Extended',
];

const defaultPolicyUrl = new URL('../data/ai-crawler-policy.json', import.meta.url);

export function loadAiCrawlerPolicy(url = defaultPolicyUrl) {
  return JSON.parse(readFileSync(url, 'utf8'));
}

export function parseRobotsGroups(body) {
  const groups = [];
  let agents = [];
  let rules = [];
  let hasRules = false;

  const flush = () => {
    if (agents.length) groups.push({ agents, rules });
    agents = [];
    rules = [];
    hasRules = false;
  };

  for (const raw of body.split(/\r?\n/)) {
    const line = raw.replace(/#.*$/, '').trim();
    if (!line) continue;
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (!match) continue;
    const directive = match[1].trim().toLowerCase();
    const value = match[2].trim();

    if (directive === 'user-agent') {
      if (hasRules) flush();
      agents.push(value.toLowerCase());
      continue;
    }
    if (agents.length && (directive === 'allow' || directive === 'disallow')) {
      rules.push({ directive, value });
      hasRules = true;
    }
  }
  flush();
  return groups;
}

export function robotsBlocksAllUserAgents(body) {
  const wildcardRules = parseRobotsGroups(body)
    .filter((group) => group.agents.includes('*'))
    .flatMap((group) => group.rules);
  const rootDisallowed = hasRule(wildcardRules, 'disallow', '/');
  const rootAllowed = hasRule(wildcardRules, 'allow', '/');
  return rootDisallowed && !rootAllowed;
}

export function validateAiCrawlerPolicyConfig(policy) {
  const errors = [];
  const blocked = Array.isArray(policy.blockedFromAllPaths) ? policy.blockedFromAllPaths : [];
  const allowed = Array.isArray(policy.allowedOnPublicPaths) ? policy.allowedOnPublicPaths : [];
  const privatePaths = Array.isArray(policy.privatePaths) ? policy.privatePaths : [];
  const listed = [...blocked, ...allowed];
  const duplicates = listed.filter((agent, index) => listed.indexOf(agent) !== index);
  const missing = requiredAiCrawlerAgents.filter((agent) => !listed.includes(agent));
  const unexpected = listed.filter((agent) => !requiredAiCrawlerAgents.includes(agent));

  if (policy.decision !== 'split-training-and-search') {
    errors.push(`策略 decision 应为 split-training-and-search，当前为 ${policy.decision ?? '未填写'}`);
  }
  if (!Array.isArray(policy.blockedFromAllPaths)) errors.push('策略 blockedFromAllPaths 必须是数组');
  if (!Array.isArray(policy.allowedOnPublicPaths)) errors.push('策略 allowedOnPublicPaths 必须是数组');
  if (!Array.isArray(policy.privatePaths)) errors.push('策略 privatePaths 必须是数组');
  if (missing.length) errors.push(`策略数据缺少 crawler：${missing.join(', ')}`);
  if (unexpected.length) errors.push(`策略数据包含未登记 crawler：${unexpected.join(', ')}`);
  if (duplicates.length) errors.push(`crawler 在策略中重复或跨组：${[...new Set(duplicates)].join(', ')}`);
  for (const path of ['/admin/', '/api/']) {
    if (!privatePaths.includes(path)) errors.push(`策略数据缺少私有路径：${path}`);
  }
  return errors;
}

export function validateAiCrawlerRobots(body, policy) {
  const errors = validateAiCrawlerPolicyConfig(policy);
  const blocked = Array.isArray(policy.blockedFromAllPaths) ? policy.blockedFromAllPaths : [];
  const allowed = Array.isArray(policy.allowedOnPublicPaths) ? policy.allowedOnPublicPaths : [];
  const privatePaths = Array.isArray(policy.privatePaths) ? policy.privatePaths : [];
  const groups = parseRobotsGroups(body);
  const groupsByAgent = new Map();

  for (const group of groups) {
    for (const agent of group.agents) {
      groupsByAgent.set(agent, [...(groupsByAgent.get(agent) ?? []), group]);
    }
  }

  const rulesFor = (agent) => (groupsByAgent.get(agent.toLowerCase()) ?? []).flatMap((group) => group.rules);
  const wildcard = rulesFor('*');
  validatePublicRules('*', wildcard, privatePaths, errors);

  for (const agent of blocked) {
    const rules = rulesFor(agent);
    if (!rules.length) {
      errors.push(`${agent} 缺少显式 User-agent 规则`);
      continue;
    }
    if (!hasRule(rules, 'disallow', '/')) errors.push(`${agent} 必须声明 Disallow: /`);
    if (hasRule(rules, 'allow', '/')) errors.push(`${agent} 同时声明 Allow: /，与训练/批量抓取阻止决策冲突`);
  }

  for (const agent of allowed) {
    const rules = rulesFor(agent);
    if (!rules.length) {
      errors.push(`${agent} 缺少显式 User-agent 规则`);
      continue;
    }
    validatePublicRules(agent, rules, privatePaths, errors);
  }

  return errors;
}

function validatePublicRules(agent, rules, privatePaths, errors) {
  if (!rules.length) {
    errors.push(`${agent} 缺少显式 User-agent 规则`);
    return;
  }
  if (!hasRule(rules, 'allow', '/')) errors.push(`${agent} 必须声明 Allow: /`);
  if (hasRule(rules, 'disallow', '/')) errors.push(`${agent} 不得声明 Disallow: /`);
  for (const path of privatePaths) {
    if (!hasRule(rules, 'disallow', path)) errors.push(`${agent} 缺少私有路径 Disallow: ${path}`);
  }
}

function hasRule(rules, directive, value) {
  return rules.some((rule) => rule.directive === directive && rule.value === value);
}
