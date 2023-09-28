FROM scratch
ARG TARGETPLATFORM
ENV CLOUDFLARE_API_BASEURL=https://api.cloudflare.com/client/v4 \
    CLOUDFLARE_API_AUTHTOKEN=s3cr3t \
    PORT=3000 \
    SSL_INSECURE=true \
    PATH="/bin:/usr/bin:/usr/local/bin"
COPY bin/$TARGETPLATFORM /bin/cfmanui
ENTRYPOINT ["/bin/cfmanui"]
