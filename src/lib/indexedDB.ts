type DB_TodoType = {
  id: string;
  uid: string;
  content: string;
};

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
        db.createObjectStore(this.STORE_NAME, { keyPath: "id" });
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
  public add(data: DB_TodoType): Promise<boolean> {
    return new Promise((resolve) => {
      const store = this.getTransactionObjectStore("readwrite");
      const request = store.add(data);

      request.onsuccess = () => resolve(true);

      request.onerror = () => resolve(false);
    });
  }

  public async update(id: string, content: string): Promise<boolean> {
    const oldData = await this.get(id);
    if (!oldData) throw new Error("未找到对应数据");

    return new Promise((resolve) => {
      const store = this.getTransactionObjectStore("readwrite");
      const request = store.put({ ...oldData, content });

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    });
  }

  public get(id: string): Promise<DB_TodoType | null> {
    return new Promise((resolve) => {
      const store = this.getTransactionObjectStore("readonly");
      const request = store.get(id);

      request.onsuccess = (event) => {
        const result = (event.target as IDBRequest).result;
        resolve(result ? result : null);
      };

      request.onerror = () => resolve(null);
    });
  }

  public delete(id: string): Promise<boolean> {
    return new Promise((resolve) => {
      const store = this.getTransactionObjectStore("readwrite");
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);

      request.onerror = () => resolve(false);
    });
  }
}
