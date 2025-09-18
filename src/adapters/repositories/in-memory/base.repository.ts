import { IBaseRepository } from '@/application/dependency-interfaces/repositories/base.repository.js';

export class InMemoryRepository<T extends { id: string }> implements IBaseRepository<T> {
  constructor(protected items: T[] = []) {}

  async findById(id: string): Promise<T | null> {
    const item = this.items.find((i) => i.id === id);
    return Promise.resolve(item || null);
  }

  async findAll(): Promise<T[]> {
    return Promise.resolve(this.items);
  }

  async add(item: T): Promise<T> {
    this.items.push(item);
    return Promise.resolve(item);
  }

  async update(item: T): Promise<T> {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index === -1) {
      throw new Error(`Not found`);
    }
    this.items[index] = item;
    return Promise.resolve(item);
  }

  async delete(item: T): Promise<void> {
    const index = this.items.findIndex((i) => i.id === item.id);
    if (index === -1) {
      throw new Error(`Not found`);
    }
    this.items.splice(index, 1);
    return Promise.resolve();
  }
}
