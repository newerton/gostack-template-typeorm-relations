import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    return this.ormRepository.save({
      name,
      price,
      quantity,
    });
  }

  public async findByName(name: string): Promise<Product | undefined> {
    return this.ormRepository.findOne({ name });
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const productIdList = products.map(item => item.id);

    const productList = await this.ormRepository.find({
      where: { id: In(productIdList) },
    });

    return productList;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    return this.ormRepository.save(products);
  }
}

export default ProductsRepository;
