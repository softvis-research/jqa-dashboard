FROM neo4j:latest

ENV NEO4J_PASSWD neo4j
ENV NEO4J_AUTH neo4j/${NEO4J_PASSWD}

COPY petclinic.dump /var/lib/neo4j/import/

VOLUME /data

CMD bin/neo4j-admin set-initial-password ${NEO4J_PASSWD} || true && \
    bin/neo4j-admin load --from=/var/lib/neo4j/import/petclinic.dump --force && \
    bin/neo4j start && sleep 5 && \
    tail -f logs/neo4j.log