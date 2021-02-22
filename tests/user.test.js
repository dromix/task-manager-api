const request = require('supertest');
const app = require('../src/app');

const { User, userOneId, userOne, setupDB} = require('./fixtures/db');

beforeEach(setupDB)

it('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Serhii',
        email: 'kalyuzhni.sergei@gmail.com',
        password: 'mypassqwerty'
    }).expect(201);

    // Assert that the database was changed correctly 
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    // Assertions about the response
    expect(response.body).toMatchObject({
        user: {
            name: 'Serhii',
            email: 'kalyuzhni.sergei@gmail.com',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('mypassqwerty');

});

it('Should login to an existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password  
    }).expect(200);

    // Assert that the database was changed correctly 
    const user = await User.findById(userOneId);
    expect(response.body.token).toBe(user.tokens[1].token);
});

it(`Shouldn't login to an nonexisting user`, async () => {
    await request(app).post('/users/login').send({
        email: 'test@mail.ru',
        password: userOne.password  
    }).expect(400);
});

it(`Should get profile for user`, async () => {
    await request(app).get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

it(`Shouldn't get profile for non-logined user`, async () => {
    await request(app).get('/users/me')
    .send()
    .expect(401);
});

it(`Should delete account for user`, async () => {
    await request(app).delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user).toBeNull();
}); 

it(`Should'n delete account for non-logined user`, async () => {
    await request(app).delete('/users/me')
    .send()
    .expect(401);
});

it(`Should upload avatar image`, async () => {
    await request(app).post('/users/me/avatar')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .attach('avatar', 'tests/fixtures/looking.jpg')
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

it(`Should update valid user fields`, async () => {
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({name: 'Vasya'})
    .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toBe('Vasya')
}); 

it(`Should'n update invalid user fields`, async () => {
    await request(app).patch('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send({location: 'Vasya'})
    .expect(400);
}); 
