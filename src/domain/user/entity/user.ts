export class User {
  constructor (
    private readonly id: string,
    private readonly name: string,
    private readonly email: string,
    private readonly password: string
  ) { }

  public getId (): string {
    return this.id
  }

  public getName (): string {
    return this.name
  }

  public getEmail (): string {
    return this.email
  }

  public getPassword (): string {
    return this.password
  }
}
