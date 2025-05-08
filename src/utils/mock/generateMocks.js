// utils/mock/generateMocks.js

import { faker } from '@faker-js/faker';

export const generateMockUser = () => {
    const first_name = faker.person.firstName();
    const last_name = faker.person.lastName();
    const domain = faker.internet.domainName();

    return {
        first_name,
        last_name,
        username: faker.internet.username({ firstName: first_name, lastName: last_name }),
        email: `${first_name.toLowerCase()}_${last_name.toLowerCase()}@${domain}`,
        password: faker.internet.password(),
        age: faker.number.int({ min: 18, max: 70 }),
        city: faker.location.city(),
        bio: faker.lorem.sentence()
    };
};


export const generateMockPet = () => ({
    name: faker.animal.cat(), // or .dog(), etc.
    specie: faker.helpers.arrayElement(['Dog', 'Cat', 'Rabbit', 'Bird']),
    breed: faker.animal.type(),
    age: faker.number.int({ min: 1, max: 15 }),
    description: faker.lorem.sentence(),
    adopted: faker.datatype.boolean()
});
