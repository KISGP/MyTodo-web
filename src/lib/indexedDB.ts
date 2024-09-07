import { TodoBaseType } from "@/store";

type DB_TodoType = Omit<TodoBaseType, "isSelected">;

export default class IndexedDBHelper {
  private DB_NAME = "IndexedDB";
  private VERSION = 1;
  private STORE_NAME = "Todo";
  private db: IDBDatabase | null = null;

  constructor() {
    this.openDB();
  }

  private openDB() {
    const request = indexedDB.open(this.DB_NAME, this.VERSION);

    request.onsuccess = (event) => {
      this.db = (event.target as IDBOpenDBRequest).result;
    };

    request.onerror = (event) => {
      console.error("连接 IndexedDB 数据库失败", event);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      // 如果不存在对象仓库，则创建一个
      if (!db.objectStoreNames.contains(this.STORE_NAME)) {
        const store = db.createObjectStore(this.STORE_NAME, { keyPath: "id" });

        store.createIndex("isSaved", "isSaved", { unique: false });
      }
    };
  }

  private checkDBConnection() {
    if (!this.db) throw new Error("未连接到 IndexedDB 数据库");
  }

  private getTransactionObjectStore(mode: IDBTransactionMode) {
    this.checkDBConnection();
    const transaction = this.db!.transaction([this.STORE_NAME], mode);
    return transaction.objectStore(this.STORE_NAME);
  }

  // TODO: 当add一条数据时，将数据保存到服务器
  public add(data: DB_TodoType): Promise<string> {
    return new Promise((resolve, reject) => {
      const store = this.getTransactionObjectStore("readwrite");
      const request = store.add(data);

      request.onsuccess = () => {
        resolve("本地保存成功");
      };

      request.onerror = (event) => {
        reject("本地保存失败: " + event);
      };
    });
  }

  public async update(data: Partial<Omit<DB_TodoType, "id">> & Pick<DB_TodoType, "id">): Promise<string> {
    try {
      this.checkDBConnection();

      const oldData = await this.get(data.id);
      if (!oldData) throw new Error("未找到对应数据");

      const store = this.getTransactionObjectStore("readwrite");

      await new Promise<void>((resolve, reject) => {
        const request = store.put({ ...oldData, ...data });
        request.onsuccess = () => resolve();
        request.onerror = () => reject("更新失败");
      });

      return "更新成功";
    } catch (error) {
      return Promise.reject("更新失败: " + error);
    }
  }

  public get(id: string): Promise<DB_TodoType | null> {
    return new Promise((resolve, reject) => {
      const store = this.getTransactionObjectStore("readonly");
      const request = store.get(id);

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result ? result : null);
      };

      request.onerror = (event) => {
        reject("读取失败: " + event);
      };
    });
  }

  public delete(id: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const store = this.getTransactionObjectStore("readwrite");
      const request = store.delete(id);

      request.onsuccess = () => {
        resolve("删除成功");
      };

      request.onerror = () => {
        reject("删除失败");
      };
    });
  }
}
