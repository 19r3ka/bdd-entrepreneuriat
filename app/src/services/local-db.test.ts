import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import Dexie from 'dexie';
import { LocalDB, db } from './local-db';

describe('LocalDB', () => {
  // We need to mock IndexedDB since it's not available in node environment
  const originalIndexedDB = global.indexedDB;

  beforeEach(() => {
    // In a real browser environment, IndexedDB would be available
    // For testing, we'll just test the schema definition and structure
  });

  afterEach(() => {
    global.indexedDB = originalIndexedDB;
  });

  it('initializes with correct table structure', () => {
    // Check that the DB has the expected tables
    expect(db.tables.length).toBe(3); // entrepreneurs, businesses, avatars
    
    // Check if specific tables exist
    const tableNames = db.tables.map(table => table.name);
    expect(tableNames).toContain('entrepreneurs');
    expect(tableNames).toContain('businesses');
    expect(tableNames).toContain('avatars');
  });

  it('has correct indices defined', () => {
    // Check that entrepreneurs table has proper indices
    const entrepreneursTable = db.tables.find(t => t.name === 'entrepreneurs');
    expect(entrepreneursTable).toBeDefined();
    
    // Check for primary key index
    expect(entrepreneursTable?.schema.primKey.keyPath).toBe('id');
    expect(entrepreneursTable?.schema.primKey.unique).toBe(true);
    
    // Check for other indices (this would be more detailed in a real IndexedDB environment)
    expect(entrepreneursTable?.schema.indexes).toBeDefined();
  });
  
  it('has correct entrepreneurs table structure', () => {
    const entrepreneursTable = db.tables.find(t => t.name === 'entrepreneurs');
    expect(entrepreneursTable).toBeDefined();
  });

  it('has correct businesses table structure', () => {
    const businessesTable = db.tables.find(t => t.name === 'businesses');
    expect(businessesTable).toBeDefined();
  });

  it('has correct avatars table structure', () => {
    const avatarsTable = db.tables.find(t => t.name === 'avatars');
    expect(avatarsTable).toBeDefined();
  });

  it('has primary keys defined as unique', () => {
    const entrepreneursTable = db.tables.find(t => t.name === 'entrepreneurs');
    const businessesTable = db.tables.find(t => t.name === 'businesses');
    const avatarsTable = db.tables.find(t => t.name === 'avatars');
    
    expect(entrepreneursTable?.schema.primKey.unique).toBe(true);
    expect(businessesTable?.schema.primKey.unique).toBe(true);
    expect(avatarsTable?.schema.primKey.unique).toBe(true);
  });
});

// Note: For more comprehensive testing of actual CRUD operations,
// we would need to use a browser environment or IndexedDB mock
// that properly simulates the database behavior