export class Config {
  private readonly _oldNodeBaseUrl: string

  private readonly _newNodeBaseUrl: string

  constructor(oldNodeBaseUrl: string, newNodeBaseUrl: string) {
    this._oldNodeBaseUrl = oldNodeBaseUrl
    this._newNodeBaseUrl = newNodeBaseUrl
  }

  get oldNodeBaseUrl(): string {
    return this._oldNodeBaseUrl
  }

  get newNodeBaseUrl(): string {
    return this._newNodeBaseUrl
  }
}
