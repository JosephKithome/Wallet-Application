import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import RolesService from "../../services/RolesService";
import { CustomLogger } from '../../utils/logger';
export class RoleController{

    // private logger = new CustomLogger();

    async createRole(req: Request, resp: Response) {
        // this.logger.logInfo('create role', JSON.stringify(req));
        try {
            const roleData = req.body;

            const roleService = new RolesService();

            const token = req.headers.authorization?.split(' ')[1];

            const result = await roleService.createRole(roleData, token || "");

            if (result.success) {
                resp.status(200).json({ message: "Role created successfully" });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).send("Error occurred while creating a role.");
        }
    }

    async listRoles(req: Request, resp: Response) {
   
        try {
            const roleService = new RolesService();
            const token = req.headers.authorization?.split(' ')[1];

            const result = await roleService.listRoles(token || "");
            if (result.success) {
                resp.status(200).json({ message: result.roles });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).send("Error occurred while creating a role.");
        }
    }

    async listById(req: Request, resp: Response) {
   
        try {
            const roleService = new RolesService();
            const token = req.headers.authorization?.split(' ')[1];
            const roleId = req.params.roleId;
            const result = await roleService.listById(roleId,token || "");
            if (result.success) {
                resp.status(200).json({ message: result.role });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).send("Error occurred while creating a role.");
        }
    }

    async updateRole(req: Request, resp: Response) {
        // this.logger.logInfo('create role', JSON.stringify(req));
        try {

            const roleData = req.body
    
            const roleService = new RolesService();

            const token = req.headers.authorization?.split(' ')[1];

            const result = await roleService.updateRole(roleData, token || "");
            
            if (result.success) {
                resp.status(200).json({ message: "Role updated successfully", data: roleData });
            } else {
                resp.status(400).json({ error: result.error });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).send("Error occurred while updating a role.");
        }
    }
}