import { SetupServer, setupServer } from 'msw/node'
import { RequestHandler } from 'msw/lib/core/handlers/RequestHandler'

export class MockServer {
  private readonly server: SetupServer
  private _recordedRequests: Array<Request> = []

  get recordedRequests() {
    return this._recordedRequests
  }

  constructor(...handlers: Array<RequestHandler>) {
    this.server = setupServer(...handlers)
    this.server.events.on('request:start', ({ request }) => {
      this._recordedRequests.push(request)
    })
  }

  listen() {
    this.server.listen()
  }
  close() {
    this.server.close()
  }

  reset(...nextHandlers: Array<RequestHandler>) {
    this.server.resetHandlers(...nextHandlers)
    this._recordedRequests = []
  }

  use(...handlers: Array<RequestHandler>) {
    this.server.use(...handlers)
  }
}
