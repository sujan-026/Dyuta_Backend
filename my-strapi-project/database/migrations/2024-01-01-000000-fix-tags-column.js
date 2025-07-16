'use strict';

/**
 * Migration to fix the tags column type conversion issue
 * This migration handles the conversion from JSON to JSONB safely
 */

async function up(knex) {
  try {
    console.log('Starting tags column migration...');

    // Check if events table exists
    const tableExists = await knex.schema.hasTable('events');
    if (!tableExists) {
      console.log('Events table does not exist. Skipping migration.');
      return;
    }

    // Check if tags column exists
    const columnExists = await knex.schema.hasColumn('events', 'tags');
    if (!columnExists) {
      console.log('Tags column does not exist. Skipping migration.');
      return;
    }

    // Clean invalid JSON data before conversion
    console.log('Cleaning invalid JSON data...');
    
    const events = await knex('events')
      .select('id', 'tags')
      .whereNotNull('tags')
      .where('tags', '!=', '');

    console.log(`Found ${events.length} events with tags data`);

    for (const event of events) {
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
          const cleaned = event.tags.trim();
          
          // If it looks like a simple string, convert to array
          if (cleaned && !cleaned.startsWith('[') && !cleaned.startsWith('{')) {
            try {
              const tagsArray = cleaned.split(',').map(tag => tag.trim()).filter(tag => tag);
              fixedTags = JSON.stringify(tagsArray);
              console.log(`Fixed event ${event.id}: ${cleaned} -> ${fixedTags}`);
            } catch (e) {
              console.log(`Could not fix event ${event.id}, setting to null`);
              fixedTags = null;
            }
          } else {
            console.log(`Could not fix event ${event.id}, setting to null`);
            fixedTags = null;
          }
        } else {
          console.log(`Could not fix event ${event.id}, setting to null`);
          fixedTags = null;
        }

        // Update the record with fixed or null tags
        await knex('events')
          .where('id', event.id)
          .update({ tags: fixedTags });
      }
    }

    // For PostgreSQL, convert to JSONB
    if (knex.client.config.client === 'postgres') {
      console.log('Converting tags column to JSONB for PostgreSQL...');
      await knex.raw(`
        ALTER TABLE events 
        ALTER COLUMN tags TYPE jsonb 
        USING CASE 
          WHEN tags IS NULL THEN NULL 
          ELSE tags::jsonb 
        END
      `);
    } else {
      console.log('Non-PostgreSQL database detected. Column type conversion skipped.');
    }

    console.log('Tags column migration completed successfully.');

  } catch (error) {
    console.error('Error during tags migration:', error);
    throw error;
  }
}

async function down(knex) {
  try {
    console.log('Rolling back tags column migration...');
    
    if (knex.client.config.client === 'postgres') {
      // Convert back to JSON type for PostgreSQL
      await knex.raw(`
        ALTER TABLE events 
        ALTER COLUMN tags TYPE json 
        USING CASE 
          WHEN tags IS NULL THEN NULL 
          ELSE tags::json 
        END
      `);
    } else {
      console.log('Non-PostgreSQL database detected. Rollback skipped.');
    }
    
    console.log('Tags column rollback completed.');
  } catch (error) {
    console.error('Error during tags migration rollback:', error);
    throw error;
  }
}

module.exports = { up, down }; 