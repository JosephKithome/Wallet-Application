import { Role } from "../models/schema";
import { CustomLogger } from '../utils/logger';
import jwt from 'jsonwebtoken';


class RolesService{

    // private logger = new CustomLogger();

    async createRole(roleData: any, token: string): Promise<{ success: boolean; role?: any; error?: string }> {
        
        // this.logger.logInfo('createRole payload: ' + JSON.stringify(roleData));
        console.log('createRole payload', JSON.stringify(roleData));

        try {

            const { name, description, created_by, is_active, created_at, updated_at } = roleData;

            // Check if the authorization header is missing
            if (!token || token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            // Check if the token is null
            if (token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            let payload: any;

            try {
                // Verify the token
                payload = jwt.verify(token, `${process.env.SECRET_KEY}`);
            } catch (error) {
                return { success: false, error: "Unauthorized" };
            }

            // Check if payload is valid
            if (!payload || typeof payload === 'string') {
                return { success: false, error: "Unauthorized" };
            }
             // Check if the token has expired
             if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
            }
            // Extract userId from payload
            const userId = payload.subject;

            // Check if the Role already  exists   
            const existingRole = await Role.findOne({ name: name });
            if (existingRole) {
                return { success: false, error: "Role already exists" };
            }

            // Check if name is empty when creating a new wallet
            if (!name) {
                return { success: false, error: "Name of the role cannot be empty" };
            }

            // Create a new wallet for the user
            const role = new Role({
                name: name,
                description: description,
                created_by: created_by,
                is_active: true,
                created_at: created_at,
                updated_at: updated_at,
            })
            await role.save();

            return { success: true, role: role };
        } catch (error: any) {
            // this.logger.logError('Error creating Role:', error.message.toString());
            return { success: false, error: error.message.toString() };
        }
    }

    async listRoles(token: string): Promise<{ success: boolean; roles?: any; error?: string }> {
        
        // this.logger.logInfo('createRole payload: ' + JSON.stringify(roleData));
        console.log('Listing roles');

        try {

            // Check if the authorization header is missing
            if (!token || token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            // Check if the token is null
            if (token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            let payload: any;

            try {
                // Verify the token
                payload = jwt.verify(token, `${process.env.SECRET_KEY}`);
            } catch (error) {
                return { success: false, error: "Unauthorized" };
            }

            // Check if payload is valid
            if (!payload || typeof payload === 'string') {
                return { success: false, error: "Unauthorized" };
            }
             // Check if the token has expired
             if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
            }
            // Extract userId from payload
            const userId = payload.subject;

      

           const roles = await Role.find();

            return { success: true, roles: roles };
        } catch (error: any) {
            // this.logger.logError('Error creating Role:', error.message.toString());
            return { success: false, error: error.message.toString() };
        }
    }

    async listById(roleId: string, token: string): Promise<{ success: boolean; role?: any; error?: string }> {
        
        // this.logger.logInfo('createRole payload: ' + JSON.stringify(roleData));
        console.log('Listing role by ID');

        try {

            // Check if the authorization header is missing
            if (!token || token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            // Check if the token is null
            if (token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            let payload: any;

            try {
                // Verify the token
                payload = jwt.verify(token, `${process.env.SECRET_KEY}`);
            } catch (error) {
                return { success: false, error: "Unauthorized" };
            }

            // Check if payload is valid
            if (!payload || typeof payload === 'string') {
                return { success: false, error: "Unauthorized" };
            }
             // Check if the token has expired
             if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
            }
            // Extract userId from payload
            const userId = payload.subject;

      

           const role = await Role.findOne({_id: roleId});

            return { success: true, role: role };
        } catch (error: any) {
            // this.logger.logError('Error creating Role:', error.message.toString());
            return { success: false, error: error.message.toString() };
        }
    }

    async updateRole(roleData: any, token: string): Promise<{ success: boolean; role?: any; error?: string }> {
        
        // this.logger.logInfo('createRole payload: ' + JSON.stringify(roleData));
        console.log('Updating role', roleData);
        const roleId  = roleData._id;
        const { name, description, created_by, is_active, created_at, updated_at } = roleData;

        try {

            // Check if the authorization header is missing
            if (!token || token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            // Check if the token is null
            if (token === "null") {
                return { success: false, error: "Unauthorized" };
            }

            let payload: any;

            try {
                // Verify the token
                payload = jwt.verify(token, `${process.env.SECRET_KEY}`);
            } catch (error) {
                return { success: false, error: "Unauthorized" };
            }

            // Check if payload is valid
            if (!payload || typeof payload === 'string') {
                return { success: false, error: "Unauthorized" };
            }
             // Check if the token has expired
             if (payload.expiresAt && payload.expiresAt < Math.floor(Date.now() / 1000)) {
                return { success: false, error: "Token has expired" };
            }
            // Extract userId from payload
            const userId = payload.subject;

            // Check if the Role already  exists   
            console.log("Role IDDDD", roleId);
            const existingRole = await Role.findOne({ _id: roleId });
            if (!existingRole) {
                return { success: false, error: `No Role was found with id ${roleId}` };
            }

            // update a new role for the user

            existingRole.name = name;
            existingRole.description = description;
            existingRole.updated_at = updated_at;
            const role  = await existingRole.save();

            return { success: true, role: role };
        } catch (error: any) {
            // this.logger.logError('Error creating Role:', error.message.toString());
            return { success: false, error: error.message.toString() };
        }
    }
}

export default RolesService;