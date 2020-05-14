import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';

interface IRequest {
  name: string;
  email: string;
}

@injectable()
class CreateCustomerService {
  constructor(
    @inject('ICustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ name, email }: IRequest): Promise<Customer> {
    const existingCustomer = await this.customersRepository.findByEmail(email);

    if (existingCustomer) {
      throw new AppError('Customer already exists');
    }

    return this.customersRepository.create({
      email,
      name,
    });
  }
}

export default CreateCustomerService;
