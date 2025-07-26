# Categories and Subcategories Collections

This document describes the category and subcategory collections that have been created in the Strapi backend to support the Dyuta frontend filtering system.

## Overview

The backend now includes two new collections:
- **Category**: Top-level grouping of events/markets
- **Subcategory**: Sub-grouping inside categories

These collections are designed to match the filtering system used in the Dyuta frontend.

## Collections Structure

### Category Collection
- **name** (string, required): Display name of the category
- **slug** (uid, required): URL-friendly identifier
- **description** (text): Description of the category
- **image** (media): Optional image for the category
- **subcategories** (relation): One-to-many relationship with subcategories

### Subcategory Collection
- **name** (string, required): Display name of the subcategory
- **slug** (uid, required): URL-friendly identifier
- **description** (text): Description of the subcategory
- **image** (media): Optional image for the subcategory
- **category** (relation): Many-to-one relationship with category

## Available Categories and Subcategories

The following categories have been seeded with their respective subcategories:

### 1. Trending
- Breaking News, Geopolitics, Trump Presidency, NBA Playoffs, Poland, South Korea, Trade War, AI, Big Beautiful Bill, Israel, Biden, NOLA Prison Break, Diddy, Crypto Prices, Global Elections, Courts, Middle East, Ukraine, Taxes, China, Canada, Treasuries, DOGE, Elon Musk, Iran, Gaza, Recurring, Bitcoin, Weather, Movies

### 2. Politics
- Trump Presidency, Trade War, Geopolitics, South Korea, Romania, Courts, Middle East, Congress, NYC Mayor, Ukraine, Gaza, Israel, DOGE, Global Elections, Cabinet, Senate, US Election

### 3. Crypto
- 1H, Today 🚀, Featured, May 30, June 3, Hit Price, MicroStrategy, Stablecoins, Crypto Prices, Airdrops, Bitcoin, Crypto Reserve, Ethereum, Memecoins

### 4. Tech
- AI, Elon Musk, Meta vs FTC, Science, SpaceX, OpenAI, MicroStrategy, Big Tech, TikTok

### 5. Culture
- Tweet Markets, NOLA Prison Break, Movies, Courts, Weather, Diddy, GTA VI, Kanye, Global Temp, Mentions, Celebrities, New Pope, Elon Musk, Music, Pandemics, Reality TV, Awards

### 6. World
- Middle East, Global Elections, Gaza, South Korea, Romania, Israel, Geopolitics, China, Iran, Ukraine, Canada, New Pope, India-Pakistan, Yemen

### 7. Economy
- Trade War, Fed Rates, Inflation, Taxes, Macro Indicators

### 8. Trump
- Trade War, Foreign Policy, Cabinet, DOGE, Executive Actions, MAGA, Economic Policy, Approval, Crypto Policy, Immigration/Border, Social Policy

### 9. Sports
- NBA Playoffs, NFL, MLB, Soccer, Tennis, Golf, UFC, Boxing, Olympics

### 10. Elections
- US Election, Global Elections, Poland, South Korea, Romania, India

## API Endpoints

Once the collections are created and seeded, the following API endpoints will be available:

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get a specific category
- `GET /api/categories/:id?populate=subcategories` - Get category with subcategories

### Subcategories
- `GET /api/subcategories` - Get all subcategories
- `GET /api/subcategories/:id` - Get a specific subcategory
- `GET /api/subcategories?filters[category][id][$eq]=:categoryId` - Get subcategories by category

## Seeding the Data

To seed the categories and subcategories, run one of the following commands:

### Option 1: Run the dedicated category seed script
```bash
cd Backend/my-strapi-project
node run-category-seed.js
```

### Option 2: Run the main seed script (includes categories)
```bash
cd Backend/my-strapi-project
npm run seed
```

## Integration with Frontend

The frontend can now fetch categories and subcategories from the backend API to populate the filtering system. The data structure matches what's expected by the frontend components.

### Example API Usage

```javascript
// Fetch all categories with their subcategories
const response = await fetch('/api/categories?populate=subcategories');
const categories = await response.json();

// Fetch subcategories for a specific category
const categoryId = 1;
const subcategoriesResponse = await fetch(`/api/subcategories?filters[category][id][$eq]=${categoryId}`);
const subcategories = await subcategoriesResponse.json();
```

## Permissions

Public read permissions have been set up for both collections, allowing the frontend to fetch category and subcategory data without authentication.

## Notes

- All categories and subcategories are created with `publishedAt` set to the current date
- Slugs are automatically generated from the names
- The relationship between categories and subcategories is properly established
- The data structure matches the frontend expectations for filtering and navigation 