require('dotenv').load({ path: __dirname + '/.env' }); //process.env.SECRET
const Appointment = require('./models/appointment.model');
const Block = require('./models/block.model');
const Buddy = require('./models/buddy.model');
const Category = require('./models/category.model');
const User = require('./models/user.model');

async function createDemoData() {
  const categories = await createCategories()
  const blocks = await createBlocks()
  const buddies = await createBuddies()
  const users = await createUsers(buddies)
}

async function create(filepath, Class, modify) {
  console.info("inserting", filepath)
  const documents = require(filepath)
  if (modify) {
    documents.forEach(modify)
  }
  return Class.insertMany(documents)
}

async function createCategories() {
  return create('./demo_data/categories', Category)
}

async function createBuddies() {
  return create('./demo_data/buddies', Buddy)
}
async function createBlocks() {
  return create('./demo_data/blocks', Block)
}

async function createUsers(buddies) {
  return create('./demo_data/users', User, (user, index) => {
    user.buddy_id = buddies[index]
  })
}

createDemoData()
  .then(() => {
    console.log("created demo data successful")
    process.exit(0)
  })
  .catch((error) => {
    console.error("created demo data unsuccessful")
    console.error(error)
    process.exit(-1)
  })



