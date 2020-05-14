import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email } = request.body;

    const customerCreateService = container.resolve(CreateCustomerService);

    const customer = await customerCreateService.execute({
      name,
      email,
    });

    return response.status(200).json(customer);
  }
}
