export class Config {
  private readonly _oldNodeBaseUrl: string

  private readonly _newNodeBaseUrl: string

  private readonly _dataFilePath: string

  private readonly _data: any

  constructor(oldNodeBaseUrl: string, newNodeBaseUrl: string, dataFilePath: string, data: any) {
    this._oldNodeBaseUrl = oldNodeBaseUrl
    this._newNodeBaseUrl = newNodeBaseUrl
    this._dataFilePath = dataFilePath
    this._data = data
  }

  get oldNodeBaseUrl(): string {
    return this._oldNodeBaseUrl
  }

  get newNodeBaseUrl(): string {
    return this._newNodeBaseUrl
  }

  get dataFilePath(): string {
    return this._dataFilePath
  }

  get data(): any {
    return this._data
  }
}
