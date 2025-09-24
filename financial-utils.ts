import { Transaction, TreeData, FinancialStory } from "@/types";

export const calculateTreeData = (transactions: Transaction[]): TreeData => {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalSavings = transactions
    .filter(t => t.type === 'saving')
    .reduce((sum, t) => sum + t.amount, 0);

  const netWorth = totalIncome - totalExpenses + totalSavings;
  const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
  
  // Calculate tree health (0-100)
  const health = Math.max(0, Math.min(100, 50 + (netWorth / 1000) * 10));
  
  // Calculate tree elements based on financial health
  const branches = Math.max(3, Math.floor(health / 10));
  const leaves = Math.max(5, Math.floor(health / 5));
  const fruits = Math.floor(savingsRate / 10);
  const size = Math.max(0.5, Math.min(2, health / 50));

  return { health, branches, leaves, fruits, size };
};

export const generateFinancialStory = (
  transactions: Transaction[],
  treeData: TreeData
): FinancialStory => {
  const recentTransactions = transactions
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  let title = "Your Financial Journey";
  let content = "";
  const insights: string[] = [];

  if (treeData.health > 70) {
    sentiment = 'positive';
    title = "🌳 Your Tree is Thriving!";
    content = "Your financial tree is growing strong! Your consistent savings and wise spending have created a flourishing financial landscape.";
    insights.push("Keep up the excellent savings rate");
    insights.push("Your tree is producing healthy fruits of prosperity");
  } else if (treeData.health > 40) {
    sentiment = 'neutral';
    title = "🌿 Steady Growth Ahead";
    content = "Your financial tree is showing steady growth. With some adjustments to your spending habits, you can help it flourish even more.";
    insights.push("Consider increasing your savings rate");
    insights.push("Look for areas to reduce unnecessary expenses");
  } else {
    sentiment = 'negative';
    title = "🍂 Time to Nurture Your Tree";
    content = "Your financial tree needs some care. Focus on reducing expenses and increasing income to help it grow stronger.";
    insights.push("Review your spending patterns");
    insights.push("Consider additional income sources");
  }

  if (treeData.fruits > 0) {
    insights.push(`You've grown ${treeData.fruits} savings fruits this period!`);
  }

  return {
    id: Date.now().toString(),
    title,
    content,
    sentiment,
    date: new Date(),
    insights
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getTransactionColor = (type: Transaction['type']): string => {
  switch (type) {
    case 'income':
      return 'hsl(var(--success))';
    case 'expense':
      return 'hsl(var(--destructive))';
    case 'saving':
      return 'hsl(var(--accent))';
    default:
      return 'hsl(var(--muted))';
  }
};