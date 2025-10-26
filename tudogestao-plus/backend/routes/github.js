// GitHub Integration Routes
const express = require('express');
const router = express.Router();
const { Octokit } = require('@octokit/rest');

// Initialize Octokit (GitHub API client)
let octokit = null;

// Connect to GitHub
router.post('/connect', async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({
                success: false,
                error: 'Token do GitHub é obrigatório'
            });
        }
        
        octokit = new Octokit({ auth: token });
        
        // Test connection
        const { data: user } = await octokit.users.getAuthenticated();
        
        res.json({
            success: true,
            message: 'Conectado ao GitHub com sucesso',
            user: {
                login: user.login,
                name: user.name,
                email: user.email,
                avatar: user.avatar_url
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Create repository
router.post('/create-repository', async (req, res) => {
    try {
        if (!octokit) {
            return res.status(401).json({
                success: false,
                error: 'GitHub não conectado. Conecte primeiro.'
            });
        }
        
        const { name, description, private: isPrivate } = req.body;
        
        if (!name) {
            return res.status(400).json({
                success: false,
                error: 'Nome do repositório é obrigatório'
            });
        }
        
        const { data: repo } = await octokit.repos.createForAuthenticatedUser({
            name,
            description: description || '',
            private: isPrivate || false,
            auto_init: true
        });
        
        res.json({
            success: true,
            message: 'Repositório criado com sucesso',
            repository: {
                name: repo.name,
                fullName: repo.full_name,
                url: repo.html_url,
                cloneUrl: repo.clone_url
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// List repositories
router.get('/repositories', async (req, res) => {
    try {
        if (!octokit) {
            return res.status(401).json({
                success: false,
                error: 'GitHub não conectado. Conecte primeiro.'
            });
        }
        
        const { data: repos } = await octokit.repos.listForAuthenticatedUser({
            sort: 'updated',
            per_page: 100
        });
        
        const repositories = repos.map(repo => ({
            id: repo.id,
            name: repo.name,
            fullName: repo.full_name,
            description: repo.description,
            url: repo.html_url,
            private: repo.private,
            language: repo.language,
            stars: repo.stargazers_count,
            forks: repo.forks_count,
            updatedAt: repo.updated_at
        }));
        
        res.json({
            success: true,
            data: repositories,
            total: repositories.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Commit files to repository
router.post('/commit', async (req, res) => {
    try {
        if (!octokit) {
            return res.status(401).json({
                success: false,
                error: 'GitHub não conectado. Conecte primeiro.'
            });
        }
        
        const { owner, repo, path, content, message, branch } = req.body;
        
        if (!owner || !repo || !path || !content || !message) {
            return res.status(400).json({
                success: false,
                error: 'Dados incompletos para commit'
            });
        }
        
        // Get the file (if it exists) to get its SHA
        let sha = null;
        try {
            const { data: existingFile } = await octokit.repos.getContent({
                owner,
                repo,
                path,
                ref: branch || 'main'
            });
            sha = existingFile.sha;
        } catch (error) {
            // File doesn't exist, that's okay for new files
        }
        
        // Create or update file
        const { data: commit } = await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path,
            message,
            content: Buffer.from(content).toString('base64'),
            branch: branch || 'main',
            ...(sha && { sha })
        });
        
        res.json({
            success: true,
            message: 'Commit realizado com sucesso',
            commit: {
                sha: commit.commit.sha,
                url: commit.commit.html_url,
                message: commit.commit.message
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Auto-sync project to GitHub
router.post('/auto-sync', async (req, res) => {
    try {
        if (!octokit) {
            return res.status(401).json({
                success: false,
                error: 'GitHub não conectado. Conecte primeiro.'
            });
        }
        
        const { projectId, repositoryName } = req.body;
        
        if (!projectId || !repositoryName) {
            return res.status(400).json({
                success: false,
                error: 'Dados incompletos'
            });
        }
        
        // Get project files
        const projectFiles = await getProjectFiles(projectId);
        
        // Get authenticated user
        const { data: user } = await octokit.users.getAuthenticated();
        
        // Commit each file
        const commitResults = [];
        for (const file of projectFiles) {
            try {
                const result = await octokit.repos.createOrUpdateFileContents({
                    owner: user.login,
                    repo: repositoryName,
                    path: file.path,
                    message: `Auto-sync: ${file.name}`,
                    content: Buffer.from(file.content).toString('base64'),
                    branch: 'main'
                });
                
                commitResults.push({
                    file: file.name,
                    success: true,
                    sha: result.data.commit.sha
                });
            } catch (error) {
                commitResults.push({
                    file: file.name,
                    success: false,
                    error: error.message
                });
            }
        }
        
        res.json({
            success: true,
            message: 'Sincronização automática concluída',
            results: commitResults,
            totalFiles: projectFiles.length,
            successCount: commitResults.filter(r => r.success).length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Get commits
router.get('/commits/:owner/:repo', async (req, res) => {
    try {
        if (!octokit) {
            return res.status(401).json({
                success: false,
                error: 'GitHub não conectado. Conecte primeiro.'
            });
        }
        
        const { owner, repo } = req.params;
        const { branch, perPage } = req.query;
        
        const { data: commits } = await octokit.repos.listCommits({
            owner,
            repo,
            sha: branch || 'main',
            per_page: perPage || 20
        });
        
        const commitList = commits.map(commit => ({
            sha: commit.sha,
            message: commit.commit.message,
            author: commit.commit.author.name,
            date: commit.commit.author.date,
            url: commit.html_url
        }));
        
        res.json({
            success: true,
            data: commitList,
            total: commitList.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Helper function
async function getProjectFiles(projectId) {
    // Buscar arquivos do projeto do banco de dados ou sistema de arquivos
    // Esta é uma implementação simulada
    return [
        {
            name: 'README.md',
            path: 'README.md',
            content: '# Projeto ERP Financeiro\n\nDescrição do projeto...'
        },
        {
            name: 'index.js',
            path: 'src/index.js',
            content: 'console.log("Hello World");'
        },
        {
            name: 'package.json',
            path: 'package.json',
            content: JSON.stringify({
                name: 'erp-financeiro',
                version: '1.0.0',
                description: 'Sistema ERP Financeiro'
            }, null, 2)
        }
    ];
}

module.exports = router;
