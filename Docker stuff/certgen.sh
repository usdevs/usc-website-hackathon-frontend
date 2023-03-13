#!/bin/bash
mkdir -p certs && cd $_
mkcert -install
mkcert -key-file frontend.localhost.key -cert-file frontend.localhost.crt frontend.localhost *.frontend.localhost
# mkcert -key-file bar.test.key -cert-file bar.test.crt bar.test *.bar.test
# mkcert -key-file baz.test.key -cert-file baz.test.crt baz.test *.baz.test
