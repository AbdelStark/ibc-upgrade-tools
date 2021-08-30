export class Config {
  private readonly _oldNodeBaseUrl: string

  private readonly _newNodeBaseUrl: string

  private readonly _dataFilePath: string

  constructor(oldNodeBaseUrl: string, newNodeBaseUrl: string, dataFilePath: string) {
    this._oldNodeBaseUrl = oldNodeBaseUrl
    this._newNodeBaseUrl = newNodeBaseUrl
    this._dataFilePath = dataFilePath
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
}
