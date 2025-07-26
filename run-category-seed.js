const { createStrapi, compileStrapi } = require('@strapi/strapi');

async function main() {
  try {
    console.log('Compiling Strapi...');
    const appContext = await compileStrapi();
    
    console.log('Creating Strapi instance...');
    const app = await createStrapi(appContext).load();
    
    console.log('Running category seed...');
    const { seedCategories, setPublicPermissions } = require('./scripts/seed-categories');
    
    // Set public permissions
    await setPublicPermissions();
    
    // Seed categories and subcategories
    await seedCategories();
    
    console.log('Category seeding completed successfully!');
    
    await app.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error during category seeding:', error);
    process.exit(1);
  }
}

main(); 