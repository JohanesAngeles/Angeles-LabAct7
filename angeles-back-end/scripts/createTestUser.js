const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../src/models/User');

dotenv.config();

const createTestUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Delete existing test users to recreate them with new schema
    await User.deleteMany({ 
      email: { $in: ['johan@test.com', 'editor@test.com', 'user@test.com'] } 
    });
    console.log('Cleared existing test users');

    // Create test user Johan with NEW SCHEMA
    const testUser = await User.create({
      firstName: 'Johan',        // NEW REQUIRED FIELD
      lastName: 'Angeles',       // NEW REQUIRED FIELD
      age: 25,                   // OPTIONAL
      gender: 'male',            // OPTIONAL
      mobile: '09123456789',     // OPTIONAL
      address: 'Marikina City, Metro Manila, PH',  // OPTIONAL
      username: 'Johan',
      email: 'johan@test.com',
      password: 'password123',
      role: 'admin'
    });

    console.log('Test user Johan created successfully:', {
      firstName: testUser.firstName,
      lastName: testUser.lastName,
      username: testUser.username,
      email: testUser.email,
      role: testUser.role
    });
    
    // Create additional test users for demo with NEW SCHEMA
    const additionalUsers = [
      {
        firstName: 'Jane',         // NEW REQUIRED FIELD
        lastName: 'Editor',        // NEW REQUIRED FIELD
        age: 28,
        gender: 'female',
        mobile: '09187654321',
        address: 'Quezon City, Metro Manila, PH',
        username: 'Editor1',
        email: 'editor@test.com',
        password: 'password123',
        role: 'editor'
      },
      {
        firstName: 'John',         // NEW REQUIRED FIELD
        lastName: 'User',          // NEW REQUIRED FIELD
        age: 30,
        gender: 'male',
        mobile: '09123456780',
        address: 'Manila, Metro Manila, PH',
        username: 'User1',
        email: 'user@test.com',
        password: 'password123',
        role: 'user'
      },
      {
        firstName: 'Johanes',      // NEW REQUIRED FIELD
        lastName: 'Angeles',       // NEW REQUIRED FIELD
        age: 23,
        gender: 'male',
        mobile: '+639164292063',
        address: 'Marikina City, Metro Manila, PH',
        username: 'Johanes',
        email: 'angeles.johanes@gmail.com',
        password: 'password123',
        role: 'editor'
      }
    ];

    for (const userData of additionalUsers) {
      const createdUser = await User.create(userData);
      console.log(`Created user: ${createdUser.firstName} ${createdUser.lastName} (${createdUser.role})`);
    }
    
    console.log('\n✅ All test users created successfully with NEW SCHEMA!');
    console.log('\n🔑 Login Credentials:');
    console.log('👑 Admin: johan@test.com / password123');
    console.log('✏️  Editor: editor@test.com / password123');
    console.log('👤 User: user@test.com / password123');
    console.log('✏️  Editor: angeles.johanes@gmail.com / password123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating test users:', error);
    process.exit(1);
  }
};

createTestUser();