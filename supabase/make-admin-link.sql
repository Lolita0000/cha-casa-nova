-- Creates the secret key of the admin link. Run it once in the SQL Editor after
-- replacing the text below with a long random key (at least 24 characters).
-- The panel is then at https://<user>.github.io/<repo>/#/admin?chave=<the key>
insert into public.admin_link_keys (key_hash)
values (encode(sha256(convert_to('TROQUE-POR-UMA-CHAVE-LONGA-E-ALEATORIA', 'UTF8')), 'hex'));
