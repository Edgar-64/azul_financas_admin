- Este é o dashboard de Gerenciamento do App Mobile Azul Finanças, desenvolvido com Next.js, Tailwind CSS e Lucide-React. O painel conta com controle de usuários, relatórios interativos e configurações globais do aplicativo.

- Para enviar o projeto ou salvá-lo como backup, é fundamental remover as pastas de dependências e de build, que são muito pesadas (~300MB+). Não se preocupe: elas podem ser geradas novamente em segundos.

- Comando para limpeza (na raiz do projeto):
rmdir /s /q node_modules
rmdir /s /q .next
del package-lock.json

- Se você acabou de baixar o projeto e ele não tem a pasta node_modules, siga estes passos:
  1-Abra o terminal na pasta do projeto e digite:
    npm install

  2-Inicie o servidor de desenvolvimento:
    npm run dev

  3-Acesse o painel:
    Abra o navegador em http://localhost:3000/