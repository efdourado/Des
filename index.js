const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const users = [];
const tasks = {
  'Iniciante': [
    { id: 1, description: 'Hello Word' },
    { id: 2, description: 'Calculadora' },
    { id: 3, description: 'Conversor de temperatura' }
  ],
  'Intermediário': [
    { id: 4, description: 'Número primo' },
    { id: 5, description: 'a definir' },
    { id: 6, description: 'a definir' }
  ],
  'Avançado': [
    { id: 7, description: 'a definir' },
    { id: 8, description: 'a definir' },
    { id: 9, description: 'a definir' }
  ]
};

const portfolio = [];

//(token simples)
const generateToken = () => 'jwt-token-here';

//(envio de e-mail)
const sendEmail = (email, subject, message) => {
  console.log(`Email enviado para ${email}: ${subject} - ${message}`);
};

//(rotas)
app.get('/', (req, res) => {
  res.send('Bem-vindo ao DevClass');
});

// (Sign Up)
app.post('/signup', (req, res) => {
  const { nome, email, password, telefone } = req.body;
  const newUser = { id: users.length + 1, nome, email, password, telefone };
  users.push(newUser);
  res.json({ message: 'Cadastro feito com sucesso', userId: newUser.id });
});

// (Login)
app.post('/login', (req, res) => {
  const { email, password, lembrarMe } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    const token = generateToken();
    res.json({
      message: 'Logado com sucesso',
      token: lembrarMe ? `${token}-longer-expiration` : token
    });
  } else {
    res.status(400).json({ message: 'Email ou Senha inválida' });
  }
});

//(esqueci Minha Senha)
app.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    sendEmail(email, 'Resetar a senha', 'Clique aqui para resetar sua senha');
    res.json({ message: 'Link para resetar a senha enviado para seu email com sucesso' });
  } else {
    res.status(400).json({ message: 'Erro: Email não encontrado' });
  }
});

//(redefinir Senha)
app.post('/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    user.password = newPassword;
    res.json({ message: 'Nova senha cadastrada com sucesso' });
  } else {
    res.status(400).json({ message: 'Erro: Email não encontrado' });
  }
});

//(reenviar Link de Redefinição)
app.post('/resend-reset-link', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    sendEmail(email, 'Redefinição de senha', 'Clique aqui para redefinir sua senha');
    res.json({ message: 'Link para resetar a senha enviado para seu email com sucesso' });
  } else {
    res.status(400).json({ message: 'Erro: Email não encontrado' });
  }
});

//(criar portfólio)
app.post('/portfolio', (req, res) => {
  const { userId, projects } = req.body;
  portfolio.push({ userId, projects });
  res.json({ message: 'Portfólio criado com sucesso' });
});

//(modos e tarefas)
app.get('/modes', (req, res) => {
  res.json({
    modes: [
      { id: 'Iniciante' },
      { id: 'Intermediário' },
      { id: 'Avançado' }
    ]
  });
});

app.get('/modes/:modeId/tasks', (req, res) => {
  const { modeId } = req.params;
  res.json({ tasks: tasks[modeId] || [] });
});

//(botão "feito" - marcar tarefa como concluída)
app.post('/tasks/:taskId/done', (req, res) => {
  const { taskId } = req.params;
  const task = Object.values(tasks).flat().find(t => t.id === parseInt(taskId));
  if (task) {
    res.json({ message: 'Tarefa concluída' });
  } else {
    res.status(400).json({ message: 'Erro: Tarefa não encontrada' });
  }
});

//(botão "resolução" - mostrar código da tarefa)
app.get('/tasks/:taskId/solution', (req, res) => {
  const { taskId } = req.params;
  const task = Object.values(tasks).flat().find(t => t.id === parseInt(taskId));
  if (task) {
    res.json({
      solution: "const reverseString = (str) => str.split('').reverse().join('');"
    });
  } else {
    res.status(400).json({ message: 'Erro: Tarefa não encontrada' });
  }
});

//(Iniciar servidor)
app.listen(3000, () => console.log('Servidor iniciado na porta 3000.'));