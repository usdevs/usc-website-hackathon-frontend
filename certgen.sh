#!/bin/bash
mkdir -p certs && cd $_
mkcert -install
mkcert -key-file frontend.local.dev.key -cert-file frontend.local.dev.crt frontend.local.dev *.frontend.local.dev
# mkcert -key-file bar.test.key -cert-file bar.test.crt bar.test *.bar.test
# mkcert -key-file baz.test.key -cert-file baz.test.crt baz.test *.baz.test
