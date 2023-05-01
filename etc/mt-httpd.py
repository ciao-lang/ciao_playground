import sys
import http.server

# (Allow CORS)
class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', '*')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

def serve(port):
    # handler = http.server.SimpleHTTPRequestHandler
    handler = CORSRequestHandler
    handler.extensions_map.update({
        '.wasm': 'application/wasm' # still not official
    })
    httpd = http.server.ThreadingHTTPServer(("", port), handler)
    httpd.serve_forever()

if __name__ == "__main__":
    serve(int(sys.argv[1]))
