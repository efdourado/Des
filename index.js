const express = require('express');
const bodyParser = require('body-parser');
//======================================
const mongoose = require('mongoose');
var cors = require('cors');
//======================================
mongoose.connect('mongodb+srv://eduardo61772:jIqrrkpKT5TwtZUm@cluster0.dvl2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => {
  console.log('conectado ao mongo');
})
.catch((err) => {
  console.error('erro', err.message);
});
//======================================
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
//======================================
const userController = require('./controllers/UserController');
// rotas

// store
app.post('/store', userController.store);
// destroy
app.delete('/user/:id', userController.destroy);
// update
app.put('/user/:id', userController.update);
// show
app.get('/show', userController.show);
// show (email)
// ex: /show/email/?email=vc@gmail.com
app.get('/show/email/*', userController.showe);

// main page
app.get('/', (req, res) => {
  res.send('hello');
});

// modos e tarefas
app.get('/modes', (req, res) => {
  res.json({
    modes: [
      { id: 'Iniciante' },
      { id: 'Intermediário' },
      { id: 'Avançado' }
    ]
  });
});


/*
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

// (Esqueci minha senha)
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

// (Redefinir senha)
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

// (Reenviar link de redefinição)
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

// (Criar portfólio)
app.post('/portfolio', (req, res) => {
  const { userId, projects } = req.body;
  portfolio.push({ userId, projects });
  res.json({ message: 'Portfólio criado com sucesso' });
});

app.get('/modes/:modeId/tasks', (req, res) => {
  const { modeId } = req.params;
  res.json({ tasks: tasks[modeId] || [] });
});

// (Botão "feito" - marcar tarefa como concluída)
app.post('/tasks/:taskId/done', (req, res) => {
  const { taskId } = req.params;
  const task = Object.values(tasks).flat().find(t => t.id === parseInt(taskId));
  if (task) {
    res.json({ message: 'Tarefa concluída' });
  } else {
    res.status(400).json({ message: 'Erro: Tarefa não encontrada' });
  }
});

// (Botão "resolução" - mostrar código da tarefa)
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

// (Alterar Email)
app.post('/account/:userId/update-email', (req, res) => {
  const { userId } = req.params;
  const { newEmail } = req.body;
  const user = users.find(u => u.id === parseInt(userId));
  if (user) {
    user.email = newEmail;
    sendEmail(user.email, 'Alteração de Email', 'Clique aqui para confirmar a alteração do seu email');
    res.json({ message: 'Link de confirmação para alteração de email enviado para seu endereço de email' });
  } else {
    res.status(400).json({ message: 'Erro: Usuário não encontrado' });
  }
});

// (Alterar Telefone)
app.post('/account/:userId/update-phone', (req, res) => {
  const { userId } = req.params;
  const { newPhone } = req.body;
  const user = users.find(u => u.id === parseInt(userId));
  if (user) {
    user.telefone = newPhone;
    sendEmail(user.email, 'Alteração de Telefone', 'Clique aqui para confirmar a alteração do seu número de telefone');
    res.json({ message: 'Link de confirmação para alteração de telefone enviado para seu endereço de email' });
  } else {
    res.status(400).json({ message: 'Erro: Usuário não encontrado' });
  }
});

// (Alterar Idioma)
app.post('/account/:userId/update-language', (req, res) => {
  const { userId } = req.params;
  const { language } = req.body; // 'port', 'en', 'es'

  const user = users.find(u => u.id === parseInt(userId));
  if (user) {
    user.language = language;
    sendEmail(user.email, 'Confirmar alteração de idioma', `Clique aqui para confirmar a alteração do seu idioma para ${language}.`);
    res.json({ message: 'Link de confirmação enviado para seu e-mail.' });
  } else {
    res.status(400).json({ message: 'Erro: Usuário não encontrado' });
  }
});

// (Procurar Membro)
app.get('/account/:userId/search-member', (req, res) => {
  const { userId } = req.params;
  const { searchQuery } = req.query; // Nome ou e-mail do membro a ser procurado

  const user = users.find(u => u.id === parseInt(userId));
  if (user) {
    const foundUsers = users.filter(u => u.nome.includes(searchQuery) || u.email.includes(searchQuery));
    res.json({ members: foundUsers });
  } else {
    res.status(400).json({ message: 'Erro: Usuário não encontrado' });
  }
});

// (Adicionar Membro)
app.post('/account/:userId/add-member', (req, res) => {
  const { userId } = req.params;
  const { memberId } = req.body; // ID do membro a ser adicionado

  const user = users.find(u => u.id === parseInt(userId));
  const memberToAdd = users.find(u => u.id === parseInt(memberId));

  if (user && memberToAdd) {
    user.members = user.members || [];
    user.members.push(memberToAdd);
    res.json({ message: 'Membro adicionado com sucesso' });
  } else {
    res.status(400).json({ message: 'Erro: Usuário ou Membro não encontrado' });
  }
});

// (Confirmar Alteração de Email)
app.post('/account/:userId/confirm-email', (req, res) => {
  const { userId } = req.params;
  const { confirmationCode } = req.body;

  const user = users.find(u => u.id === parseInt(userId));
  if (user && confirmationCode) {
    user.emailConfirmed = true;
    res.json({ message: 'Alteração de email confirmada com sucesso' });
  } else {
    res.status(400).json({ message: 'Erro: Código de confirmação inválido ou usuário não encontrado' });
  }
});

// (Confirmar Alteração de Telefone)
app.post('/account/:userId/confirm-phone', (req, res) => {
  const { userId } = req.params;
  const { confirmationCode } = req.body;

  const user = users.find(u => u.id === parseInt(userId));
  if (user && confirmationCode) {
    user.phoneConfirmed = true;
    res.json({ message: 'Alteração de telefone confirmada com sucesso' });
  } else {
    res.status(400).json({ message: 'Erro: Código de confirmação inválido ou usuário não encontrado' });
  }
});

*/

// iniciar server
app.listen(3000, () => console.log('iniciado (3000)'));
