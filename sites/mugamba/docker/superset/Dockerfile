FROM apache/superset:4.1.2
USER root
RUN apt-get update && apt-get install -y default-libmysqlclient-dev build-essential pkg-config
RUN pip install psycopg2-binary pymysql mysqlclient
USER superset