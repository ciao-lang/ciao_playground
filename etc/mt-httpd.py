import sys
import http.server

def serve(port):
    handler = http.server.SimpleHTTPRequestHandler
    handler.extensions_map.update({
        '.wasm': 'application/wasm' # still not official
    })
    httpd = http.server.ThreadingHTTPServer(("", port), handler)
    httpd.serve_forever()

if __name__ == "__main__":
    serve(int(sys.argv[1]))
