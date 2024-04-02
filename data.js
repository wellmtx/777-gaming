const fs = require("fs");
const { faker } = require("@faker-js/faker");

const functionGenerate = () => {
  var f = "./db.json";

  const file = fs.existsSync(f, "w");

  if (file) {
    fs.unlinkSync(f);
  }

  const data = {
    users: [],
    deposits: [],
    withdrawals: [],
    wallets: [],
  };

  for (let i = 1; i < faker.number.int({ min: 200, max: 750 }); i++) {
    data.users.push({
      id: i,
      name: `user${i}`,
      newUser: faker.datatype.boolean(),
      blocked: faker.datatype.boolean(),
      kyc: ["pending", "approved"][faker.number.int({ min: 0, max: 1 })],
      createdAt: faker.date.recent({ days: 365 }),
    });
  }

  for (const user of data.users) {
    data.wallets.push({
      userId: user.id,
      balance: faker.number.float({ min: 0, max: 5000 }),
      bonusBalance: faker.number.float({ min: 0, max: 5000 }),
      demoBalance: faker.number.float({ min: 0, max: 5000 }),
      createdAt: faker.date.recent({ days: 365 }),
    });

    for (let i = 0; i < faker.number.int({ min: 10, max: 50 }); i++) {
      data.deposits.push({
        userId: user.id,
        amount: faker.number.float({ min: 0, max: 5000 }),
        createdAt: faker.date.recent({ days: 365 }),
      });
    }

    for (let i = 0; i < faker.number.int({ min: 10, max: 25 }); i++) {
      data.withdrawals.push({
        userId: user.id,
        amount: faker.number.float({ min: 0, max: 5000 }),
        createdAt: faker.date.recent({ days: 365 }),
      });
    }
  }

  fs.writeFile(f, JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File has been created");
  });
};

functionGenerate();
