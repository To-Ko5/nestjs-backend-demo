import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Item } from '../entities/item.entity'
import { CreateItemDto } from './dto/create-item.dto'
import { ItemStatus } from './item-status.enum'

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>
  ) {}
  private items: Item[] = []

  async findAll(): Promise<Item[]> {
    return await this.itemsRepository.find()
  }

  async findById(id: string): Promise<Item> {
    const findItem = await this.itemsRepository.findOne(id)
    if (!findItem) {
      throw new NotFoundException()
    }
    return findItem
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const { name, price, description } = createItemDto
    const item = this.itemsRepository.create({
      name,
      price,
      description,
      status: ItemStatus.ON_SALE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    await this.itemsRepository.save(item)
    return item
  }

  // updateStatus(id: string): Item {
  //   const findItem = this.items.find((item) => item.id === id)
  //   findItem.status = ItemStatus.SOLD_OUT
  //   return findItem
  // }

  delete(id: string): void {
    this.items = this.items.filter((item) => item.id !== id)
  }
}
