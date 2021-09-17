/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable no-unused-vars */
import { NextFunction, Request, Response } from 'express';

abstract class Services {
    // Get All Elements
    public static getAll(req: Request, res: Response, next?: NextFunction): void {}

    // Get Element By Id
    public static getById(req: Request, res: Response, next?: NextFunction): void {}

    // Remove By Id
    public static removeById(req: Request, res: Response, next?: NextFunction): void {}

    // Create new Element
    public static create(req: Request, res: Response, next?: NextFunction): void {}

    // Modify Element by Id
    public static modify(req: Request, res: Response, next?: NextFunction): void {}
}

export default Services;
