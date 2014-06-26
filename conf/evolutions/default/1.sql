# --- Created by Slick DDL
# To stop Slick DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table "INGREDIENT" ("ID" SERIAL NOT NULL PRIMARY KEY,"NAME" VARCHAR(254) NOT NULL);
create unique index "unique_ingredient_name" on "INGREDIENT" ("NAME");
create table "RECIPES" ("ID" SERIAL NOT NULL PRIMARY KEY,"NAME" VARCHAR(254) NOT NULL,"DESCRIPTION" VARCHAR(254) NOT NULL,"INSTRUCTIONS" text NOT NULL,"USER_ID" BIGINT NOT NULL);
create table "RECIPE_INGREDIENT" ("ID" SERIAL NOT NULL PRIMARY KEY,"UNIT" VARCHAR(254) NOT NULL,"AMOUNT" FLOAT NOT NULL,"RECIPE_ID" BIGINT NOT NULL,"INGREDIENT_ID" BIGINT NOT NULL);
create table "USERS" ("ID" SERIAL NOT NULL PRIMARY KEY,"LOGINNAME" VARCHAR(254) NOT NULL,"PASSWORD" VARCHAR(254) NOT NULL,"DISPLAYNAME" VARCHAR(254) NOT NULL);
create unique index "unique_loginname" on "USERS" ("LOGINNAME");
alter table "RECIPES" add constraint "USER_FK" foreign key("USER_ID") references "USERS"("ID") on update NO ACTION on delete NO ACTION;
alter table "RECIPE_INGREDIENT" add constraint "RECIPE_FK" foreign key("RECIPE_ID") references "RECIPES"("ID") on update NO ACTION on delete NO ACTION;
alter table "RECIPE_INGREDIENT" add constraint "INGREDIENT_FK" foreign key("INGREDIENT_ID") references "INGREDIENT"("ID") on update NO ACTION on delete NO ACTION;

# --- !Downs

alter table "RECIPES" drop constraint "USER_FK";
alter table "RECIPE_INGREDIENT" drop constraint "RECIPE_FK";
alter table "RECIPE_INGREDIENT" drop constraint "INGREDIENT_FK";
drop table "INGREDIENT";
drop table "RECIPES";
drop table "RECIPE_INGREDIENT";
drop table "USERS";

