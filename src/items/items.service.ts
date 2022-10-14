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

  async updateStatus(id: string): Promise<Item> {
    const findItem = await this.itemsRepository.findOne(id)
    findItem.status = ItemStatus.SOLD_OUT
    findItem.updatedAt = new Date().toISOString()
    this.itemsRepository.save(findItem)
    return findItem
  }

  async delete(id: string): Promise<void> {
    this.itemsRepository.delete(id)
  }
}
