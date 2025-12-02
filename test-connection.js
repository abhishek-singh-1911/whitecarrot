const mongoose = require('mongoose');

const uri = "mongodb+srv://keep_admin:uWsgl6cg2sGpz0Z5@keepcluster.jihbs4h.mongodb.net/test?retryWrites=true&w=majority";

console.log('🔌 Attempting to connect...');

mongoose.connect(uri, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => {
    console.log('✅ Connected successfully!');
    console.log('📦 Database:', mongoose.connection.db.databaseName);
    console.log('🔗 Connection details:', {
      host: mongoose.connection.host,
      port: mongoose.connection.port,
      name: mongoose.connection.name
    });

    // Try to get replica set info
    if (mongoose.connection.getClient && mongoose.connection.getClient().topology) {
      const topology = mongoose.connection.getClient().topology;
      console.log('🔧 Topology type:', topology.constructor.name);
    }

    mongoose.disconnect();
    console.log('✅ Test complete!');
  })
  .catch(err => {
    console.error('❌ Connection failed!');
    console.error('Error message:', err.message);
    console.error('\nThis is the SAME DNS SRV error as your Next.js app.');
    console.error('Your machine cannot resolve MongoDB SRV records.');
    process.exit(1);
  });