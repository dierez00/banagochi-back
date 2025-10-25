import { Router } from 'express';
import projectsController from '../controllers/projects.controller';

const router = Router();

// Basic CRUD routes
router.post('/', projectsController.createProject.bind(projectsController));
router.get('/', projectsController.getAllProjects.bind(projectsController));
router.get('/:id', projectsController.getProjectById.bind(projectsController));
router.put('/:id', projectsController.updateProject.bind(projectsController));
router.delete('/:id', projectsController.deleteProject.bind(projectsController));
router.delete('/:id/permanent', projectsController.permanentDeleteProject.bind(projectsController));

// Special operations
router.post('/:id/vote', projectsController.addVote.bind(projectsController));
router.post('/:id/funding', projectsController.addFunding.bind(projectsController));
router.post('/:id/feed', projectsController.addFeedItem.bind(projectsController));

// Filter routes
router.get('/colonia/:colonia', projectsController.getProjectsByColonia.bind(projectsController));
router.get('/status/:status', projectsController.getProjectsByStatus.bind(projectsController));
router.get('/proposer/:proposerId', projectsController.getProjectsByProposer.bind(projectsController));

export default router;