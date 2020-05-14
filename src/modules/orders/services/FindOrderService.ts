import { inject, injectable } from 'tsyringe';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';

interface IRequest {
  id: string;
}

@injectable()
class FindOrderService {
  constructor(
    @inject('IOrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('IProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('ICustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ id }: IRequest): Promise<Order | undefined> {
    return this.ordersRepository.findById(id);
  }
}

export default FindOrderService;
