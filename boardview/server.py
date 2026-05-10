from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


def main() -> None:
    server = ThreadingHTTPServer(("127.0.0.1", 8080), SimpleHTTPRequestHandler)
    print("Serving board at http://127.0.0.1:8080")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
