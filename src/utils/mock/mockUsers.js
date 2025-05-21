
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
        password: 'coder123',
        age: faker.number.int({ min: 18, max: 70 }),
        city: faker.location.city(),
        bio: faker.lorem.sentence(),
        role: 'user',
        pets: []
    };
};

export const generateMockUsers = (amountOf) => {

    let users = []
    for (let i=0; i<amountOf; i++){
        users.push(generateMockUser())
    }
    return users

};