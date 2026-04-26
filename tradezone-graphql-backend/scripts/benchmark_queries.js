require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const Transaction = require('../src/models/Transaction');
const sequelize = require('../config/database');
const TransactionPG = require('../src/models/TransactionPG');
const fs = require('fs');
const path = require('path');

async function seedData() {
  console.log('--- Seeding 1000 Transactions ---');
  // Clear existing data in PG
  await TransactionPG.destroy({ where: {} });
  
  const transactions = [];
  const statuses = ['completed', 'pending', 'failed', 'refunded'];
  
  for (let i = 0; i < 1000; i++) {
    transactions.push({
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${i}`,
      userId: `user_${Math.floor(Math.random() * 50)}`, // 50 possible users
      items: [{ itemId: 'item_1', name: 'Random Item', price: 10, quantity: 1 }],
      totalAmount: Math.floor(Math.random() * 500) + 10,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)) // Random past date
    });
  }
  
  await TransactionPG.bulkCreate(transactions);
  console.log('Seeding complete.\n');
}

async function runExplainAnalyze(query) {
  // Use FORMAT JSON to easily extract the Execution Time
  const explainQuery = `EXPLAIN (ANALYZE, FORMAT JSON) ${query}`;
  const [results] = await sequelize.query(explainQuery);
  // Results in JSON format is an array with one object containing the Plan
  const executionTime = results[0]['QUERY PLAN'][0]['Execution Time'];
  return executionTime;
}

async function dropIndexes() {
  const queryInterface = sequelize.getQueryInterface();
  try {
    await queryInterface.removeIndex('transactions', ['userId']);
    await queryInterface.removeIndex('transactions', ['status']);
    await queryInterface.removeIndex('transactions', ['createdAt']);
  } catch (e) {
    // Indexes might not exist, ignore
  }
}

async function addIndexes() {
  const queryInterface = sequelize.getQueryInterface();
  await queryInterface.addIndex('transactions', ['userId']);
  await queryInterface.addIndex('transactions', ['status']);
  await queryInterface.addIndex('transactions', ['createdAt']);
}

async function runBenchmark() {
  console.log('--- Database Benchmark ---');
  
  if (!sequelize || !TransactionPG) {
    console.log('PostgreSQL not configured, skipping PG benchmark.');
    return process.exit(0);
  }

  try {
    await sequelize.authenticate();
    
    // Ensure table exists
    await TransactionPG.sync();
    
    // 1. Seed data
    await seedData();
    
    // Define test queries
    const testQueries = [
      {
        name: 'Query by userId',
        sql: `SELECT * FROM "transactions" WHERE "userId" = 'user_10'`
      },
      {
        name: 'Query by status',
        sql: `SELECT * FROM "transactions" WHERE "status" = 'completed'`
      },
      {
        name: 'Query by recent createdAt',
        sql: `SELECT * FROM "transactions" WHERE "createdAt" >= NOW() - INTERVAL '30 days'`
      }
    ];
    
    // 2. Drop existing indexes to ensure a clean slate
    console.log('Dropping any existing indexes...');
    await dropIndexes();
    
    // 3. Run queries BEFORE indexes
    console.log('Running queries BEFORE adding indexes...');
    const resultsBefore = {};
    for (const q of testQueries) {
      const time = await runExplainAnalyze(q.sql);
      resultsBefore[q.name] = time;
      console.log(`- ${q.name}: ${time.toFixed(3)} ms`);
    }
    
    // 4. Add Indexes
    console.log('\nAdding indexes to "userId", "status", and "createdAt"...');
    await addIndexes();
    
    // 5. Run queries AFTER indexes
    console.log('Running queries AFTER adding indexes...');
    const resultsAfter = {};
    for (const q of testQueries) {
      const time = await runExplainAnalyze(q.sql);
      resultsAfter[q.name] = time;
      console.log(`- ${q.name}: ${time.toFixed(3)} ms`);
    }
    
    // 6. Calculate Improvements and Save
    console.log('\n--- Benchmark Results ---');
    const finalResults = [];
    
    for (const q of testQueries) {
      const before = resultsBefore[q.name];
      const after = resultsAfter[q.name];
      let improvement_pct = 0;
      
      if (before > 0) {
        improvement_pct = ((before - after) / before) * 100;
      }
      
      const res = {
        query: q.name,
        execution_time_before_ms: Number(before.toFixed(3)),
        execution_time_after_ms: Number(after.toFixed(3)),
        improvement_pct: Number(improvement_pct.toFixed(2))
      };
      
      finalResults.push(res);
      console.log(`${q.name}: ${res.improvement_pct > 0 ? '+' : ''}${res.improvement_pct}% improvement (${res.execution_time_before_ms}ms -> ${res.execution_time_after_ms}ms)`);
    }
    
    const outputPath = path.join(__dirname, '..', 'benchmark_results.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalResults, null, 2));
    console.log(`\nResults saved to ${outputPath}`);
    
  } catch (error) {
    console.error('PostgreSQL Benchmark failed:', error.message);
  } finally {
    if (sequelize) {
      await sequelize.close();
    }
    process.exit(0);
  }
}

runBenchmark();
