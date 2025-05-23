// utils/mock/mockPets.js

import { faker } from '@faker-js/faker';

export const generateMockPet = () => ({
    name: faker.animal.cat(),
    specie: faker.helpers.arrayElement(['Dog', 'Cat', 'Rabbit', 'Bird']),
    breed: faker.animal.type(),
    age: faker.number.int({ min: 1, max: 15 }),
    description: faker.lorem.sentence(),
    adopted: false // faker.datatype.boolean()
});

export const generateMockPets = (amountOf) => {
    let pets = [];
    for (let i = 0; i < amountOf; i++) {
        pets.push(generateMockPet());
    }
    return pets;
};