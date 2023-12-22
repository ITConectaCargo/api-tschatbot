import app  from './App'

const port = process.env.PORT || 3333;

const server = app.listen(port, () => {
  console.log(`Servidor escutando em http://localhost:${port}`)
})

process.on('SIGINT', () => {
  server.close()
  console.log("App finalizado")
})
