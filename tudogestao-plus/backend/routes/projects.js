// Projects Routes
const express = require('express');
const router = express.Router();

// Mock database (em produção, usar MongoDB ou PostgreSQL)
let projects = [
    {
        id: 1,
        name: "ERP Financeiro",
        description: "Desenvolvimento do módulo financeiro completo para o ERP",
        startDate: "2025-01-15",
        endDate: "2025-12-15",
        status: "progress",
        progress: 65,
        manager: "João Silva",
        team: ["Maria Santos", "Pedro Oliveira", "Ana Costa"],
        tasks: 15,
        completed: 10,
        createdAt: new Date()
    }
];

// GET all projects
router.get('/', (req, res) => {
    try {
        const { status, search } = req.query;
        
        let filteredProjects = [...projects];
        
        if (status) {
            filteredProjects = filteredProjects.filter(p => p.status === status);
        }
        
        if (search) {
            filteredProjects = filteredProjects.filter(p => 
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase())
            );
        }
        
        res.json({
            success: true,
            data: filteredProjects,
            total: filteredProjects.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET project by ID
router.get('/:id', (req, res) => {
    try {
        const project = projects.find(p => p.id === parseInt(req.params.id));
        
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Projeto não encontrado'
            });
        }
        
        res.json({
            success: true,
            data: project
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST create project
router.post('/', (req, res) => {
    try {
        const { name, description, startDate, endDate, manager, team } = req.body;
        
        if (!name || !description || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                error: 'Campos obrigatórios faltando'
            });
        }
        
        const newProject = {
            id: projects.length + 1,
            name,
            description,
            startDate,
            endDate,
            status: 'progress',
            progress: 0,
            manager: manager || 'Não atribuído',
            team: team || [],
            tasks: 0,
            completed: 0,
            createdAt: new Date()
        };
        
        projects.push(newProject);
        
        res.status(201).json({
            success: true,
            data: newProject,
            message: 'Projeto criado com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// PUT update project
router.put('/:id', (req, res) => {
    try {
        const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id));
        
        if (projectIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Projeto não encontrado'
            });
        }
        
        projects[projectIndex] = {
            ...projects[projectIndex],
            ...req.body,
            updatedAt: new Date()
        };
        
        res.json({
            success: true,
            data: projects[projectIndex],
            message: 'Projeto atualizado com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// DELETE project
router.delete('/:id', (req, res) => {
    try {
        const projectIndex = projects.findIndex(p => p.id === parseInt(req.params.id));
        
        if (projectIndex === -1) {
            return res.status(404).json({
                success: false,
                error: 'Projeto não encontrado'
            });
        }
        
        projects.splice(projectIndex, 1);
        
        res.json({
            success: true,
            message: 'Projeto deletado com sucesso'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET project statistics
router.get('/:id/statistics', (req, res) => {
    try {
        const project = projects.find(p => p.id === parseInt(req.params.id));
        
        if (!project) {
            return res.status(404).json({
                success: false,
                error: 'Projeto não encontrado'
            });
        }
        
        const statistics = {
            projectId: project.id,
            totalTasks: project.tasks,
            completedTasks: project.completed,
            progress: project.progress,
            teamSize: project.team.length,
            daysRemaining: Math.ceil((new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)),
            status: project.status
        };
        
        res.json({
            success: true,
            data: statistics
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
