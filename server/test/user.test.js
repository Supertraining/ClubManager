import request from 'supertest';
import { expect } from 'chai';

import server from '../index.js'
const PORT = 8080;

describe('User endpoint test', () => {
  it('Should return user with status 200', async () => {
    
    const response = await request(server)
      .get('/users/getAll')
      
    console.log(response)
    expect(response.status).to.equal(200)
  })
})