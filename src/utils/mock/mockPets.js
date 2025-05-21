// utils/mock/mockPets.js

import { faker } from '@faker-js/faker';

export const generateMockPet = () => ({
    name: faker.animal.cat(), // or .dog(), etc.
    specie: faker.helpers.arrayElement(['Dog', 'Cat', 'Rabbit', 'Bird']),
    breed: faker.animal.type(),
    age: faker.number.int({ min: 1, max: 15 }),
    description: faker.lorem.sentence(),
    adopted: faker.datatype.boolean()
});
