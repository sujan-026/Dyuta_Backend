'use strict';

/**
 * Script to fix the tags column migration issue
 * This script cleans any invalid JSON data in the tags column before migration
 */

module.exports = async ({ strapi }) => {
  try {
    console.log('Starting tags column migration fix...');

    // Get the database connection
    const db = strapi.db.connection;
    
    // Check if events table exists and has data
    const tableExists = await db.raw(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'events'
      );
    `);

    if (!tableExists.rows[0].exists) {
      console.log('Events table does not exist yet. No migration needed.');
      return;
    }

    // Check if tags column exists
    const columnExists = await db.raw(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'events' 
        AND column_name = 'tags'
      );
    `);

    if (!columnExists.rows[0].exists) {
      console.log('Tags column does not exist yet. No migration needed.');
      return;
    }

    // Get all events with tags data
    const events = await db.raw(`
      SELECT id, tags 
      FROM events 
      WHERE tags IS NOT NULL 
      AND tags != ''
    `);

    console.log(`Found ${events.rows.length} events with tags data`);

    let fixedCount = 0;
    let nullifiedCount = 0;

    for (const event of events.rows) {
      try {
        // Try to parse the tags as JSON
        if (event.tags) {
          JSON.parse(event.tags);
          // If parsing succeeds, the data is valid
        }
      } catch (parseError) {
        console.log(`Invalid JSON found in event ${event.id}: ${event.tags}`);
        
        // Try to fix common JSON issues
        let fixedTags = null;
        
        if (typeof event.tags === 'string') {
          // Try to fix common string issues
          const cleaned = event.tags.trim();
          
          // If it looks like a simple string, wrap it in quotes
          if (cleaned && !cleaned.startsWith('[') && !cleaned.startsWith('{')) {
            try {
              // Try to parse as a simple array of strings
              const tagsArray = cleaned.split(',').map(tag => tag.trim()).filter(tag => tag);
              fixedTags = JSON.stringify(tagsArray);
              console.log(`Fixed event ${event.id}: ${cleaned} -> ${fixedTags}`);
              fixedCount++;
            } catch (e) {
              console.log(`Could not fix event ${event.id}, setting to null`);
              fixedTags = null;
              nullifiedCount++;
            }
          } else {
            console.log(`Could not fix event ${event.id}, setting to null`);
            fixedTags = null;
            nullifiedCount++;
          }
        } else {
          console.log(`Could not fix event ${event.id}, setting to null`);
          fixedTags = null;
          nullifiedCount++;
        }

        // Update the record with fixed or null tags
        await db.raw(`
          UPDATE events 
          SET tags = ? 
          WHERE id = ?
        `, [fixedTags, event.id]);
      }
    }

    console.log(`Migration fix completed:`);
    console.log(`- Fixed: ${fixedCount} events`);
    console.log(`- Nullified: ${nullifiedCount} events`);
    console.log(`- Total processed: ${events.rows.length} events`);

  } catch (error) {
    console.error('Error during tags migration fix:', error);
    throw error;
  }
}; 