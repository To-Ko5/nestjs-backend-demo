import { Injectable } from '@nestjs/common'
import { ItemStatus } from './item-status.enum'
import { Item } from './item.model'

@Injectable()
export class ItemsService {
  private items: Item[] = []

  findAll(): Item[] {
    return this.items
  }

  findById(id: string): Item {
    const findItem = this.items.find((item) => item.id === id)
    return findItem
  }

  create(item: Item): Item {
    this.items.push(item)
    return item
  }

  updateStatus(id: string): Item {
    const findItem = this.items.find((item) => item.id === id)
    findItem.status = ItemStatus.SOLD_OUT
    return findItem
  }

  delete(id: string): void {
    this.items = this.items.filter((item) => item.id !== id)
  }
}
