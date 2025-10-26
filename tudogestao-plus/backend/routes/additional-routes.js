// Tasks Routes
const express = require('express');
const tasksRouter = express.Router();

let tasks = [
    {
        id: 1,
        title: "Implementar autenticação",
        description: "Desenvolver sistema de login e autenticação JWT",
        status: "todo",
        priority: "high",
        assignee: "João Silva",
        projectId: 1,
        createdAt: new Date()
    }
];

tasksRouter.get('/', (req, res) => {
    const { status, projectId } = req.query;
    let filteredTasks = [...tasks];
    
    if (status) filteredTasks = filteredTasks.filter(t => t.status === status);
    if (projectId) filteredTasks = filteredTasks.filter(t => t.projectId === parseInt(projectId));
    
    res.json({ success: true, data: filteredTasks });
});

tasksRouter.post('/', (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        ...req.body,
        createdAt: new Date()
    };
    tasks.push(newTask);
    res.status(201).json({ success: true, data: newTask });
});

tasksRouter.put('/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: 'Tarefa não encontrada' });
    
    tasks[index] = { ...tasks[index], ...req.body };
    res.json({ success: true, data: tasks[index] });
});

tasksRouter.delete('/:id', (req, res) => {
    const index = tasks.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: 'Tarefa não encontrada' });
    
    tasks.splice(index, 1);
    res.json({ success: true, message: 'Tarefa deletada' });
});

// Team Routes
const teamRouter = express.Router();

let team = [
    {
        id: 1,
        name: "João Silva",
        role: "Desenvolvedor Full Stack",
        email: "joao.silva@tudogestao.com",
        phone: "+5511999999999",
        avatar: "https://ui-avatars.com/api/?name=Joao+Silva&background=4f46e5&color=fff",
        tasks: 8,
        completed: 5,
        description: "Especialista em desenvolvimento web"
    }
];

teamRouter.get('/', (req, res) => {
    res.json({ success: true, data: team });
});

teamRouter.get('/:id', (req, res) => {
    const member = team.find(m => m.id === parseInt(req.params.id));
    if (!member) return res.status(404).json({ success: false, error: 'Membro não encontrado' });
    res.json({ success: true, data: member });
});

teamRouter.post('/', (req, res) => {
    const newMember = {
        id: team.length + 1,
        ...req.body,
        createdAt: new Date()
    };
    team.push(newMember);
    res.status(201).json({ success: true, data: newMember });
});

teamRouter.put('/:id', (req, res) => {
    const index = team.findIndex(m => m.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: 'Membro não encontrado' });
    
    team[index] = { ...team[index], ...req.body };
    res.json({ success: true, data: team[index] });
});

teamRouter.delete('/:id', (req, res) => {
    const index = team.findIndex(m => m.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: 'Membro não encontrado' });
    
    team.splice(index, 1);
    res.json({ success: true, message: 'Membro removido' });
});

// Documents Routes
const documentsRouter = express.Router();

let documents = [
    {
        id: 1,
        name: "Projeto ERP",
        type: "folder",
        parentId: null,
        createdAt: new Date()
    }
];

documentsRouter.get('/', (req, res) => {
    const { parentId } = req.query;
    let filteredDocs = documents;
    
    if (parentId !== undefined) {
        filteredDocs = documents.filter(d => d.parentId === (parentId ? parseInt(parentId) : null));
    }
    
    res.json({ success: true, data: filteredDocs });
});

documentsRouter.post('/', (req, res) => {
    const newDoc = {
        id: documents.length + 1,
        ...req.body,
        createdAt: new Date()
    };
    documents.push(newDoc);
    res.status(201).json({ success: true, data: newDoc });
});

documentsRouter.delete('/:id', (req, res) => {
    const index = documents.findIndex(d => d.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: 'Documento não encontrado' });
    
    documents.splice(index, 1);
    res.json({ success: true, message: 'Documento deletado' });
});

// Validations Routes
const validationsRouter = express.Router();

let validations = [
    {
        id: 1,
        title: "Relatório de Progresso - ERP Financeiro",
        author: "João Silva",
        date: new Date(),
        type: "report",
        status: "pending"
    }
];

validationsRouter.get('/', (req, res) => {
    const { status } = req.query;
    let filteredValidations = validations;
    
    if (status) {
        filteredValidations = validations.filter(v => v.status === status);
    }
    
    res.json({ success: true, data: filteredValidations });
});

validationsRouter.post('/:id/approve', (req, res) => {
    const index = validations.findIndex(v => v.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: 'Validação não encontrada' });
    
    validations[index].status = 'approved';
    validations[index].approvedAt = new Date();
    validations[index].approvedBy = req.body.approvedBy || 'Admin';
    
    res.json({ success: true, data: validations[index], message: 'Validação aprovada' });
});

validationsRouter.post('/:id/reject', (req, res) => {
    const index = validations.findIndex(v => v.id === parseInt(req.params.id));
    if (index === -1) return res.status(404).json({ success: false, error: 'Validação não encontrada' });
    
    validations[index].status = 'rejected';
    validations[index].rejectedAt = new Date();
    validations[index].rejectedBy = req.body.rejectedBy || 'Admin';
    validations[index].feedback = req.body.feedback || '';
    
    res.json({ success: true, data: validations[index], message: 'Validação rejeitada' });
});

validationsRouter.post('/', (req, res) => {
    const newValidation = {
        id: validations.length + 1,
        ...req.body,
        status: 'pending',
        createdAt: new Date()
    };
    validations.push(newValidation);
    res.status(201).json({ success: true, data: newValidation });
});

module.exports = {
    tasksRouter,
    teamRouter,
    documentsRouter,
    validationsRouter
};
