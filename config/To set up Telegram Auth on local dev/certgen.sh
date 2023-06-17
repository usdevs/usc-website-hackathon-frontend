#!/bin/bash
mkdir -p certs && cd $_
mkcert -install
mkcert -key-file frontend.local.dev.key -cert-file frontend.local.dev.crt frontend.local.dev *.frontend.local.dev
