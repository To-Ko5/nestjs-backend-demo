import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/entities/user.entity'
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

  async create(createItemDto: CreateItemDto, user: User): Promise<Item> {
    const { name, price, description } = createItemDto
    const item = this.itemsRepository.create({
      name,
      price,
      description,
      status: ItemStatus.ON_SALE,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      user
    })
    await this.itemsRepository.save(item)
    return item
  }

  async updateStatus(id: string, user: User): Promise<Item> {
    const findItem = await this.itemsRepository.findOne(id)
    if (findItem.userId === user.id) {
      throw new BadRequestException('自身の商品です。')
    }
    findItem.status = ItemStatus.SOLD_OUT
    findItem.updatedAt = new Date().toISOString()
    this.itemsRepository.save(findItem)
    return findItem
  }

  async delete(id: string, user: User): Promise<void> {
    const item = await this.findById(id)
    if (item.userId !== user.id) {
      throw new BadRequestException('他人の商品です。')
    }
    this.itemsRepository.delete(id)
  }
}
