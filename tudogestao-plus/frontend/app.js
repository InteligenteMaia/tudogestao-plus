// TudoGestão+ - Sistema ERP Profissional
// Data Management
const data = {
    projects: [
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
            completed: 10
        },
        {
            id: 2,
            name: "Sistema CRM",
            description: "Implementação de sistema de gestão de relacionamento com clientes",
            startDate: "2025-02-01",
            endDate: "2025-11-30",
            status: "progress",
            progress: 45,
            manager: "Maria Santos",
            team: ["João Silva", "Lucas Ferreira"],
            tasks: 12,
            completed: 5
        },
        {
            id: 3,
            name: "DataHub Intelligence",
            description: "Plataforma de análise de dados e dashboards",
            startDate: "2025-01-01",
            endDate: "2025-06-30",
            status: "completed",
            progress: 100,
            manager: "Pedro Oliveira",
            team: ["Ana Costa", "Carlos Silva"],
            tasks: 20,
            completed: 20
        }
    ],
    tasks: [
        {
            id: 1,
            title: "Implementar autenticação",
            description: "Desenvolver sistema de login e autenticação JWT",
            status: "todo",
            priority: "high",
            assignee: "João Silva",
            projectId: 1
        },
        {
            id: 2,
            title: "Criar dashboard administrativo",
            description: "Interface para gerenciamento do sistema",
            status: "inprogress",
            priority: "high",
            assignee: "Maria Santos",
            projectId: 1
        },
        {
            id: 3,
            title: "Integração com API de pagamento",
            description: "Conectar com gateway de pagamento",
            status: "review",
            priority: "medium",
            assignee: "Pedro Oliveira",
            projectId: 1
        },
        {
            id: 4,
            title: "Testes unitários",
            description: "Criar testes para módulos principais",
            status: "done",
            priority: "medium",
            assignee: "Ana Costa",
            projectId: 1
        }
    ],
    team: [
        {
            id: 1,
            name: "João Silva",
            role: "Desenvolvedor Full Stack",
            avatar: "https://ui-avatars.com/api/?name=Joao+Silva&background=4f46e5&color=fff",
            email: "joao.silva@tudogestao.com",
            tasks: 8,
            completed: 5,
            description: "Especialista em desenvolvimento web com foco em JavaScript, React e Node.js. Responsável pela arquitetura do sistema e implementação de funcionalidades críticas."
        },
        {
            id: 2,
            name: "Maria Santos",
            role: "Gerente de Projetos",
            avatar: "https://ui-avatars.com/api/?name=Maria+Santos&background=10b981&color=fff",
            email: "maria.santos@tudogestao.com",
            tasks: 6,
            completed: 4,
            description: "Profissional certificada PMP com expertise em metodologias ágeis. Coordena equipes multidisciplinares e garante a entrega de projetos dentro do prazo e orçamento."
        },
        {
            id: 3,
            name: "Pedro Oliveira",
            role: "Designer UX/UI",
            avatar: "https://ui-avatars.com/api/?name=Pedro+Oliveira&background=f59e0b&color=fff",
            email: "pedro.oliveira@tudogestao.com",
            tasks: 5,
            completed: 5,
            description: "Designer especializado em experiência do usuário e interfaces modernas. Cria protótipos e mantém a consistência visual em todos os produtos."
        },
        {
            id: 4,
            name: "Ana Costa",
            role: "Analista de Qualidade",
            avatar: "https://ui-avatars.com/api/?name=Ana+Costa&background=8b5cf6&color=fff",
            email: "ana.costa@tudogestao.com",
            tasks: 7,
            completed: 6,
            description: "Especialista em testes e garantia de qualidade. Realiza testes manuais e automatizados, assegurando a confiabilidade e performance do sistema."
        },
        {
            id: 5,
            name: "Lucas Ferreira",
            role: "DevOps Engineer",
            avatar: "https://ui-avatars.com/api/?name=Lucas+Ferreira&background=ef4444&color=fff",
            email: "lucas.ferreira@tudogestao.com",
            tasks: 4,
            completed: 3,
            description: "Engenheiro DevOps com experiência em AWS, Docker e Kubernetes. Gerencia infraestrutura, CI/CD e automação de deploys."
        },
        {
            id: 6,
            name: "Carlos Silva",
            role: "Analista de Dados",
            avatar: "https://ui-avatars.com/api/?name=Carlos+Silva&background=0ea5e9&color=fff",
            email: "carlos.silva@tudogestao.com",
            tasks: 6,
            completed: 4,
            description: "Analista com expertise em Business Intelligence e Data Science. Desenvolve dashboards analíticos e modelos preditivos para suporte à decisão."
        }
    ],
    documents: [
        {
            id: 1,
            name: "Projeto ERP",
            type: "folder",
            children: [
                { id: 2, name: "Documentação", type: "folder", children: [] },
                { id: 3, name: "Requisitos.pdf", type: "file", size: "2.5 MB" },
                { id: 4, name: "Arquitetura.docx", type: "file", size: "1.8 MB" }
            ]
        },
        {
            id: 5,
            name: "Relatórios",
            type: "folder",
            children: [
                { id: 6, name: "Mensal_Janeiro.pdf", type: "file", size: "850 KB" },
                { id: 7, name: "Trimestral_Q1.pdf", type: "file", size: "1.2 MB" }
            ]
        }
    ],
    validations: [
        {
            id: 1,
            title: "Relatório de Progresso - ERP Financeiro",
            author: "João Silva",
            date: "2025-10-25",
            type: "report",
            status: "pending"
        },
        {
            id: 2,
            title: "Documentação de API",
            author: "Maria Santos",
            date: "2025-10-24",
            type: "documentation",
            status: "pending"
        },
        {
            id: 3,
            title: "Código Frontend - Dashboard",
            author: "Pedro Oliveira",
            date: "2025-10-23",
            type: "code",
            status: "pending"
        }
    ]
};

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initializeSidebar();
    initializeNavigation();
    initializeModals();
    loadDashboard();
    loadProjects();
    loadTasks();
    loadTeam();
    loadDocuments();
    loadValidations();
    initializeForms();
    initializeCharts();
});

// Sidebar functionality
function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Navigation
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const pages = document.querySelectorAll('.page-content');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Hide all pages
            pages.forEach(p => p.classList.remove('active'));
            
            // Show selected page
            const pageName = this.dataset.page;
            const selectedPage = document.getElementById(`${pageName}-page`);
            if (selectedPage) {
                selectedPage.classList.add('active');
            }
            
            // Update header
            const pageTitle = this.textContent.trim();
            document.getElementById('pageTitle').textContent = pageTitle;
            document.getElementById('breadcrumb').textContent = `Início > ${pageTitle}`;
        });
    });
}

// Modal functionality
function initializeModals() {
    const newProjectBtn = document.getElementById('newProjectBtn');
    const projectModal = document.getElementById('projectModal');
    const closeButtons = document.querySelectorAll('.modal-close');
    
    newProjectBtn.addEventListener('click', () => {
        projectModal.classList.add('active');
    });
    
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Load Dashboard
function loadDashboard() {
    // This is already loaded in HTML, but we can update with real data here
    console.log('Dashboard loaded');
}

// Load Projects
function loadProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    projectsGrid.innerHTML = data.projects.map(project => `
        <div class="project-card">
            <div class="project-header">
                <div>
                    <h3 class="project-title">${project.name}</h3>
                    <p class="project-description">${project.description}</p>
                </div>
                <span class="project-status status-${project.status}">
                    ${getStatusText(project.status)}
                </span>
            </div>
            
            <div class="project-meta">
                <div><i class="fas fa-calendar"></i> ${formatDate(project.startDate)}</div>
                <div><i class="fas fa-tasks"></i> ${project.completed}/${project.tasks} tarefas</div>
            </div>
            
            <div class="project-progress">
                <div class="project-progress-bar">
                    <div class="project-progress-fill" style="width: ${project.progress}%"></div>
                </div>
                <small>${project.progress}% completo</small>
            </div>
            
            <div class="project-team">
                <div class="team-avatars">
                    ${project.team.map(member => `
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(member)}&background=random" 
                             alt="${member}" title="${member}">
                    `).join('')}
                </div>
                <button class="btn-icon-sm" onclick="viewProject(${project.id})">
                    <i class="fas fa-arrow-right"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Load Tasks (Kanban Board)
function loadTasks() {
    const todoColumn = document.getElementById('todoColumn');
    const inProgressColumn = document.getElementById('inProgressColumn');
    const reviewColumn = document.getElementById('reviewColumn');
    const doneColumn = document.getElementById('doneColumn');
    
    if (!todoColumn) return;
    
    const todoTasks = data.tasks.filter(t => t.status === 'todo');
    const inProgressTasks = data.tasks.filter(t => t.status === 'inprogress');
    const reviewTasks = data.tasks.filter(t => t.status === 'review');
    const doneTasks = data.tasks.filter(t => t.status === 'done');
    
    todoColumn.innerHTML = renderTasks(todoTasks);
    inProgressColumn.innerHTML = renderTasks(inProgressTasks);
    reviewColumn.innerHTML = renderTasks(reviewTasks);
    doneColumn.innerHTML = renderTasks(doneTasks);
}

function renderTasks(tasks) {
    return tasks.map(task => `
        <div class="task-card" draggable="true">
            <h4 class="task-title">${task.title}</h4>
            <p class="task-description">${task.description}</p>
            <div class="task-meta">
                <span class="task-priority priority-${task.priority}">${task.priority}</span>
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(task.assignee)}&background=random" 
                     alt="${task.assignee}" 
                     class="task-avatar"
                     title="${task.assignee}">
            </div>
        </div>
    `).join('');
}

// Load Team
function loadTeam() {
    const teamGrid = document.getElementById('teamGrid');
    if (!teamGrid) return;
    
    teamGrid.innerHTML = data.team.map(member => `
        <div class="member-card">
            <img src="${member.avatar}" alt="${member.name}" class="member-avatar">
            <h3 class="member-name">${member.name}</h3>
            <p class="member-role">${member.role}</p>
            <p style="font-size: 13px; color: var(--text-secondary); margin-bottom: 15px;">
                ${member.description}
            </p>
            <div class="member-stats">
                <div class="member-stat">
                    <div class="member-stat-value">${member.tasks}</div>
                    <div class="member-stat-label">Tarefas</div>
                </div>
                <div class="member-stat">
                    <div class="member-stat-value">${member.completed}</div>
                    <div class="member-stat-label">Concluídas</div>
                </div>
                <div class="member-stat">
                    <div class="member-stat-value">${Math.round(member.completed/member.tasks*100)}%</div>
                    <div class="member-stat-label">Taxa</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Load Documents
function loadDocuments() {
    const folderTree = document.getElementById('folderTree');
    if (!folderTree) return;
    
    folderTree.innerHTML = renderFolderTree(data.documents);
}

function renderFolderTree(items, level = 0) {
    return items.map(item => {
        const icon = item.type === 'folder' ? 'fa-folder' : 'fa-file';
        const padding = level * 20;
        
        let html = `
            <div class="folder-item" style="padding-left: ${padding}px">
                <i class="fas ${icon}"></i>
                <span>${item.name}</span>
                ${item.size ? `<span style="margin-left: auto; color: var(--text-secondary); font-size: 12px">${item.size}</span>` : ''}
            </div>
        `;
        
        if (item.children && item.children.length > 0) {
            html += renderFolderTree(item.children, level + 1);
        }
        
        return html;
    }).join('');
}

// Load Validations
function loadValidations() {
    const validationsList = document.getElementById('validationsList');
    if (!validationsList) return;
    
    validationsList.innerHTML = data.validations.map(validation => `
        <div class="validation-item">
            <div class="validation-info">
                <h4>${validation.title}</h4>
                <p>Por ${validation.author} • ${formatDate(validation.date)}</p>
            </div>
            <div class="validation-actions">
                <button class="btn-validate" onclick="approveValidation(${validation.id})">
                    <i class="fas fa-check"></i> Aprovar
                </button>
                <button class="btn-reject" onclick="rejectValidation(${validation.id})">
                    <i class="fas fa-times"></i> Rejeitar
                </button>
            </div>
        </div>
    `).join('');
}

// Initialize Forms
function initializeForms() {
    // Report Form
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        // Populate project select
        const reportProject = document.getElementById('reportProject');
        reportProject.innerHTML = '<option value="">Selecione...</option>' + 
            data.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
        
        reportForm.addEventListener('submit', handleReportGeneration);
    }
    
    // Communication Form
    const communicationForm = document.getElementById('communicationForm');
    if (communicationForm) {
        // Populate recipients
        const recipients = document.getElementById('recipients');
        recipients.innerHTML = data.team.map(m => 
            `<option value="${m.id}">${m.name} - ${m.role}</option>`
        ).join('');
        
        communicationForm.addEventListener('submit', handleCommunication);
    }
    
    // ABNT Form
    const abntForm = document.getElementById('abntForm');
    if (abntForm) {
        const abntProject = document.getElementById('abntProject');
        abntProject.innerHTML = '<option value="">Selecione...</option>' + 
            data.projects.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
        
        abntForm.addEventListener('submit', handleABNTGeneration);
    }
    
    // New Project Form
    const newProjectForm = document.getElementById('newProjectForm');
    if (newProjectForm) {
        const projectManager = document.getElementById('projectManager');
        const projectTeam = document.getElementById('projectTeam');
        
        projectManager.innerHTML = '<option value="">Selecione...</option>' + 
            data.team.map(m => `<option value="${m.id}">${m.name}</option>`).join('');
        
        projectTeam.innerHTML = data.team.map(m => 
            `<option value="${m.id}">${m.name} - ${m.role}</option>`
        ).join('');
        
        newProjectForm.addEventListener('submit', handleNewProject);
    }
    
    // Send Report Email
    const sendReportEmail = document.getElementById('sendReportEmail');
    if (sendReportEmail) {
        sendReportEmail.addEventListener('click', () => {
            alert('Relatório enviado por email com sucesso! ✉️');
        });
    }
    
    // Send Report WhatsApp
    const sendReportWhatsApp = document.getElementById('sendReportWhatsApp');
    if (sendReportWhatsApp) {
        sendReportWhatsApp.addEventListener('click', () => {
            alert('Relatório enviado por WhatsApp com sucesso! 📱');
        });
    }
    
    // GitHub Connect
    const connectGitHub = document.getElementById('connectGitHub');
    if (connectGitHub) {
        connectGitHub.addEventListener('click', () => {
            alert('Conectando ao GitHub... Esta funcionalidade requer configuração de API.');
        });
    }
    
    // Upload Document
    const uploadDocBtn = document.getElementById('uploadDocBtn');
    if (uploadDocBtn) {
        uploadDocBtn.addEventListener('click', () => {
            alert('Funcionalidade de upload em desenvolvimento.');
        });
    }
}

// Form Handlers
function handleReportGeneration(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    showNotification('Gerando relatório...', 'info');
    
    setTimeout(() => {
        showNotification('Relatório gerado com sucesso! 📄', 'success');
    }, 2000);
}

function handleCommunication(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    showNotification('Enviando comunicação...', 'info');
    
    setTimeout(() => {
        showNotification('Comunicação enviada com sucesso! 📧', 'success');
        e.target.reset();
    }, 1500);
}

function handleABNTGeneration(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    showNotification('Gerando documento ABNT...', 'info');
    
    setTimeout(() => {
        showNotification('Documento ABNT gerado com sucesso! 📑', 'success');
    }, 2000);
}

function handleNewProject(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    showNotification('Criando projeto...', 'info');
    
    setTimeout(() => {
        showNotification('Projeto criado com sucesso! 🎉', 'success');
        closeModal('projectModal');
        e.target.reset();
        loadProjects();
    }, 1500);
}

// Initialize Charts
function initializeCharts() {
    // Projects Chart
    const projectsChart = document.getElementById('projectsChart');
    if (projectsChart) {
        new Chart(projectsChart, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Projetos Concluídos',
                    data: [2, 3, 4, 3, 5, 6, 8],
                    borderColor: '#4f46e5',
                    backgroundColor: 'rgba(79, 70, 229, 0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
    
    // Tasks Chart
    const tasksChart = document.getElementById('tasksChart');
    if (tasksChart) {
        new Chart(tasksChart, {
            type: 'doughnut',
            data: {
                labels: ['A Fazer', 'Em Progresso', 'Em Revisão', 'Concluído'],
                datasets: [{
                    data: [5, 3, 2, 8],
                    backgroundColor: ['#f59e0b', '#4f46e5', '#0ea5e9', '#10b981']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Utility Functions
function getStatusText(status) {
    const statusMap = {
        'progress': 'Em Andamento',
        'completed': 'Concluído',
        'delayed': 'Atrasado'
    };
    return statusMap[status] || status;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
}

function viewProject(projectId) {
    alert(`Visualizando projeto ${projectId}`);
}

function approveValidation(validationId) {
    showNotification('Validação aprovada com sucesso! ✅', 'success');
    // Remove from list
    const validation = data.validations.find(v => v.id === validationId);
    if (validation) {
        data.validations = data.validations.filter(v => v.id !== validationId);
        loadValidations();
    }
}

function rejectValidation(validationId) {
    showNotification('Validação rejeitada. Feedback enviado ao autor. ❌', 'warning');
    // Remove from list
    const validation = data.validations.find(v => v.id === validationId);
    if (validation) {
        data.validations = data.validations.filter(v => v.id !== validationId);
        loadValidations();
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#4f46e5'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('TudoGestão+ inicializado com sucesso! 🚀');
