declare module 'superwstest' {
  import { Server, ClientRequestArgs } from 'http';
  import WebSocket from 'ws';
  import { SuperTest, Test } from 'supertest';

  type JsonObject = { [member: string]: JsonValue };
  interface JsonArray extends Array<JsonValue> {}
  type JsonValue = JsonObject | JsonArray | string | number | boolean | null;

  interface WSChain extends Promise<WebSocket> {
    send(message: any, options?: { mask?: boolean; binary?: boolean; compress?: boolean; fin?: boolean }): this;
    sendText(message: any): this;
    sendJson(message: JsonValue): this;
    sendBinary(message: Uint8Array | Buffer | ArrayBuffer | number[]): this;

    wait(milliseconds: number): this;
    exec(fn: (ws: WebSocket) => (Promise<void> | void)): this;

    expectMessage<T>(
      conversion: (received: string) => T,
      expected?: T | null,
    ): this;

    expectMessage<T>(
      conversion: (received: string) => T,
      test: (message: T) => boolean,
    ): this;

    expectText(expected?: string | RegExp | ((message: string) => boolean)): this;
    expectJson(expected?: JsonValue | ((message: any) => boolean)): this;
    expectBinary(expected?: Uint8Array | Buffer | ArrayBuffer | number[] | ((message: Uint8Array) => boolean)): this;

    close(code?: number, reason?: string): this;
    expectClosed(
      expectedCode?: number | null,
      expectedReason?: string | null,
    ): this;

    expectConnectionError(expectedCode?: number | null): Promise<WebSocket>;
  }

  interface SuperWSTest extends SuperTest<Test> {
    ws(path: string, options?: WebSocket.ClientOptions | ClientRequestArgs): WSChain;
    ws(path: string, protocols?: string | string[], options?: WebSocket.ClientOptions | ClientRequestArgs): WSChain;
  }

  interface RequestOptions {
    shutdownDelay?: number;
  }

  function request(
    app: Server | string,
    options?: RequestOptions,
  ): SuperWSTest;

  namespace request {
    function closeAll(): void;
  }

  export = request;
}
