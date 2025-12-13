import { db } from '../db';
import { expertKnowledge, hooks, storytellingFrameworks, growthStageGuides, responseTemplates, liveStreamingTemplates, scriptTemplates } from '../shared/schema';
import { 
  expertKnowledgeData, 
  hooksData, 
  storytellingFrameworksData, 
  growthStageGuidesData, 
  responseTemplatesData, 
  liveStreamingTemplatesData,
  scriptTemplatesData
} from './data/expert-knowledge-seed';

async function seedExpertKnowledge() {
  console.log('Starting Expert Knowledge Base seeding...');
  
  try {
    // Seed Expert Knowledge
    console.log('Seeding expert knowledge...');
    for (const item of expertKnowledgeData) {
      await db.insert(expertKnowledge).values(item).onConflictDoNothing();
    }
    console.log(`✓ Inserted ${expertKnowledgeData.length} expert knowledge entries`);

    // Seed Hooks
    console.log('Seeding hooks...');
    for (const item of hooksData) {
      await db.insert(hooks).values(item).onConflictDoNothing();
    }
    console.log(`✓ Inserted ${hooksData.length} hook entries`);

    // Seed Storytelling Frameworks
    console.log('Seeding storytelling frameworks...');
    for (const item of storytellingFrameworksData) {
      await db.insert(storytellingFrameworks).values(item).onConflictDoNothing();
    }
    console.log(`✓ Inserted ${storytellingFrameworksData.length} storytelling framework entries`);

    // Seed Growth Stage Guides
    console.log('Seeding growth stage guides...');
    for (const item of growthStageGuidesData) {
      await db.insert(growthStageGuides).values(item).onConflictDoNothing();
    }
    console.log(`✓ Inserted ${growthStageGuidesData.length} growth stage guide entries`);

    // Seed Response Templates
    console.log('Seeding response templates...');
    for (const item of responseTemplatesData) {
      await db.insert(responseTemplates).values(item).onConflictDoNothing();
    }
    console.log(`✓ Inserted ${responseTemplatesData.length} response template entries`);

    // Seed Live Streaming Templates
    console.log('Seeding live streaming templates...');
    for (const item of liveStreamingTemplatesData) {
      await db.insert(liveStreamingTemplates).values(item).onConflictDoNothing();
    }
    console.log(`✓ Inserted ${liveStreamingTemplatesData.length} live streaming template entries`);

    // Seed Script Templates
    console.log('Seeding script templates...');
    for (const item of scriptTemplatesData) {
      await db.insert(scriptTemplates).values(item).onConflictDoNothing();
    }
    console.log(`✓ Inserted ${scriptTemplatesData.length} script template entries`);

    console.log('\n✅ Expert Knowledge Base seeding completed successfully!');
    console.log('Summary:');
    console.log(`  - Expert Knowledge: ${expertKnowledgeData.length}`);
    console.log(`  - Hooks: ${hooksData.length}`);
    console.log(`  - Storytelling Frameworks: ${storytellingFrameworksData.length}`);
    console.log(`  - Growth Stage Guides: ${growthStageGuidesData.length}`);
    console.log(`  - Response Templates: ${responseTemplatesData.length}`);
    console.log(`  - Live Streaming Templates: ${liveStreamingTemplatesData.length}`);
    console.log(`  - Script Templates: ${scriptTemplatesData.length}`);
    
  } catch (error) {
    console.error('Error seeding Expert Knowledge Base:', error);
    throw error;
  }
}

export { seedExpertKnowledge };
