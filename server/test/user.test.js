import { expect } from 'chai';
import fetch from 'node-fetch';

describe('User endpoint test', () => {
  it('Should return user with status 200', async () => {
    const response = await fetch('http://localhost:8080/users/getAll');
    const json = await response.json();

    json.forEach((user) => {
      expect(user).to.be.an('object');
      expect(user._id).to.be.a('string');
      expect(user.username).to.be.a('string');
      expect(user.password).to.be.a('string');
      expect(user.nombre).to.be.a('string');
      expect(user.apellido).to.be.a('string');
      expect(user.edad).to.be.a('number');
      expect(user.telefono).to.be.a('string');
      expect(user.reserves).to.be.an('array');
      expect(user.admin).to.be.a('boolean');
      expect(user.__v).to.be.a('number');
    });

    expect(response.status).to.equal(200);
  });
  it('Should return an object with the correct property types', async () => {
    const response = await fetch('http://localhost:8080/users/getAll');
    const json = await response.json();

    json.forEach((user) => {
      expect(user).to.be.an('object');
      expect(user._id).to.be.a('string');
      expect(user.username).to.be.a('string');
      expect(user.password).to.be.a('string');
      expect(user.nombre).to.be.a('string');
      expect(user.apellido).to.be.a('string');
      expect(user.edad).to.be.a('number');
      expect(user.telefono).to.be.a('string');
      expect(user.reserves).to.be.an('array');
      expect(user.admin).to.be.a('boolean');
      expect(user.__v).to.be.a('number');
    });

  })
});

describe('Testing user services', async () => {

  it('Should return a user according to its id', async function () {

    this.timeout(10000);
    const data = {
      _id: '65c15a43de09d8484fed7b89',
      username: 'marangamatias@gmail.com',
      password: '$2b$10$8f2sAxCx8SRLRI3bLeIZOOFE4PJW1TBCofuRg3O6FPoebnGrHEaee',
      nombre: 'Matias',
      apellido: 'Maranga',
      edad: 43,
      telefono: '12312312312',
      reserves: [],
      admin: false,
      __v: 0
    }

    try {
      const response = await fetch('http://localhost:8080/users/user/65c15a43de09d8484fed7b89');
      const json = await response.json();
  
      expect(json).to.deep.equal(data);
    } catch (error) {
      throw new Error(`Test failed: ${error.message}`);
    }

  })


})

