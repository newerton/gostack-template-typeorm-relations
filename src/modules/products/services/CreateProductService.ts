import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Product from '@modules/products/infra/typeorm/entities/Product';
import IProductsRepository from '@modules/products/repositories/IProductsRepository';

interface IRequest {
  name: string;
  price: number;
  quantity: number;
}

@injectable()
class CreateProductService {
  constructor(
    @inject('IProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const product = await this.productsRepository.findByName(name);

    if (product) {
      throw new AppError('Product exists already', 400);
    }

    return this.productsRepository.create({
      name,
      price,
      quantity,
    });
  }
}

export default CreateProductService;
