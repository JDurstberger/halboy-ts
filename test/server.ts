import { SetupServer, setupServer } from 'msw/node'
import { RequestHandler } from 'msw/lib/core/handlers/RequestHandler'

export class MockServer {
  private readonly server: SetupServer
  readonly recordedRequests: Array<Request> = []

  constructor(...handlers: Array<RequestHandler>) {
    this.server = setupServer(...handlers)
    this.server.events.on('request:start', ({ request }) => {
      this.recordedRequests.push(request)
    })
  }

  listen() {
    this.server.listen()
  }
  close() {
    this.server.close()
  }

  resetHandlers(...nextHandlers: Array<RequestHandler>) {
    this.server.resetHandlers(...nextHandlers)
  }

  use(...handlers: Array<RequestHandler>) {
    this.server.use(...handlers)
  }
}
