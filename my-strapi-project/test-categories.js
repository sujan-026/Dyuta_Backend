const axios = require('axios');

const API_BASE_URL = 'http://localhost:1337/api';

async function testCategoriesAPI() {
  try {
    console.log('Testing Categories and Subcategories API...\n');

    // Test 1: Get all categories
    console.log('1. Testing GET /api/categories');
    const categoriesResponse = await axios.get(`${API_BASE_URL}/categories`);
    console.log(`   Status: ${categoriesResponse.status}`);
    console.log(`   Categories found: ${categoriesResponse.data.data.length}`);
    console.log(`   Categories: ${categoriesResponse.data.data.map(cat => cat.attributes.name).join(', ')}\n`);

    // Test 2: Get categories with subcategories populated
    console.log('2. Testing GET /api/categories?populate=subcategories');
    const categoriesWithSubsResponse = await axios.get(`${API_BASE_URL}/categories?populate=subcategories`);
    console.log(`   Status: ${categoriesWithSubsResponse.status}`);
    console.log(`   Categories with subcategories: ${categoriesWithSubsResponse.data.data.length}`);
    
    // Show subcategories for first category
    const firstCategory = categoriesWithSubsResponse.data.data[0];
    if (firstCategory.attributes.subcategories && firstCategory.attributes.subcategories.data) {
      console.log(`   Subcategories for "${firstCategory.attributes.name}": ${firstCategory.attributes.subcategories.data.length}`);
    }
    console.log('');

    // Test 3: Get all subcategories
    console.log('3. Testing GET /api/subcategories');
    const subcategoriesResponse = await axios.get(`${API_BASE_URL}/subcategories`);
    console.log(`   Status: ${subcategoriesResponse.status}`);
    console.log(`   Subcategories found: ${subcategoriesResponse.data.data.length}\n`);

    // Test 4: Get subcategories for a specific category
    if (categoriesResponse.data.data.length > 0) {
      const firstCategoryId = categoriesResponse.data.data[0].id;
      console.log(`4. Testing GET /api/subcategories?filters[category][id][$eq]=${firstCategoryId}`);
      const subcategoriesByCategoryResponse = await axios.get(`${API_BASE_URL}/subcategories?filters[category][id][$eq]=${firstCategoryId}`);
      console.log(`   Status: ${subcategoriesByCategoryResponse.status}`);
      console.log(`   Subcategories for category ID ${firstCategoryId}: ${subcategoriesByCategoryResponse.data.data.length}`);
      
      if (subcategoriesByCategoryResponse.data.data.length > 0) {
        const categoryName = categoriesResponse.data.data[0].attributes.name;
        const subcategoryNames = subcategoriesByCategoryResponse.data.data.map(sub => sub.attributes.name).slice(0, 5);
        console.log(`   Sample subcategories for "${categoryName}": ${subcategoryNames.join(', ')}${subcategoriesByCategoryResponse.data.data.length > 5 ? '...' : ''}`);
      }
      console.log('');
    }

    // Test 5: Get a specific category by ID
    if (categoriesResponse.data.data.length > 0) {
      const firstCategoryId = categoriesResponse.data.data[0].id;
      console.log(`5. Testing GET /api/categories/${firstCategoryId}`);
      const specificCategoryResponse = await axios.get(`${API_BASE_URL}/categories/${firstCategoryId}`);
      console.log(`   Status: ${specificCategoryResponse.status}`);
      console.log(`   Category: ${specificCategoryResponse.data.data.attributes.name}`);
      console.log(`   Slug: ${specificCategoryResponse.data.data.attributes.slug}`);
      console.log(`   Description: ${specificCategoryResponse.data.data.attributes.description || 'No description'}\n`);
    }

    console.log('✅ All API tests completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Categories: ${categoriesResponse.data.data.length}`);
    console.log(`   - Subcategories: ${subcategoriesResponse.data.data.length}`);
    console.log(`   - API endpoints are working correctly`);

  } catch (error) {
    console.error('❌ Error testing API:', error.response?.data || error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your Strapi server is running on http://localhost:1337');
      console.log('   Run: npm run develop');
    }
  }
}

// Run the test
testCategoriesAPI(); 