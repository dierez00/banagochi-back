import { Request, Response } from 'express';
import projectsService from '../services/projects.service';

export class ProjectsController {
    // Create a new project
    async createProject(req: Request, res: Response): Promise<void> {
        try {
            const project = await projectsService.createProject(req.body);
            res.status(201).json({
                success: true,
                message: 'Project created successfully',
                data: project
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error creating project'
            });
        }
    }

    // Get all projects
    async getAllProjects(req: Request, res: Response): Promise<void> {
        try {
            const { status, colonia, active } = req.query;
            
            const filters: any = {};
            if (status) filters.status = status;
            if (colonia) filters.colonia = colonia;
            if (active !== undefined) filters.active = active === 'true';

            const projects = await projectsService.getAllProjects(filters);
            res.status(200).json({
                success: true,
                count: projects.length,
                data: projects
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching projects'
            });
        }
    }

    // Get project by ID
    async getProjectById(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const project = await projectsService.getProjectById(id);
            
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: project
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching project'
            });
        }
    }

    // Update project
    async updateProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const project = await projectsService.updateProject(id, req.body);
            
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Project updated successfully',
                data: project
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error updating project'
            });
        }
    }

    // Delete project (soft delete)
    async deleteProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const project = await projectsService.deleteProject(id);
            
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Project deleted successfully',
                data: project
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error deleting project'
            });
        }
    }

    // Permanent delete project
    async permanentDeleteProject(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const deleted = await projectsService.permanentDeleteProject(id);
            
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Project permanently deleted'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error permanently deleting project'
            });
        }
    }

    // Add vote to project
    async addVote(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { voterId } = req.body;

            if (!voterId) {
                res.status(400).json({
                    success: false,
                    message: 'Voter ID is required'
                });
                return;
            }

            const project = await projectsService.addVote(id, voterId);
            
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Vote added successfully',
                data: project
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error adding vote'
            });
        }
    }

    // Add funding to project
    async addFunding(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { amount } = req.body;

            if (!amount || amount <= 0) {
                res.status(400).json({
                    success: false,
                    message: 'Valid funding amount is required'
                });
                return;
            }

            const project = await projectsService.addFunding(id, amount);
            
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Funding added successfully',
                data: project
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error adding funding'
            });
        }
    }

    // Add feed item to project
    async addFeedItem(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { type, text, imageUrl } = req.body;

            if (!type || !text) {
                res.status(400).json({
                    success: false,
                    message: 'Feed type and text are required'
                });
                return;
            }

            const project = await projectsService.addFeedItem(id, { type, text, imageUrl });
            
            if (!project) {
                res.status(404).json({
                    success: false,
                    message: 'Project not found'
                });
                return;
            }

            res.status(200).json({
                success: true,
                message: 'Feed item added successfully',
                data: project
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error adding feed item'
            });
        }
    }

    // Get projects by colonia
    async getProjectsByColonia(req: Request, res: Response): Promise<void> {
        try {
            const { colonia } = req.params;
            const projects = await projectsService.getProjectsByColonia(colonia);
            
            res.status(200).json({
                success: true,
                count: projects.length,
                data: projects
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching projects by colonia'
            });
        }
    }

    // Get projects by status
    async getProjectsByStatus(req: Request, res: Response): Promise<void> {
        try {
            const { status } = req.params;
            const projects = await projectsService.getProjectsByStatus(status);
            
            res.status(200).json({
                success: true,
                count: projects.length,
                data: projects
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching projects by status'
            });
        }
    }

    // Get projects by proposer
    async getProjectsByProposer(req: Request, res: Response): Promise<void> {
        try {
            const { proposerId } = req.params;
            const projects = await projectsService.getProjectsByProposer(proposerId);
            
            res.status(200).json({
                success: true,
                count: projects.length,
                data: projects
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Error fetching projects by proposer'
            });
        }
    }
}

export default new ProjectsController();