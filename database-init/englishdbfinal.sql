-- create database fieelaboratories;
-- SESSION
CREATE TABLE public.session (
    sid character varying PRIMARY KEY NOT NULL,
    sess json NOT NULL,
    expire timestamp(6) without time zone NOT NULL
);
--TABLA USUARIOS
create table users (
    id serial primary key not null,
    names_user varchar(100),
    surnames_user varchar(100),
    code_user int UNIQUE,
    email_user varchar(100) not NULL UNIQUE,
    password_user varchar(100) not NULL,
    --controla boolean,
    id_userrol int
);
--CREAR TABLA TIPOSUSUARIOS
create table usersroles (
    id serial primary key not null,
    name_userrol varchar(100) not NULL UNIQUE
);
--CREAR TABLA LABORATORIOS
create table laboratories (
    id serial primary key not null UNIQUE,
    name_laboratory varchar(100) not null UNIQUE,
    id_icon int
);
--CREAR TABLA CURSOS
create table courses (
    id serial primary key not null,
    name_course varchar(100) not null UNIQUE,
    id_imagecourse int,
    id_laboratory int
);
--CREAR TABLA TIPOSEQUIPOS
create table equipmentstypes (
    id serial primary key not null,
    name_equipmenttype varchar(100) not null UNIQUE,
    id_connectiontype int,
    id_imageequipmenttype int
);
--CREAR TABLA MESAS
create table modules (
    id serial primary key not null,
    name_module varchar(100) not null,
    id_laboratory int
);
--CREAR TABLA GRUPOSHORARIOS
create table schedulesgroups (
    id serial primary key not null,
    name_schedulegroup varchar(100) not null,
    id_course int
);
--CREAR TABLA EQUIPOS
create table equipments (
    id serial primary key not null,
    name_equipment varchar(100) not null,
    ip_equipment varchar(30),
    port_equipment varchar(10),
    connectionroute_equipment varchar (100),
    password_equipment varchar (50),
    id_equipmenttype int,
    id_module int
);
--CREAR TABLA DIASYHORAS
create table schedules (
    id serial primary key not null,
    day_schedule varchar(50) not null,
    starttime_schedule time not null,
    endtime_schedule time not null,
    id_schedulegroup int
    /* falta añadir */
);
--CREAR TABLA MATRICULADOS
create table enrolleds (
    id serial primary key not null,
    id_user int,
    id_course int,
    id_module int,
    id_schedulegroup int
);
--CREAR TABLA GRUPOSYDIASCONHORAS
/* create table groupsdaysandtimes (
 id serial primary key not null,
 day_groupdaytime varchar(50) not null,
 starttime_groupdaytime time not null,
 endtime_groupdaytime time not null,
 id_schedulegroup int
 ); */
--CREAR TABLA CONTROL EQUIPOS
create table equipmentscontrol (
    id serial primary key not null,
    id_enrolled int,
    id_equipment int
);
/* NUEVOOOOOOOOOOO */
/* nueva tabla de imagenes e iconos */
create table imagescourses(
    id serial primary key not null,
    name_imagecourse varchar(100) UNIQUE
);
/* nueva tabla de imagenes e iconos */
create table imagesequipmentstypes(
    id serial primary key not null,
    name_imageequipmenttype varchar(100) UNIQUE
);
/* NUEVOOOOOOOOOOO */
create table icons(
    id serial primary key not null,
    name_icon varchar(100) UNIQUE
);
/* funcionalidad */
create table connectiontypes(
    id serial primary key not null,
    name_connectiontype varchar(100)
);
---------- LLAVES FORÁNEAS -----------
--CREAR LLAVES FORÁNEA GRUPOSYDIASCONHORAS
alter table schedules
add constraint FKschedulesgroups foreign key(id_schedulegroup) references schedulesgroups (id) on delete cascade;
--CREAR LLAVES FORÁNEA TIPOSUSUARIOS
alter table users
add constraint FKusersroles foreign key(id_userrol) references usersroles (id) on delete cascade;
--CREAR LLAVES FORÁNEAS CURSOS
alter table courses
add constraint FKlaboratories foreign key(id_laboratory) references laboratories (id) on delete cascade;
--CREAR LLAVES FORÁNEAS MESAS
alter table modules
add constraint FKlaboratories foreign key(id_laboratory) references laboratories (id) on delete cascade;
--CREAR LLAVES FORÁNEAS GRUPOSHORARIOS
alter table schedulesgroups
add constraint FKcourses foreign key(id_course) references courses (id) on delete cascade;
--CREAR LLAVES FORÁNEAS EQUIPOS
alter table equipments
add constraint FKequipmentstypes foreign key(id_equipmenttype) references equipmentstypes (id) on delete cascade;
alter table equipments
add constraint FKmodules foreign key(id_module) references modules (id) on delete cascade;
--CREAR LLAVES FORÁNEAS MATRICULADOS
alter table enrolleds
add constraint FKusers foreign key(id_user) references users (id) on delete cascade;
alter table enrolleds
add constraint FKcourses foreign key(id_course) references courses (id) on delete cascade;
alter table enrolleds
add constraint FKmodules foreign key(id_module) references modules (id) on delete cascade;
alter table enrolleds
add constraint FKschedulesgroups foreign key(id_schedulegroup) references schedulesgroups (id) on delete cascade;
/* falta websocket y id usuario para control en el equipo que es una llave foranea al id usuario de la tabla usuarios */
alter table equipmentscontrol
add constraint FKenrolleds foreign key(id_enrolled) references enrolleds (id) on delete cascade;
alter table equipmentscontrol
add constraint FKequipments foreign key(id_equipment) references equipments (id) on delete cascade;
/* llaves fornaeas imagenes */
alter table laboratories
add constraint FKicons foreign key(id_icon) references icons (id) on delete cascade;
/* NUEVOOOOOOOOOO */
alter table courses
add constraint FKimages foreign key(id_imagecourse) references imagescourses (id) on delete cascade;
alter table equipmentstypes
add constraint FKimages foreign key(id_imageequipmenttype) references imagesequipmentstypes (id) on delete cascade;
/* NUEVOOOOOOOOO */
/* equipmentstypes */
alter table equipmentstypes
add constraint FKconnectiontype foreign key(id_connectiontype) references connectiontypes (id) on delete cascade;
/* INSERTAR ROLES DE ADMINISTRADOR */
insert into usersroles (name_userrol)
values ('Administrador');
insert into usersroles (name_userrol)
values ('Profesor');
insert into usersroles (name_userrol)
values ('Alumno');
/* SI NO HAY USUARIO REGISTRADO */
insert into users (
        names_user,
        surnames_user,
        email_user,
        password_user,
        id_userrol
    )
values (
        'administrador',
        'administrador',
        'administrador',
        'administrador',
        '1'
    );
/* inserta icono no icon */
insert into icons (name_icon)
values ('noiconset-1');
/* inserta icono no image */
insert into imagescourses (name_imagecourse)
values ('noimageset-1');
insert into imagesequipmentstypes (name_imageequipmenttype)
values ('noimageset-1');
/* inserta connection type shell and novnc */
insert into connectiontypes (name_connectiontype)
values ('Ninguno');
insert into connectiontypes (name_connectiontype)
values ('Novnc');
insert into connectiontypes (name_connectiontype)
values ('Shell');
/* AÑADIDOS PARA AGREGAR RUTA A ICONOS E IMAGENES */
insert into icons (name_icon)
values('analyzer-1');
insert into icons (name_icon)
values('analyzer-2');
insert into icons (name_icon)
values('antenna-1');
insert into icons (name_icon)
values('antenna-2');
insert into icons (name_icon)
values('automatization-1');
insert into icons (name_icon)
values('chip-1');
insert into icons (name_icon)
values('control-1');
insert into icons (name_icon)
values('control-2');
insert into icons (name_icon)
values('course-1');
insert into icons (name_icon)
values('desktop-1');
insert into icons (name_icon)
values('electromagnetic-1');
insert into icons (name_icon)
values('electromagnetic-2');
insert into icons (name_icon)
values('generator-1');
insert into icons (name_icon)
values('motor-1');
insert into icons (name_icon)
values('multimeter-1');
insert into icons (name_icon)
values('oscilloscope-1');
insert into icons (name_icon)
values('processor-1');
insert into icons (name_icon)
values('protoboard-1');
insert into icons (name_icon)
values('router-1');
insert into icons (name_icon)
values('switch-1');
insert into icons (name_icon)
values('vr-1');
insert into icons (name_icon)
values('server-1');
/* images equipment types */
insert into imagesequipmentstypes (name_imageequipmenttype)
values('keysight-analyzer-N9915A');
insert into imagesequipmentstypes (name_imageequipmenttype)
values('keysight-generator-N5172B');
insert into imagesequipmentstypes (name_imageequipmenttype)
values('laptop');
insert into imagesequipmentstypes (name_imageequipmenttype)
values('R&S-FSH4');
insert into imagesequipmentstypes (name_imageequipmenttype)
values('R&S-SMC100A');
insert into imagesequipmentstypes (name_imageequipmenttype)
values('switch-2960');
insert into imagesequipmentstypes (name_imageequipmenttype)
values('router-2901');
insert into imagesequipmentstypes (name_imageequipmenttype)
values('raspberry');
/*  */
insert into imagescourses (name_imagecourse)
values('antenas');
insert into imagescourses (name_imagecourse)
values('rf');
insert into imagescourses (name_imagecourse)
values('redes-conectividad');