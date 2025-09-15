export interface IBaseRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  add(entity: T): Promise<T>;
  update(entity: T): Promise<T>;
  delete(entity: T): Promise<void>;
}
