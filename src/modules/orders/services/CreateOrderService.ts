import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICustomersRepository from '@modules/customers/repositories/ICustomersRepository';
import Order from '@modules/orders/infra/typeorm/entities/Order';
import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import Product from '@modules/products/infra/typeorm/entities/Product';

interface IProduct {
  id: string;
  quantity: number;
}

interface IRequest {
  customer_id: string;
  products: IProduct[];
}

@injectable()
class CreateProductService {
  constructor(
    @inject('IOrdersRepository')
    private ordersRepository: IOrdersRepository,

    @inject('IProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('ICustomersRepository')
    private customersRepository: ICustomersRepository,
  ) {}

  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const customer = await this.customersRepository.findById(customer_id);

    if (!customer) {
      throw new AppError('Customer does not exist');
    }

    const currentStockList = await this.productsRepository.findAllById(
      products,
    );

    if (currentStockList.length !== products.length) {
      throw new AppError('Product does not exist');
    }

    const remainingProductList = [] as Product[];
    const orderedProductList = [] as Product[];

    products.forEach(orderedProduct => {
      const currentStock = currentStockList.find(
        product => product.id === orderedProduct.id,
      );

      if (!currentStock) {
        throw new AppError('Product does not exist');
      }

      if (orderedProduct.quantity > currentStock.quantity) {
        throw new AppError('Insuficient quantity');
      }

      remainingProductList.push({
        ...currentStock,
        quantity: currentStock.quantity - orderedProduct.quantity,
      });

      orderedProductList.push({
        ...currentStock,
        quantity: orderedProduct.quantity,
      });
    });

    await this.productsRepository.updateQuantity(remainingProductList);

    const productsList = orderedProductList.map(product => ({
      product_id: product.id,
      price: product.price,
      quantity: product.quantity,
    }));

    return this.ordersRepository.create({
      customer,
      products: productsList,
    });
  }
}

export default CreateProductService;
