/**
 * Domain-level error hierarchy.
 * Outer layers map these to HTTP / transport errors.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EntityNotFoundError extends DomainError {
  constructor(entity: string, id: string) {
    super(`${entity} with id "${id}" not found`);
  }
}

export class BusinessRuleViolationError extends DomainError {}
