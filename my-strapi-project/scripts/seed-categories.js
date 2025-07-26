'use strict';

// Categories and subcategories data based on the frontend
const categoriesData = {
  "Trending": {
    "name": "Trending",
    "slug": "trending",
    "description": "Trending markets and breaking news",
    "subcategories": [
      "Breaking News",
      "Geopolitics",
      "Trump Presidency",
      "NBA Playoffs",
      "Poland",
      "South Korea",
      "Trade War",
      "AI",
      "Big Beautiful Bill",
      "Israel",
      "Biden",
      "NOLA Prison Break",
      "Diddy",
      "Crypto Prices",
      "Global Elections",
      "Courts",
      "Middle East",
      "Ukraine",
      "Taxes",
      "China",
      "Canada",
      "Treasuries",
      "DOGE",
      "Elon Musk",
      "Iran",
      "Gaza",
      "Recurring",
      "Bitcoin",
      "Weather",
      "Movies"
    ]
  },
  "Politics": {
    "name": "Politics",
    "slug": "politics",
    "description": "Political events and government affairs",
    "subcategories": [
      "Trump Presidency",
      "Trade War",
      "Geopolitics",
      "South Korea",
      "Romania",
      "Courts",
      "Middle East",
      "Congress",
      "NYC Mayor",
      "Ukraine",
      "Gaza",
      "Israel",
      "DOGE",
      "Global Elections",
      "Cabinet",
      "Senate",
      "US Election"
    ]
  },
  "Crypto": {
    "name": "Crypto",
    "slug": "crypto",
    "description": "Cryptocurrency markets and blockchain events",
    "subcategories": [
      "1H",
      "Today 🚀",
      "Featured",
      "May 30",
      "June 3",
      "Hit Price",
      "MicroStrategy",
      "Stablecoins",
      "Crypto Prices",
      "Airdrops",
      "Bitcoin",
      "Crypto Reserve",
      "Ethereum",
      "Memecoins"
    ]
  },
  "Tech": {
    "name": "Tech",
    "slug": "tech",
    "description": "Technology and innovation markets",
    "subcategories": [
      "AI",
      "Elon Musk",
      "Meta vs FTC",
      "Science",
      "SpaceX",
      "OpenAI",
      "MicroStrategy",
      "Big Tech",
      "TikTok"
    ]
  },
  "Culture": {
    "name": "Culture",
    "slug": "culture",
    "description": "Cultural events and entertainment",
    "subcategories": [
      "Tweet Markets",
      "NOLA Prison Break",
      "Movies",
      "Courts",
      "Weather",
      "Diddy",
      "GTA VI",
      "Kanye",
      "Global Temp",
      "Mentions",
      "Celebrities",
      "New Pope",
      "Elon Musk",
      "Music",
      "Pandemics",
      "Reality TV",
      "Awards"
    ]
  },
  "World": {
    "name": "World",
    "slug": "world",
    "description": "International events and global affairs",
    "subcategories": [
      "Middle East",
      "Global Elections",
      "Gaza",
      "South Korea",
      "Romania",
      "Israel",
      "Geopolitics",
      "China",
      "Iran",
      "Ukraine",
      "Canada",
      "New Pope",
      "India-Pakistan",
      "Yemen"
    ]
  },
  "Economy": {
    "name": "Economy",
    "slug": "economy",
    "description": "Economic indicators and financial markets",
    "subcategories": [
      "Trade War",
      "Fed Rates",
      "Inflation",
      "Taxes",
      "Macro Indicators"
    ]
  },
  "Trump": {
    "name": "Trump",
    "slug": "trump",
    "description": "Donald Trump related markets and events",
    "subcategories": [
      "Trade War",
      "Foreign Policy",
      "Cabinet",
      "DOGE",
      "Executive Actions",
      "MAGA",
      "Economic Policy",
      "Approval",
      "Crypto Policy",
      "Immigration/Border",
      "Social Policy"
    ]
  },
  "Sports": {
    "name": "Sports",
    "slug": "sports",
    "description": "Sports events and athletic competitions",
    "subcategories": [
      "NBA Playoffs",
      "NFL",
      "MLB",
      "Soccer",
      "Tennis",
      "Golf",
      "UFC",
      "Boxing",
      "Olympics"
    ]
  },
  "Elections": {
    "name": "Elections",
    "slug": "elections",
    "description": "Election markets and political campaigns",
    "subcategories": [
      "US Election",
      "Global Elections",
      "Poland",
      "South Korea",
      "Romania",
      "India"
    ]
  }
};

async function seedCategories() {
  try {
    console.log('Starting category and subcategory seeding...');

    // Create categories first
    const createdCategories = {};
    
    for (const [categoryKey, categoryData] of Object.entries(categoriesData)) {
      console.log(`Creating category: ${categoryData.name}`);
      
      // Create the category
      const category = await strapi.entityService.create('api::category.category', {
        data: {
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
          publishedAt: new Date()
        }
      });
      
      createdCategories[categoryKey] = category;
      console.log(`Created category: ${category.name} with ID: ${category.id}`);
      
      // Create subcategories for this category
      for (const subcategoryName of categoryData.subcategories) {
        console.log(`Creating subcategory: ${subcategoryName} for category: ${categoryData.name}`);
        
        const subcategory = await strapi.entityService.create('api::subcategory.subcategory', {
          data: {
            name: subcategoryName,
            slug: subcategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            description: `${subcategoryName} subcategory under ${categoryData.name}`,
            category: category.id,
            publishedAt: new Date()
          }
        });
        
        console.log(`Created subcategory: ${subcategory.name} with ID: ${subcategory.id}`);
      }
    }
    
    console.log('Category and subcategory seeding completed successfully!');
    console.log(`Created ${Object.keys(categoriesData).length} categories`);
    
    const totalSubcategories = Object.values(categoriesData).reduce((total, category) => {
      return total + category.subcategories.length;
    }, 0);
    
    console.log(`Created ${totalSubcategories} subcategories`);
    
  } catch (error) {
    console.error('Error during category seeding:', error);
    throw error;
  }
}

async function setPublicPermissions() {
  try {
    // Find the ID of the public role
    const publicRole = await strapi.query('plugin::users-permissions.role').findOne({
      where: {
        type: 'public',
      },
    });

    if (!publicRole) {
      console.log('Public role not found, creating permissions for authenticated users...');
      return;
    }

    // Set permissions for categories and subcategories
    const permissionsToCreate = [
      'api::category.category.find',
      'api::category.category.findOne',
      'api::subcategory.subcategory.find',
      'api::subcategory.subcategory.findOne'
    ];

    for (const permissionAction of permissionsToCreate) {
      await strapi.query('plugin::users-permissions.permission').create({
        data: {
          action: permissionAction,
          role: publicRole.id,
        },
      });
    }

    console.log('Public permissions set for categories and subcategories');
  } catch (error) {
    console.error('Error setting permissions:', error);
  }
}

async function main() {
  try {
    console.log('Starting category seeding process...');
    
    // Set public permissions
    await setPublicPermissions();
    
    // Seed categories and subcategories
    await seedCategories();
    
    console.log('Category seeding process completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Category seeding failed:', error);
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = {
  seedCategories,
  setPublicPermissions,
  categoriesData
};

// Run if this script is executed directly
if (require.main === module) {
  main();
} 