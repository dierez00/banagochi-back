import { Project, IProject } from '../models/projects.model';
import { Types } from 'mongoose';

export class ProjectsService {
    // Create a new project
    async createProject(projectData: Partial<IProject>): Promise<IProject> {
        try {
            const project = new Project(projectData);
            return await project.save();
        } catch (error) {
            throw new Error(`Error creating project: ${error}`);
        }
    }

    // Get all projects (with optional filters)
    async getAllProjects(filters?: {
        status?: string;
        colonia?: string;
        active?: boolean;
    }): Promise<IProject[]> {
        try {
            const query: any = {};
            
            if (filters?.status) query.status = filters.status;
            if (filters?.colonia) query.colonia = filters.colonia;
            if (filters?.active !== undefined) query.active = filters.active;

            return await Project.find(query)
                .populate('proposerId', 'name email')
                .populate('votingStats.voters', 'name')
                .sort({ creationDate: -1 });
        } catch (error) {
            throw new Error(`Error fetching projects: ${error}`);
        }
    }

    // Get project by ID
    async getProjectById(id: string): Promise<IProject | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error('Invalid project ID');
            }
            
            return await Project.findById(id)
                .populate('proposerId', 'name email')
                .populate('votingStats.voters', 'name');
        } catch (error) {
            throw new Error(`Error fetching project: ${error}`);
        }
    }

    // Update project
    async updateProject(id: string, updateData: Partial<IProject>): Promise<IProject | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error('Invalid project ID');
            }

            updateData.updatedDate = new Date();
            
            return await Project.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            )
                .populate('proposerId', 'name email')
                .populate('votingStats.voters', 'name');
        } catch (error) {
            throw new Error(`Error updating project: ${error}`);
        }
    }

    // Soft delete project
    async deleteProject(id: string): Promise<IProject | null> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error('Invalid project ID');
            }

            return await Project.findByIdAndUpdate(
                id,
                { 
                    $set: { 
                        active: false, 
                        deleteDate: new Date() 
                    } 
                },
                { new: true }
            );
        } catch (error) {
            throw new Error(`Error deleting project: ${error}`);
        }
    }

    // Hard delete project (permanent)
    async permanentDeleteProject(id: string): Promise<boolean> {
        try {
            if (!Types.ObjectId.isValid(id)) {
                throw new Error('Invalid project ID');
            }

            const result = await Project.findByIdAndDelete(id);
            return result !== null;
        } catch (error) {
            throw new Error(`Error permanently deleting project: ${error}`);
        }
    }

    // Add vote to project
    async addVote(projectId: string, voterId: string): Promise<IProject | null> {
        try {
            if (!Types.ObjectId.isValid(projectId) || !Types.ObjectId.isValid(voterId)) {
                throw new Error('Invalid project or voter ID');
            }

            const voterObjectId = new Types.ObjectId(voterId);
            
            const project = await Project.findById(projectId);
            if (!project) {
                throw new Error('Project not found');
            }

            // Check if user already voted
            if (project.votingStats.voters.includes(voterObjectId)) {
                throw new Error('User already voted for this project');
            }

            project.votingStats.voters.push(voterObjectId);
            project.votingStats.votesFor += 1;

            // Check if voting goal is reached
            if (project.votingStats.votesFor >= project.votingStats.votesNeeded) {
                project.status = 'FUNDING';
            }

            project.updatedDate = new Date();
            return await project.save();
        } catch (error) {
            throw new Error(`Error adding vote: ${error}`);
        }
    }

    // Add funding to project
    async addFunding(projectId: string, amount: number): Promise<IProject | null> {
        try {
            if (!Types.ObjectId.isValid(projectId)) {
                throw new Error('Invalid project ID');
            }

            const project = await Project.findById(projectId);
            if (!project) {
                throw new Error('Project not found');
            }

            if (project.status !== 'FUNDING') {
                throw new Error('Project is not in funding stage');
            }

            project.currentAmount += amount;

            // Check if funding goal is reached
            if (project.currentAmount >= project.fundingGoal) {
                project.status = 'IN_PROGRESS';
            }

            project.updatedDate = new Date();
            return await project.save();
        } catch (error) {
            throw new Error(`Error adding funding: ${error}`);
        }
    }

    // Add feed item to project
    async addFeedItem(projectId: string, feedItem: {
        type: "MILESTONE" | "ESCROW_PAYMENT" | "UPDATE" | "COMPLETED";
        text: string;
        imageUrl?: string;
    }): Promise<IProject | null> {
        try {
            if (!Types.ObjectId.isValid(projectId)) {
                throw new Error('Invalid project ID');
            }

            const project = await Project.findById(projectId);
            if (!project) {
                throw new Error('Project not found');
            }

            project.feed.push({
                ...feedItem,
                timestamp: new Date()
            } as any);

            // If type is COMPLETED, update project status
            if (feedItem.type === 'COMPLETED') {
                project.status = 'COMPLETED';
            }

            project.updatedDate = new Date();
            return await project.save();
        } catch (error) {
            throw new Error(`Error adding feed item: ${error}`);
        }
    }

    // Get projects by colonia
    async getProjectsByColonia(colonia: string): Promise<IProject[]> {
        try {
            return await Project.find({ colonia, active: true })
                .populate('proposerId', 'name email')
                .sort({ creationDate: -1 });
        } catch (error) {
            throw new Error(`Error fetching projects by colonia: ${error}`);
        }
    }

    // Get projects by status
    async getProjectsByStatus(status: string): Promise<IProject[]> {
        try {
            return await Project.find({ status, active: true })
                .populate('proposerId', 'name email')
                .sort({ creationDate: -1 });
        } catch (error) {
            throw new Error(`Error fetching projects by status: ${error}`);
        }
    }

    // Get projects by proposer
    async getProjectsByProposer(proposerId: string): Promise<IProject[]> {
        try {
            if (!Types.ObjectId.isValid(proposerId)) {
                throw new Error('Invalid proposer ID');
            }

            return await Project.find({ proposerId, active: true })
                .sort({ creationDate: -1 });
        } catch (error) {
            throw new Error(`Error fetching projects by proposer: ${error}`);
        }
    }
}

export default new ProjectsService();
