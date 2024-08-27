create table if not exists items (
    id serial primary key,
    name varchar(50) not null,
    harga numeric(10, 2) not null,
    tanggal date not null
);
